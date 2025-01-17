console.log("Hello there 😃")

import fs from 'fs';

const filePath = '../words_alpha.txt'
const outputFile = '../words_alpha_of_length_five.txt';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split('\n');

  lines.forEach((line, index) => {
    if (line.length === 6) {
        fs.appendFileSync(outputFile, line + '\n');
    }
  });
});