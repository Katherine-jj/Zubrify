import { SpeechRecognition as CapSpeech } from '@capacitor-community/speech-recognition';

export function createRecognition(lang = "ru-RU") {
  const WebRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (WebRecognition) {
    const rec = new WebRecognition();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    return rec;
  }

  // 🔸 fallback для Android
  return {
    start: async (onResult, onEnd) => {
      try {
        const perm = await CapSpeech.requestPermission();
        if (!perm) return console.warn("Speech permission denied");

        const result = await CapSpeech.start({
          language: lang,
          popup: true, // показывает системное окно Android распознавания
        });

        const text = result.matches?.[0] || "";
        onResult && onResult({ results: [[{ transcript: text }]] });
        onEnd && onEnd();
      } catch (err) {
        console.error("Speech error:", err);
      }
    },
    stop: async () => {
      await CapSpeech.stop();
    }
  };
}
