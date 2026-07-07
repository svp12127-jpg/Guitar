startBtn.addEventListener('click', async () => {
  const noteDisplay = document.getElementById('noteDisplay');
  const needle = document.getElementById('needle');
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const audiocontext = new AudioContext();
  const source = audiocontext.createMediaStreamSource(stream);
  const analyser = audiocontext.createAnalyser();
  source.connect(analyser);
  analyser.fftSize = 2048;
  const bufferLength = analyser.fftSize;
  const dataArray = new Float32Array(bufferLength);

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
    if (rms < 0.003) {
      return -1;}

  let correlations = [];

  for (let offset = 96; offset < 800; offset++) {
    let correlation = 0;
    for (let i = 0; i < SIZE - offset; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlation = correlation / (SIZE - offset);
    correlation = correlation / (rms * rms);
    correlations.push({ offset, correlation });

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset === -1) return -1;
  if (bestCorrelation < 0.5) return -1;

  // look for a smaller offset that's almost as good — likely the true fundamental
  const threshold = bestCorrelation * 0.9;
  for (let entry of correlations) {
    if (entry.correlation >= threshold) {
      bestOffset = entry.offset;
      break; // first one found is the smallest, since we're scanning in increasing order
    }
  }

  const frequency = sampleRate / bestOffset;
  return frequency;
}
  function frequencytonote(frequency){
    console.log("frequency received:", frequency);
      if (frequency === -1) return;
      const semitonesfromA4=12*(Math.log2(frequency/440));
      const noteNames=["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
      const round=Math.round(semitonesfromA4);
      const cents = (semitonesfromA4 - round) * 100;
      const angle = Math.max(-45, Math.min(45, cents));
      needle.style.transform = `rotate(${angle}deg)`;
      let noteIndex= ((round % 12) + 12) % 12;
      noteDisplay.textContent = noteNames[noteIndex];
    }
});
