// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');
const decompress = require('decompress');
var plist = require('simple-plist');
const fs = require('fs');

// Right after the line where you changed the document.location
ipcRenderer.send('resizeWindow');
 
decompress('www/test.ipa', 'output').then(files => {
    console.log('done!');
    // destination.txt will be created or overwritten by default.
    fs.copyFile('output/Payload/Undecimus.app/AppIcon60x60@2x.png', 'www/test.png', (err) => {
        if (err) throw err;
        console.log('AppIcon60x60@2x.png was copied to test.png');
        let pngNormailzer = require('png-normalizer'),
            newBuf = pngNormailzer('www/test.png');
        
        if(newBuf){
            fs.writeFileSync('www/test2.png',newBuf);
        };
    });
});