/**
 *
 * @param {string} id
 * @param {AudioContext} audioCtx
 */
export function contextView(id, audioCtx) {
  const sanitizer = new Sanitizer();
  const rootElem = document.getElementById(id);
  const resumeBtnId = `${id}__resume-btn`;
  const suspendBtnId = `${id}__suspend-btn`;
  rootElem.setHTML(
    `
  <button id="${resumeBtnId}">resume</button>
  <button id="${suspendBtnId}">suspend</button>
  `,
    sanitizer
  );
  const resumeBtn = document.getElementById(resumeBtnId);
  const suspendBtn = document.getElementById(suspendBtnId);

  if (audioCtx.state === "running") {
    resumeBtn.disabled = true;
  } else if (audioCtx.state === "suspended") {
    suspendBtn.disabled = true;
  }

  resumeBtn.addEventListener("click", async () => {
    await audioCtx.resume();
    resumeBtn.disabled = true;
    suspendBtn.disabled = false;
  });
  suspendBtn.addEventListener("click", async () => {
    await audioCtx.suspend();
    suspendBtn.disabled = true;
    resumeBtn.disabled = false;
  });
}
/**
 *
 * @param {string} id
 * @param {AnalyserNode} analyser
 * @param {number?} width
 * @param {height?} height
 */
export function frequencyView(id, analyser, width = 800, height = 200) {
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const buffer = new Uint8Array(bufferLength);
  /** @type {HTMLCanvasElement} canvas */
  const canvas = document.getElementById(id);
  const canvasCtx = canvas.getContext("2d");
  canvasCtx.clearRect(0, 0, width, height);
  let drawRequestId = requestAnimationFrame(draw);
  function draw() {
    analyser.getByteFrequencyData(buffer);
    canvasCtx.fillStyle = "rgba(0, 0, 0)";
    canvasCtx.fillRect(0, 0, width, height);
    const barWidth = width / bufferLength;
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = buffer[i] * (height / 255);
      canvasCtx.fillStyle = "rgba(50, 255, 50)";
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    drawRequestId = requestAnimationFrame(draw);
  }
}
