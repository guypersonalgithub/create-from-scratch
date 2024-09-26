type TTSProps = {
  text: string;
  pitch?: number;
  rate?: number;
  volume?: number;
};

export const TTS = ({ text, pitch, rate, volume }: TTSProps) => {
  if (pitch && (pitch < 0 || pitch > 2)) {
    throw "Unsupported pitch value, the pitch range is between 0 to 2, with 1 as a default";
  }

  if (rate && (rate < 0.1 || rate > 10)) {
    throw "Unsupported rate value, the rate range is between 0.1 to 10, with 1 as a default";
  }

  if (volume && (volume < 0 || volume > 1)) {
    throw "Unsupported volume value, the pitch range is between 0 to 1, with 1 as a default";
  }

  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    if (pitch) {
      utterance.pitch = pitch;
    }
    if (rate) {
      utterance.rate = rate;
    }
    if (volume) {
      utterance.volume = volume;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech Synthesis is not supported in this browser.");
  }
};
