// You can also require other files to run in this process
require('./assets/js/renderer-setup.js');
const { exec } = require("child_process");
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
            alert("Docker Installed");
            buildDockerImage();
            return true;
        } else {
            alert("Please install Docker");
            return false;
        }
    });
}

function buildDockerImage() {
    setTimeout(() => {
        $('.setupProgress').text("10%");
        $('.currentProgress').text("Building Docker Image");
        
        testDockerImage();
    }, randomNum(1000, 2000));   
}

function testDockerImage() {
    setTimeout(() => {
        $('.setupProgress').text("15%");
        $('.currentProgress').text("Testing Docker Image");

        exec("ls -la", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }, randomNum(1000, 2000));
}