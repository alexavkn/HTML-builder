const fs = require('fs');
const path = require('path');
const filePathOut = path.join(__dirname, '/styles');
const filePathIn = path.join(__dirname, '/project-dist');
let arrFiles = [];

async function writeBundle() {

    let fileExt;

    await fs.promises.readdir(filePathOut, {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(async (files) => {
        for (let file of files) {
            if (!file.isDirectory()) {
                fileExt = path.parse(path.join(filePathOut, '/' + file.name)).ext;
                if (fileExt === '.css') {
                    await new Promise(resolve => {
                        // const stream = fs.createReadStream(path.join(filePathOut, '/' + file.name));
                        // stream.on('readable', function () {
                        //     let data = stream.read();
                        //     if (data != null) arrFileName.push(data);
                        // })
                        fs.createReadStream(path.join(filePathOut, '/' + file.name))
                        .on("data", (data) => {
                            arrFiles.push(data);
                        })
                        .on("end", () => {
                            resolve(arrFiles)
                        });
                     });
                }    
            }
        }
    })

    // If promise is rejected
    .catch(err => {
        console.log(err);
    })

    const writeableStream = fs.createWriteStream(path.join(filePathIn, '/Bundle.css'));

    arrFiles.forEach(async(element) => {
        await new Promise(resolve => {
            writeableStream.write(element + "\n");
            resolve(element);
         });       
    });
}

writeBundle();