const parseBtn = document.getElementById('parseBtn');
const chartInput = document.getElementById('chartInput');
const chordOutput = document.getElementById('chordOutput');

function parseChordChart(text) {
  const matches = text.match(/\[([^\]]+)\]/g);
  const cleaned = matches.map(match => match.replace('[', '').replace(']', ''));
  const filtered = cleaned.filter(chord => "ABCDEFG".includes(chord[0]));
  return filtered;
}

parseBtn.addEventListener('click', () => {
  const text = chartInput.value;
  const chords = parseChordChart(text);
  chordOutput.textContent = chords.join(', ');
});