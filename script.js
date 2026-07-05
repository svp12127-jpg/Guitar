startBtn.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const audiocontext = new AudioContext();
  const source = audiocontext.createMediaStreamSource(stream);
  const analyser = audiocontext.createAnalyser();
  source.connect(analyser);
  analyser.fftSize = 2048;
  const bufferLength = analyser.fftSize;
  const dataArray = new Float32Array(bufferLength);
  status.textContent = "Mic connected!";

  function update() {
    analyser.getFloatTimeDomainData(dataArray);
    requestAnimationFrame(update);
    }
  update();
});
