const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '/text.txt');

if (fs.existsSync(filePath)) {
  console.log('File exist.');
} else {
  console.log('File not exist.');
  return;
}

const stream = fs.createReadStream(filePath, { highWaterMark: 128 });

stream.on('readable', function () {
  let data = stream.read();
  if (data != null) console.log(data.toString());
});

stream.on('end', function () {
  console.log("THE END");
});