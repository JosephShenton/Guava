// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron');
const decompress = require('decompress');
var plist = require('simple-plist');
const fs = require('fs');
var path = require('path');

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

function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        // if (stat.isDirectory()){
        //     fromDir(filename,filter,callback); //recurse
        // }
        /*else*/ if (filter.test(filename)) callback(filename);
    };
};

fromDir('output/Payload/',/\.app$/,function(filename){
    console.log('-- found: ',filename);
    plist.readFile(filename+'/Info.plist', function(err, data) {
        if (err) {
          throw err
        }
        console.log(JSON.stringify(data));
        var info = data;
        console.log(info.CFBundleDisplayName);
        // localStorage.setItem("appName", info.CFBundleDisplayName);
        document.getElementsByClassName("appName")[0].innerText = info.CFBundleDisplayName;
        document.getElementsByClassName("appVersion")[0].innerText = info.CFBundleShortVersionString;
        document.getElementsByClassName("appBuild")[0].innerText = info.CFBundleVersion;
      })
});