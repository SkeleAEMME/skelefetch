#!/usr/bin/env node

const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");
const si = require("systeminformation")

async function main() { //Main function
    console.clear()
    console.log(`\x1b[38;5;15m
            .,ad88888888baa,
        ,d8P"""        ""9888ba.             ${getHostName()}\n     .a8"          ,ad88888888888a           ${"-".repeat(getHostName().length - 42 )}          
    aP'          ,88888888888888888a         \x1b[38;5;214mOS\x1b[38;5;15m: \x1b[38;5;15m${await getOS()}
  ,8"           ,88888888888888888888,       \x1b[38;5;214mKernel\x1b[38;5;15m: \x1b[38;5;15m${getKernel()} 
 ,8'            (888888888( )888888888,      \x1b[38;5;214mShell\x1b[38;5;15m: \x1b[38;5;15m${await getShell()}
,8'             \`8888888888888888888888      \x1b[38;5;214mGPU\x1b[38;5;15m: \x1b[38;5;15m${await getGPU()}
8)               \`888888888888888888888,     \x1b[38;5;214mCPU\x1b[38;5;15m: \x1b[38;5;15m${getCPU()} 
8                  "8888888888888888888)     \x1b[38;5;214mMemory\x1b[38;5;15m: \x1b[38;5;15m${getMemory()}
8                   \`888888888888888888)     \x1b[38;5;214mDisk (${getDisk()})\x1b[38;5;15m: \x1b[38;5;15m${await getDiskSize()} 
8)                    "8888888888888888      \x1b[38;5;214mLocal IP\x1b[38;5;15m: \x1b[38;5;15m${getLocalIP()} 
(b                     "88888888888888'      \x1b[38;5;214mLocale\x1b[38;5;15m: \x1b[38;5;15m${getLocale()}
\`8,        (8)          8888888888888)       \x1b[38;5;214mUptime\x1b[38;5;15m: \x1b[38;5;15m${getUpTime()}
 "8a                   ,888888888888)
   V8,                 d88888888888"         
    \`8b,             ,d8888888888P'
      \`V8a,       ,ad8888888888P'
         ""88888888888888888P"            
              """"""""""""                   By \x1b[38;5;214mSkeleAEMME\x1b[38;5;15m with only \x1b[38;5;10mNodejs\x1b[38;5;15m
`)
}
main()
function getHostName() {
    let username = os.userInfo({ encoding: "utf8" }).username;
    let hostname = os.hostname();
    return `\x1b[38;5;214m${username}\x1b[38;5;15m@\x1b[38;5;214m${hostname}\x1b[38;5;15m`;
}
function getKernel() {
    return `${os.type()} ${os.release()}`;
}
async function getOS() {
    let text;
    let os = si.osInfo()
    return (await os).distro;
}
async function getShell() {
    let text;
    if((await getOS()).includes("Windows")) {
        text = "Windows CMD";
    } else {
        text = os.userInfo({ encoding: "utf8" }).shell
    }
    return text;
}
async function getGPU() {
    let text;
    const graphics = await si.graphics()
    let gpu1 = graphics.controllers[0];
    if(!gpu1) {
        text = null;
    } else {
        text = `${gpu1.model} (${gpu1.vram} MB)`
    }
    return text;
}
function getCPU() {
    return os.cpus()[0].model.trim().toString();
}
function getMemory() {
    let fullmemory = (os.totalmem() / 1024**3).toFixed(2)
    let freememory = (os.freemem() / 1024**3).toFixed(2)
    let usedmemory = ((os.totalmem() - os.freemem()) / 1024**3).toFixed(2)
    let utilizzopercent = (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1)
    if(80 < utilizzopercent) {
        return `${usedmemory} GB / ${fullmemory} GB (\x1b[38;5;1m${utilizzopercent}%\x1b[38;5;15m)`;
    } else if(50 < utilizzopercent) {
        return `${usedmemory} GB / ${fullmemory} GB (\x1b[38;5;228m${utilizzopercent}%\x1b[38;5;15m)`;
    } else if(utilizzopercent < 50) {
        return `${usedmemory} GB / ${fullmemory} GB (\x1b[38;5;10m${utilizzopercent}%\x1b[38;5;15m)`;
    }
}
function getUpTime() {
    let seconds = os.uptime();
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secondsRem = Math.floor(seconds % 60);

    return `${hours} hours, ${minutes} mins, ${secondsRem} sec`;
}
function getLocalIP() {
    let interfaces = os.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return null;
}
async function getDiskSize() {
    let disks = await si.fsSize()
    let sizeGB = (disks[0].size / (1024 ** 3)).toFixed(2);
    let usedGb = (disks[0].used / (1024 ** 3)).toFixed(2);
    let availableGB = (disks[0].available / (1024 ** 3)).toFixed(2);
    const percent = ((disks[0].used / disks[0].size) * 100).toFixed(1);
    if (80 < percent) {
        return `${usedGb} GB / ${sizeGB} GB (\x1b[38;5;1m${percent}%\x1b[38;5;15m)`;
    } else if(percent < 50) {
        return `${usedGb} GB / ${sizeGB} GB (\x1b[38;5;228m${percent}%\x1b[38;5;15m)`;
    } else if(percent < 50) {
        return `${usedGb} GB / ${sizeGB} GB (\x1b[38;5;10m${percent}%\x1b[38;5;15m)`;
    }
}
function getDisk() {
    let homedirlenght = os.userInfo().homedir.length
    let homedirlenght2 = os.userInfo().homedir.length - 1
    let res = os.userInfo().homedir.toString()
    return res.substring(0, homedirlenght - homedirlenght2)
}
function getLocale() {
    return Intl.DateTimeFormat().resolvedOptions().locale;
}