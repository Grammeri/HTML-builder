const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const filePath = path.join(__dirname, 'output.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Please enter text to write to the file:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    sayBye();
  }
  output.write(data);
});

process.on('SIGINT', sayBye);

function sayBye() {
  stdout.write('\nGoodbye!\n');
  exit();
}
