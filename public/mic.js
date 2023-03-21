import { contextView, frequencyView } from "./lib/view.js";

const audioCtx = new AudioContext();

contextView("audio-ctx", audioCtx);

const micSteam = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
  }
});
const mic = audioCtx.createMediaStreamSource(micSteam);
const analyser = audioCtx.createAnalyser();
frequencyView('analyser', analyser);

mic.connect(analyser);
analyser.connect(audioCtx.destination);
