const stream = await navigator.mediaDevices.getUserMedia({audio: true})
startBtn.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const audiocontext = new AudioContext();
  const source = audiocontext.createMediaStreamSource(stream);
  const analyser = audiocontext.createAnalyser();
  source.connect(analyser);
  status.textContent = "Mic connected!";
});