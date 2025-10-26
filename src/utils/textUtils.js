export function normalizeText(s) {
  if (!s) return "";
  try {
    s = s.normalize("NFKD");
  } catch (e) {}
  s = s.toLowerCase();
  s = s.replace(/[^Ѐ-ӿ\p{L}\p{N}\s]/gu, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function compareText(expected, actual) {
  const ew = normalizeText(expected).split(" ");
  const aw = normalizeText(actual).split(" ");
  const matched = ew.filter((w, i) => w === aw[i]).length;
  const accuracy = ew.length === 0 ? 0 : matched / ew.length;
  return { accuracy, ops: [], expectedWords: ew, actualWords: aw };
}
