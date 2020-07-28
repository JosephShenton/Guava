// You can also require other files to run in this process
require('./assets/js/renderer.js');
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