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
    frequencytonote(frequency);
    requestAnimationFrame(update);
    }
  update();
  function autoCorrelate(buffer, sampleRate) {
    const SIZE = buffer.length;
    let bestOffset = -1;
    let bestCorrelation = 0;

    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      sumOfSquares += buffer[i] * buffer[i];
    }

    const rms = Math.sqrt(sumOfSquares / SIZE);

    // skip everything if it's basically silence — avoids garbage matches on near-zero audio
    if (rms < 0.01) {
      return -1;}

  // for each possible lag/offset, calculate a correlation score
  for (let offset = 96; offset < 800; offset++) {
    let correlation = 0;

    for (let i = 0; i < SIZE - offset; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlation = correlation / (SIZE - offset);
    correlation = correlation / (rms * rms); // normalize to 0-1 scale
    if (correlation>bestCorrelation){
      bestCorrelation=correlation;
      bestOffset=offset;
    }
  }

  if (bestOffset === -1) return -1; // no clear pitch found
  if (bestCorrelation < 0.9) return -1;  // add this line — reject weak/unclear matches
  const frequency = sampleRate / bestOffset;
  return frequency;
}
  function frequencytonote(frequency){
      if (frequency === -1) return;
      const semitonesfromA4=12*(Math.log2(frequency/440));
      const noteNames=["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
      const round=Math.round(semitonesfromA4);
      let noteIndex= ((round % 12) + 12) % 12;
      console.log(noteNames[noteIndex]);
    }
});
