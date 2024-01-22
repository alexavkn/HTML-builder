const fs = require('fs');
const path = require('path');
const filePathOut = path.join(__dirname, '/components');
const filePathOutCss = path.join(__dirname, '/styles');
const filePathOutAssets = path.join(__dirname, '/assets');
const filePathIn = path.join(__dirname, '/project-dist');
const filePathInAssets = path.join(__dirname, '/project-dist/assets');
let arrTemplate = [];
let textTemplate = "";
let keyTemplate = "";
let arrKeysTemplate = [];
let uniqueNames;
let arrComponents = [];
let textComponent = "";
let arrFiles = [];

async function writeBundle() {

    let fileExt;

    await fs.promises.readdir(__dirname, {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(async (files) => {
        for (let file of files) {
            if (!file.isDirectory()) {
                fileExt = path.parse(path.join(__dirname, '/' + file.name)).ext;
                if (fileExt === '.html') {
                    await new Promise(resolve => {
                        // const stream = fs.createReadStream(path.join(__dirname, '/' + file.name));
                        // stream.on('readable', function () {
                        //     let data = stream.read();
                        //     if (data != null) arrFileName.push(data);
                        // })
                        fs.createReadStream(path.join(__dirname, '/' + file.name))
                        .on("data", (data) => {
                            arrTemplate.push(data);
                        })
                        .on("end", () => {
                            resolve(arrTemplate)
                        });
                     });
                }    
            }
        }
    })

    await fs.promises.readdir(filePathOut, {withFileTypes: true})

    // If promise resolved and
    // data are fetched
    .then(async (files) => {
        for (let file of files) {
            if (!file.isDirectory()) {
                fileExt = path.parse(path.join(filePathOut, '/' + file.name)).ext;
                if (fileExt === '.html') {
                    await new Promise(resolve => {
                        // const stream = fs.createReadStream(path.join(filePathOut, '/' + file.name));
                        // stream.on('readable', function () {
                        //     let data = stream.read();
                        //     if (data != null) arrFileName.push(data);
                        // })
                        keyTemplate = file.name.split(".")[0];
                        arrKeysTemplate.push(keyTemplate);
                        fs.createReadStream(path.join(filePathOut, '/' + file.name))
                        .on("data", (data) => {
                            arrComponents.push(keyTemplate);
                            arrComponents.push(data);
                        })
                        .on("end", () => {
                            resolve(arrComponents)
                        });
                     });
                }    
            }
        }
    })

    uniqueNames = new Set(arrKeysTemplate);
    arrKeysTemplate = Array.from(uniqueNames);

    arrTemplate.forEach(element => {
        textTemplate = textTemplate + element;        
    });

    for (let i = 0; i < arrKeysTemplate.length; i++) {
        keyTemplate = arrKeysTemplate[i];
        textComponent = "";
        for (let j = 0; j < arrComponents.length; j++) {
            if (keyTemplate === arrComponents[j]) {
                textComponent = textComponent + arrComponents[j + 1]; 
            };       
        };
        textTemplate = textTemplate.replaceAll("{{" + keyTemplate + "}}", textComponent);        
    }

    const writeableStream = fs.createWriteStream(path.join(filePathIn, '/index.html'));
    new Promise(resolve => {
        writeableStream.write(textTemplate);
        resolve(textTemplate);
     });

     // сборка css

     await fs.promises.readdir(filePathOutCss, {withFileTypes: true})
 
     // If promise resolved and
     // data are fetched
     .then(async (files) => {
         for (let file of files) {
             if (!file.isDirectory()) {
                 fileExt = path.parse(path.join(filePathOutCss, '/' + file.name)).ext;
                 if (fileExt === '.css') {
                     await new Promise(resolve => {
                         // const stream = fs.createReadStream(path.join(filePathOutCss, '/' + file.name));
                         // stream.on('readable', function () {
                         //     let data = stream.read();
                         //     if (data != null) arrFileName.push(data);
                         // })
                         fs.createReadStream(path.join(filePathOutCss, '/' + file.name))
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
 
     const writeableStreamCss = fs.createWriteStream(path.join(filePathIn, '/style.css'));
 
     arrFiles.forEach(async(element) => {
         await new Promise(resolve => {
             writeableStreamCss.write(element + "\n");
             resolve(element);
          });       
     });

}

async function CopyFiles(filePathOut, filePathIn) {

    await fs.promises.readdir(filePathOut, {withFileTypes: true})
  
    // If promise resolved and
    // data are fetched
    .then(async (files) => {
        for (let file of files) {
          if (!file.isDirectory()) {
            fs.promises.copyFile(path.join(filePathOut, '/' + file.name), path.join(filePathIn, '/' + file.name))
            .catch(err => {
              console.log(err);
            })
          } else {
            await fs.promises.mkdir(path.join(filePathIn, '/' + file.name))
            .catch(err => {
              console.log(err);
            })
            CopyFiles(path.join(filePathOut, '/' + file.name), path.join(filePathIn, '/' + file.name));       
          }
        }
    })
  
    // If promise is rejected
    .catch(err => {
      console.log(err);
    })
  
}

async function CreateDirectory() {

    let existsDirectory = false;
  
    await fs.promises.readdir(__dirname, {withFileTypes: true})
  
    // If promise resolved and
    // data are fetched
    .then(files => {
        for (let file of files) {
            if (file.name === "project-dist" && file.isDirectory()) {
              existsDirectory = true;
              break;
            }           
        }
    })
  
    // If promise is rejected
    .catch(err => {
      console.log(err);
    })
  
    if (existsDirectory) {
      await fs.promises.rm(filePathIn, { recursive: true, force: true })
  
      .catch(err => {
        console.log(err);
      })
    }
  
    await fs.promises.mkdir(filePathIn)
  
    .catch(err => {
      console.log(err);
    })

    await fs.promises.mkdir(filePathInAssets)
  
    .catch(err => {
      console.log(err);
    })

    writeBundle();
    CopyFiles(filePathOutAssets, filePathInAssets);
  
}

CreateDirectory();