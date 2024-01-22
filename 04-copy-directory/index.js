const fs = require('fs');
const path = require('path');

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
  const filePathOut = path.join(__dirname, '/files');
  const filePathIn = path.join(__dirname, '/files-copy');

  await fs.promises.readdir(__dirname, {withFileTypes: true})

  // If promise resolved and
  // data are fetched
  .then(files => {
      for (let file of files) {
          if (file.name === "files-copy" && file.isDirectory()) {
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

  CopyFiles(filePathOut, filePathIn);

}

CreateDirectory();

console.log("Create directory and copy files");