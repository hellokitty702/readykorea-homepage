const fs = require('fs');
const html = fs.readFileSync('david-esl-homepage.html', 'utf8');
const re = /onclick="document\.querySelector\('\[data-level='([^']+)'\]'\)/g;
let m;
while ((m = re.exec(html)) !== null) {
  const onclick = m[0].slice(9, -1); // strip onclick="
  try {
    new Function(onclick);
    console.log('OK:', m[1]);
  } catch (e) {
    console.log('BROKEN:', m[1], '-', e.message);
  }
}
