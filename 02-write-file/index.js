const fs = require('fs');
const readline = require('node:readline');
const path = require('path');
const filePath = path.join(__dirname, '/text.txt');

const writeableStream = fs.createWriteStream(filePath);

function readLine() {

    const {
        stdin: input,
        stdout: output,
    } = require('node:process');

    const rl = readline.createInterface({ input, output });

    console.log('Hello, write text, please');

    //rl.setPrompt('Write line>');
    
    rl.prompt();
    
    rl.on('line', function(answer) {
        if (answer.trim() === 'exit') rl.close()
        writeableStream.write(answer + "\n");
        rl.prompt();
    }).on('close', function() {
        console.log('The file is recorded, thank you');
        process.exit(0);
    }).on('SIGINT', function() {
        console.log('The file is recorded, thank you');
        process.exit(0);
    });
           
}

readLine();