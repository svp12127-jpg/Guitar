const parseBtn = document.getElementById('parseBtn');
const chartInput = document.getElementById('chartInput');
const chordOutput = document.getElementById('chordOutput');

function parseChordChart(text) {
  const matches = text.match(/\[([^\]]+)\]/g);
  if (matches === null) {
    return [];
  }
  const cleaned = matches.map(match => match.replace('[', '').replace(']', ''));
  const filtered = cleaned.filter(chord => "ABCDEFG".includes(chord[0]));
  const uniset = new Set(filtered);
  const uniarr=Array.from(uniset);
  return uniarr;
}

parseBtn.addEventListener('click', () => {
  const text = chartInput.value;
  const chords = parseChordChart(text);
  if (chords.length==0) {
    chordOutput.textContent="No chords found";
  }
  else{
  chordOutput.textContent = chords.join(', ');
  }
});