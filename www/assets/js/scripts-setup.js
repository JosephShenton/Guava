// You can also require other files to run in this process
require('./assets/js/renderer-setup.js');
const { exec } = require("child_process");
var spawn = require('child_process').spawn;
const fs = require("fs"); // Or `import fs from "fs";` with ESM
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
title.innerText = "420 Signer - Setup";
title.style.textAlign = "center";
title.style.verticalAlign = "middle";
// title.style.lineHeight = "38px"
title.style.marginTop = "9px";
document.getElementById("titleBar").appendChild(title);
document.body.style.paddingTop = "15px";
document.body.style.zIndex = "0";

setup();

function setup() {
    setTimeout(() => {
        checkDockerInstallation();
    }, randomNum(1000, 2000));
}

function randomNum(a, b) {
    return Math.floor(Math.random() * b) + a;
}

function checkDockerInstallation() {
    $('.setupProgress').text("5%");
    $('.currentProgress').text("Checking Docker Installation");
    exec('echo $(command -v docker)', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return false;
        }
        console.log(`stdout: ${stdout}`);
        if (stdout.includes("/docker")) {
            // alert("Docker Installed");
            buildDockerImage();
            return true;
        } else {
            alert("Please install Docker and restart 420 Signer.");
            return false;
        }
    });
}

function buildDockerImage() {
    $('.setupProgress').text("10%");
    $('.currentProgress').text("Checking for Docker Image");
    exec('echo $(docker images -q 420signer 2> /dev/null)', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return false;
        }
        if (stdout == "" || stdout == "\n" || stdout == "\n\n") {
            // alert("Please build docker image");
            setTimeout(() => {
                $('.setupProgress').text("13%");
                $('.currentProgress').text("Building Docker Image");

                var buildImage = spawn('docker', ['build', '-t', '420signer', 'https://github.com/zhlynn/zsign.git']);

                buildImage.stdout.on('data', function (data) {
                console.log('stdout: ' + data.toString());
                $('.currentSubProgress').text(data.toString());
                });

                buildImage.stderr.on('data', function (data) {
                console.log('stderr: ' + data.toString());
                });

                buildImage.on('exit', function (code) {
                console.log('child process exited with code ' + code.toString());
                });

                // testDockerImage();
            }, randomNum(1000, 2000));
        } else {
            // alert("Docker Image Exists");
            testDockerImage();
        }
    });

}

function testDockerImage() {
    setTimeout(() => {
        $('.setupProgress').text("15%");
        $('.currentProgress').text("Testing Docker Image");

        exec('docker run -v "$PWD/www/:$PWD/www/" -w "$PWD/www/" 420signer -k "testCertificate/1234.p12" -m "testCertificate/1234.mobileprovision" -p "1234" -o output.ipa -z 9 test.ipa', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            if (fs.existsSync("www/output.ipa")) {
                console.log("output.ipa exists");
            } else {
                console.log("output.ipa does not exist");
            }
        });
    }, randomNum(1000, 2000));
}