const { spawn } = require("child_process");
const { dialog } = require('electron').remote;
const path = require("path");

var appDir = path.dirname(require.main.filename);

function elem(id) {
    return document.getElementById(id);
}

let filePathList = [];

//Elements
let version = elem("version");
let outversion = elem("outversion");
let imgfmt = elem("imgfmt");
let platform = elem("platform");
let vlog = elem("dVerboseLog");

let flist = elem("dFileList");
let fdrop = elem("dFileDrop");

function clearElementChildren(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function rebuildFileListDisplay() {
    clearElementChildren(flist);
    let sfilebox = undefined;
    for (let i = 0; i < filePathList.length; i++) {
        //<span class="sFileBox">C:/Program Files/somefile.lvl</span>
        sfilebox = document.createElement("span");
        sfilebox.className = "sFileBox";
        sfilebox.textContent = filePathList[i];
        sfilebox.index = i;
        sfilebox.onclick = (evt) => {
            filePathList.splice(evt.target.index, 1);
            evt.target.remove();
        };
        flist.appendChild(sfilebox);
    }
}

fdrop.addEventListener("click", (evt) => {
    let selection = dialog.showOpenDialog(
        {
            properties: ['openFile', 'multiSelections']
        }
    );
    if (selection && selection.length > 0) {
        filePathList.push.apply(filePathList, selection);
        rebuildFileListDisplay();
    }
});

function calculateCommand() {
    let args = [];

    let cmd = "";
    if (filePathList.length > 0) {
        cmd = "-files ";
        for (let i = 0; i < filePathList.length; i++) {
            cmd += filePathList[i];
            if (i >= filePathList.length - 1) {
                cmd += " ";
            } else {
                cmd += ";";
            }
        }
        args.push(cmd);
    }

    //DEBUG
    //cmd = "-file C:/Users/Jonathan/Desktop/Projects/Node/SWBFUnmungeGUI/mission.lvl";
    //args.push(cmd);
    //ENDDEBUG

    cmd = "-version ";
    let temp = version.options[version.selectedIndex].text;
    if (temp === "swbf" || temp === "swbf_ii") {
        cmd += temp;
    } else {
        cmd += "swbf"; //Safety net, maybe complain to user later? This shouldn't happen
        console.log("-version wasn't swbf or swbf_ii, defaulted swbf");
    }

    args.push(cmd);

    cmd = "-outversion ";
    temp = outversion.options[outversion.selectedIndex].text;
    if (temp === "swbf" || temp === "swbf_ii") {
        cmd += temp;
    } else {
        cmd += "swbf"; //Again, safety net
        console.log("-version wasn't swbf or swbf_ii, defaulted swbf");
    }
    args.push(cmd);

    cmd = "-imgfmt ";
    temp = imgfmt.options[imgfmt.selectedIndex].text;
    if (temp === "dds" || temp === "tga") {
        cmd += temp;
    } else {
        cmd += "tga";
        console.log("-imgfmt wasn't tga or dds, defaulted tga");
    }
    args.push(cmd);

    cmd = "-platform ";
    temp = platform.options[platform.selectedIndex].text;
    if (temp === "pc" || temp === "xbox" || temp === "ps2") {
        cmd += temp;
    } else {
        cmd += "pc";
        console.log("-platform wasn't pc, ps2, or xbox, defaulted pc");
    }
    args.push(cmd);
    args.push("-verbose");

    return args;
}

function go() {

    let swbf_unmunge_dir = path.join(appDir,"..","unmunge");
    let swbf_unmunge_path = path.join(swbf_unmunge_dir, "swbf-unmunge");
    let args = calculateCommand();
    console.log("Unmunge directory", swbf_unmunge_dir);
    console.log("Arguments", args);

    var child = spawn(swbf_unmunge_path, args, { windowsVerbatimArguments: true });

    vlog.innerText = "";
    child.stdout.on("data", (chunk) => {
        vlog.innerText += chunk;
        vlog.appendChild(document.createElement("br"));
        //Data from standard output in chunks
    });

    child.stdout.on("close", (code) => {
        //process exited with code
        console.log("SWBFUnmunge closed with \"" + code + "\"");
    });

    child.on('error', (err) => {
        console.log("Failed to start swbf-unmunge, we couldn't access it!");
    });
}