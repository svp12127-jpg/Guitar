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
    const frequency = autoCorrelate(dataArray, audiocontext.sampleRate);
    console.log(frequency);
    requestAnimationFrame(update);
    }
  update();
  function autoCorrelate(buffer, sampleRate) {
    const SIZE = buffer.length;
    let bestOffset = -1;
    let bestCorrelation = 0;

  // for each possible lag/offset, calculate a correlation score
  for (let offset = 96; offset < 800; offset++) {
    let correlation = 0;

    for (let i = 0; i < SIZE - offset; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlation = correlation / (SIZE - offset);
    if (correlation>bestCorrelation){
      bestCorrelation=correlation;
      bestOffset=offset;
    }
  }

  if (bestOffset === -1) return -1; // no clear pitch found

  const frequency = sampleRate / bestOffset;
  return frequency;

  function frequencytonode(frequency){
    const semitonesfromA4=12*(Math.log2(frequency/440));
    console.log("raw:", semitonesFromA4, "rounded:", Math.round(semitonesFromA4))
  }
}
});
