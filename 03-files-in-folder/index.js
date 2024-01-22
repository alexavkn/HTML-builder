const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '/secret-folder');
let arrFileName = [];
let fileName;
let fileExt;
let fileSize;

async function printInfoFiles() {

    await fs.promises.readdir(filePath)

        // If promise resolved and
        // data are fetched
        .then(filenames => {
            for (let filename of filenames) {
                arrFileName.push(filename);
            }
        })

        // If promise is rejected
        .catch(err => {
            console.log(err);
        })

    arrFileName.forEach(filename => {
        fs.promises.stat(path.join(filePath, '/' + filename))
            .then(stats => {
                if (!stats.isDirectory()) {
                    fileName = path.parse(path.join(filePath, '/' + filename)).name;
                    fileExt = path.parse(path.join(filePath, '/' + filename)).ext.replace(".", "");
                    fileSize = stats.size.toString() + "b";
                    console.log(fileName + " - " + fileExt + " - " + fileSize);
                }
            })

            // If promise is rejected
            .catch(err => {
                console.log(err);
            })
    });

}

printInfoFiles();

console.log("Statistics");