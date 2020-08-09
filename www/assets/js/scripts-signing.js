// You can also require other files to run in this process
require('./assets/js/renderer-signing.js');
const remote = require("electron").remote;
const dialog = remote.dialog;
const decompress = require('decompress');
var plist = require('simple-plist');
const fs = require('fs');
var path = require('path');
var rimraf = require("rimraf");

var windowTopBar = document.createElement('div');
windowTopBar.style.width = "100%";
windowTopBar.style.height = "38px";
windowTopBar.style.backgroundColor = "transparent";
windowTopBar.style.position = "absolute";
windowTopBar.style.zIndex = "1";
windowTopBar.style.top = windowTopBar.style.left = 0;
windowTopBar.style.webkitAppRegion = "drag";
windowTopBar.id = "titleBar";
document.body.appendChild(windowTopBar);
var title = document.createElement("p");
title.style.width = "100%";
title.style.height = "38px";
title.style.color = "#B0B0B0";
title.style.fontSize = "14.2px";
// title.innerText = "420 Signer";
title.style.textAlign = "center";
title.style.verticalAlign = "middle";
// title.style.lineHeight = "38px"
title.style.marginTop = "9px";
document.getElementById("titleBar").appendChild(title);
document.body.style.paddingTop = "15px";
document.body.style.zIndex = "0";

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

function selectApp() {
    let types = [
        {name: 'iOS Apps', extensions: ['ipa']}
    ],

    options = {filters:types, properties:['openFile']};

    // dialog.showOpenDialog(options, (filePaths) => {
    //     console.log(filePaths)
    // })

    dialog.showOpenDialog(remote.getCurrentWindow(), options).then(result => {
        if (result.canceled === false) {
            console.log("Selected file paths:")
            console.log(result.filePaths);

            decompress(result.filePaths[0], 'selectedIPA').then(files => {
                console.log('done!');
                // destination.txt will be created or overwritten by default.
                fromDir('selectedIPA/Payload/',/\.app$/,function(filename){
                    console.log('-- found: ',filename);
                    fs.copyFile(filename+'/AppIcon60x60@2x.png', 'www/selectedIPA.png', (err) => {
                        if (err) throw err;
                        console.log('AppIcon60x60@2x.png was copied to test.png');
                        let pngNormailzer = require('png-normalizer'),
                            newBuf = pngNormailzer('www/selectedIPA.png');
                        
                        if(newBuf){
                            fs.writeFileSync('www/selectedIPA2.png',newBuf);
                        };
                    });
                    plist.readFile(filename+'/Info.plist', function(err, data) {
                        if (err) {
                          throw err
                        }
                        console.log(JSON.stringify(data));
                        var info = data;
                        console.log(info.CFBundleDisplayName);
                        // localStorage.setItem("appName", info.CFBundleDisplayName);
                        $(".appIcon").attr("src", "selectedIPA2.png");
                        document.getElementsByClassName("appName")[0].innerText = info.CFBundleDisplayName;
                        document.getElementsByClassName("appVersion")[0].innerText = info.CFBundleShortVersionString;
                        document.getElementsByClassName("appBuild")[0].innerText = info.CFBundleVersion;
                      });
                });
                rimraf("selectedIPA/", function () { console.log("done"); });
            });

        }
    }).catch(err => {
        console.log(err)
    })
}

function selectFolder() {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (files) {
        if (files !== undefined) {
            // handle files
            console.log(files);
        }
    });
}