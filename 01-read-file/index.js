const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '/text.txt');

async function readFile() {
  await fs.promises.open(filePath, 'r')
    .then((result) => {
        //console.log(result);
        console.log('File exist.');

        const stream = fs.createReadStream(filePath, { highWaterMark: 128 });

stream.on('readable', function () {
  let data = stream.read();
  if (data != null) console.log(data.toString());
});

stream.on('end', function () {
  console.log("THE END");
});