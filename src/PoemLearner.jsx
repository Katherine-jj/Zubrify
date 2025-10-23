import React, { useEffect, useRef, useState } from 'react'
import { getPoems } from './directusApi';





// --- utils: normalization and alignment ---
function normalizeText(s) {
  if (!s) return ''
  try { s = s.normalize('NFKD') } catch (e) {}
  s = s.toLowerCase()
  s = s.replace(/[^Ѐ-ӿ\p{L}\p{N}\s]/gu, '') // keep letters, numbers, spaces (cyrillic/general)
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

function levenshtein(a, b) {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }
  return dp[m][n]
}

function wordSimilar(w1, w2, threshold = 0.6) {
  if (!w1 || !w2) return false
  if (w1 === w2) return true
  const lev = levenshtein(w1, w2)
  const maxLen = Math.max(w1.length, w2.length)
  if (maxLen === 0) return true
  const sim = 1 - lev / maxLen
  return sim >= threshold
}

function alignWords(expectedWords, actualWords) {
  const m = expectedWords.length, n = actualWords.length
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  const op = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null))
  for (let i = 0; i <= m; i++) { dp[i][0] = i; op[i][0] = i > 0 ? 'delete' : 'start' }
  for (let j = 0; j <= n; j++) { dp[0][j] = j; op[0][j] = j > 0 ? 'insert' : 'start' }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordSimilar(expectedWords[i - 1], actualWords[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1]
        op[i][j] = 'equal'
      } else {
        const subCost = dp[i - 1][j - 1] + 1
        const delCost = dp[i - 1][j] + 1
        const insCost = dp[i][j - 1] + 1
        const min = Math.min(subCost, delCost, insCost)
        dp[i][j] = min
        if (min === subCost) op[i][j] = 'replace'
        else if (min === delCost) op[i][j] = 'delete'
        else op[i][j] = 'insert'
      }
    }
  }

  let i = m, j = n
  const ops = []
  while (i > 0 || j > 0) {
    const cur = op[i][j]
    if (cur === 'equal' || cur === 'replace') {
      ops.unshift({ type: cur, expected: expectedWords[i - 1], actual: actualWords[j - 1] })
      i--; j--
    } else if (cur === 'delete') {
      ops.unshift({ type: 'delete', expected: expectedWords[i - 1], actual: null })
      i--
    } else if (cur === 'insert') {
      ops.unshift({ type: 'insert', expected: null, actual: actualWords[j - 1] })
      j--
    } else {
      break
    }
  }
  return ops
}

function compareText(expected, actual) {
  const ne = normalizeText(expected)
  const na = normalizeText(actual)
  const ew = ne ? ne.split(' ') : []
  const aw = na ? na.split(' ') : []
  const ops = alignWords(ew, aw)
  const matched = ops.filter(o => o.type === 'equal').length
  const accuracy = ew.length === 0 ? 0 : matched / ew.length
  return { accuracy, ops, expectedWords: ew, actualWords: aw }
}

// --- TTS & ASR helpers ---
function speakLines(lines, lang = 'ru-RU', onEnd) {
  if (!('speechSynthesis' in window)) { onEnd && onEnd(); return }
  const synth = window.speechSynthesis
  let idx = 0
  function speakNext() {
    if (idx >= lines.length) { onEnd && onEnd(); return }
    const ut = new SpeechSynthesisUtterance(lines[idx])
    ut.lang = lang
    ut.rate = 0.95
    ut.onend = () => { idx++; speakNext() }
    synth.speak(ut)
  }
  speakNext()
}

function createRecognition(lang = 'ru-RU') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return null
  const rec = new SpeechRecognition()
  rec.lang = lang
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.continuous = false
  return rec
}

export default function PoemLearner() {
  const [poemText, setPoemText] = useState(localStorage.getItem('poem') || '')
  const [lines, setLines] = useState([])
  const [stage, setStage] = useState('idle')
  const [k, setK] = useState(1)
  const [message, setMessage] = useState('')
  const [lastOps, setLastOps] = useState([])
  const [lastTranscript, setLastTranscript] = useState('')
  const [attempts, setAttempts] = useState(0)
  const lang = 'ru-RU'
  const recRef = useRef(null)

  useEffect(() => {
    if (poemText) {
      localStorage.setItem('poem', poemText)
      const arr = poemText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
      setLines(arr)
    } else setLines([])
  }, [poemText])

  function startFullRead() {
    if (!lines.length) return
    setStage('reading_full')
    setMessage('Читаю стих...')
    speakLines(lines, lang, () => {
      setMessage('Полное прочтение завершено.'); setStage('idle')
    })
  }

  function initialCheck() {
    if (!lines.length) return
    const rec = createRecognition(lang)
    if (!rec) { alert('ASR не поддерживается в этом браузере.'); return }
    setMessage('Прочитайте весь стих')
    setStage('initial_check')
    rec.onresult = (ev) => {
      const transcript = ev.results[0][0].transcript
      setLastTranscript(transcript)
      const cmp = compareText(lines.join(' '), transcript)
      setLastOps(cmp.ops)
      setMessage(`Совпадение: ${Math.round(cmp.accuracy*100)}%`)
      setStage('idle')
    }
    rec.onerror = (e) => { setMessage('Ошибка распознавания: ' + e.error); setStage('idle') }
    rec.start()
  }

  function startTraining() {
    if (!lines.length) return
    setK(1)
    setAttempts(0)
    setStage('training')
    runStage(1)
  }

function runStage(targetK) {
  setK(targetK)
  setMessage(`Читаю первые ${targetK} строк...`)
  const toSpeak = lines.slice(0, targetK)
  speakLines(toSpeak, lang, () => {
    setMessage('повторите вслух (запись начнётся автоматически)')
    
    setTimeout(() => {
      const rec = createRecognition(lang)
      if (!rec) { setMessage('ASR не поддерживается в этом браузере.'); return }

      setStage('recording')
      rec.onresult = (ev) => {
        const transcript = ev.results[0][0].transcript
        setLastTranscript(transcript)
        const cmp = compareText(toSpeak.join(' '), transcript)
        setLastOps(cmp.ops)
        const threshold = targetK === 1 ? 0.78 : 0.85

        if (cmp.accuracy >= threshold) {
          setMessage(`Верно — ${Math.round(cmp.accuracy * 100)}%`)
          setAttempts(0)
          if (targetK >= lines.length) {
            setStage('done')
            setMessage('Поздравляю — стих выучен!')
          } else {
            setTimeout(() => runStage(targetK + 1), 900)
          }
        } else {
          setAttempts(a => a + 1)
          if (attempts + 1 >= 3) {
            setMessage(`Похоже, требуется помощь — ${Math.round(cmp.accuracy * 100)}%. Предлагаю прослушать ещё раз.`)
            setAttempts(0)
            setStage('idle')
          } else {
            setMessage(`Не хватило — ${Math.round(cmp.accuracy * 100)}%. Попробуйте ещё раз.`)
            setStage('idle')
          }
        }
      }

      rec.onerror = (e) => {
        setMessage('Ошибка распознавания: ' + e.error)
        setStage('idle')
      }

      rec.start()
    }, 1000) // ← задержка перед записью
  })
}


  function renderLineWithHighlights(line, index) {
    // если есть lastOps for the block containing this line, try to highlight words
    // lastOps corresponds to the last checked block (concatenated first k lines)
    if (!lastOps || lastOps.length === 0) return <span>{line}</span>
    // build expected words for the whole block
    const fullExpected = normalizeText(lines.slice(0, k).join(' '))
    const expWords = fullExpected.split(' ')
    // map ops to expected-word-level coloring; find words belonging to this line
    const lineNorm = normalizeText(line)
    if (!lineNorm) return <span>{line}</span>
    const lineWords = lineNorm.split(' ')
    // find start index of this line in expWords
    let start = 0
    const prefix = normalizeText(lines.slice(0, index).join(' '))
    if (prefix) start = prefix.split(' ').length
    const parts = []
    for (let i = 0; i < lineWords.length; i++) {
      const op = lastOps[start + i]
      const word = lines[index].split(/\s+/)[i] || lineWords[i]
      if (!op) {
        parts.push(<span key={i}>{word} </span>)
      } else if (op.type === 'equal') {
        parts.push(<span key={i} className="word correct">{word} </span>)
      } else if (op.type === 'replace' || op.type === 'delete') {
        parts.push(<span key={i} className="word wrong">{word} </span>)
      } else {
        parts.push(<span key={i} className="word unsure">{word} </span>)
      }
    }
    return <>{parts}</>
  }

  return (
    <div className="poem-learner">
      <div className="left">
        <textarea
          rows={8}
          value={poemText}
          onChange={(e) => setPoemText(e.target.value)}
          placeholder="Вставьте стих: каждая строка с новой строки"
        />

        <div className="controls">
          <button onClick={startFullRead} disabled={!lines.length}>Прочитать весь стих</button>
          <button onClick={initialCheck} disabled={!lines.length}>Проверка- прочитай весь стих сам</button>
          <button onClick={startTraining} disabled={!lines.length}>Начать тренировку</button>
        </div>

        <div className="status">
          <strong>Состояние:</strong> {stage} — {message}
        </div>

        <div className="transcript">
          <strong>Последняя расшифровка:</strong>
          <div className="transcript-box">{lastTranscript}</div>
        </div>
      </div>

        <aside className="right">
            <h3>Строки</h3>
            <ol>
                {lines.map((ln, idx) => {
                const i = idx + 1

                // скрытие строк
                const isCurrentlyHidden =
                    stage === 'recording' && i <= k // пока идёт запись 
      
                return (
                    <li key={idx} className={isCurrentlyHidden ? 'hidden' : 'visible'}>
                    {isCurrentlyHidden ? <em>— скрыто —</em> : renderLineWithHighlights(ln, idx)}
                    </li>
                    )
                })}
            </ol>

            <div className="legend">
                <span className="chip correct">правильно</span>
                <span className="chip wrong">неправильно</span>
                <span className="chip unsure">неуверенно</span>
            </div>
            </aside>
    </div>
  )
}