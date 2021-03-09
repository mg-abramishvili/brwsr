const electron = require('electron');
const session = electron.session;

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const axios = require('axios');
const fs = require("fs")

axios.get('http://localhost/api/links')
.then(response => {
    //console.log(response.data)
    fs.writeFile('whitelistlinks.json', JSON.stringify(response.data), function (err) {
        //console.log(err);
    });
})

axios.get('http://localhost/api/domains')
.then(response => {
    //console.log(response.data)
    fs.writeFile('whitelistdomains.json', JSON.stringify(response.data), function (err) {
        //console.log(err);
    });
})

axios.get('http://localhost/api/homepage')
.then(response => {
    fs.writeFile('homepage.json', JSON.stringify(response.data), function (err) {
    });
})

let rawdatalinks = fs.readFileSync('whitelistlinks.json');
let whitelistlinks = JSON.parse(rawdatalinks);
let rawdatadomains = fs.readFileSync('whitelistdomains.json');
let whitelistdomains = JSON.parse(rawdatadomains);
let rawdatahomepage = fs.readFileSync('homepage.json');
let homepage = JSON.parse(rawdatahomepage);

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: false,
        fullscreen: true,
        type: module,
        webPreferences: {
            devTools: true,
            webSecurity: false,
            nodeIntegration: false,
            contextIsolation: false
        }
    });

    //mainWindow.webContents.openDevTools();

    for(let hp of homepage) {
        mainWindow.loadURL(hp);
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('web-contents-created', (_event, contents) => {
    contents.on('will-navigate', (e, urlLink) => {

        contents.on('new-window', (e, url) => {
            e.preventDefault()
            mainWindow.loadURL(url);
        })

        let redirect = false;

        /*for(let it of whitelist) {
            if(urlLink.match(it)) {
                redirect = false;
                break;
            } else {
                redirect = true;
            }
        }*/

        let downloads = [
            '.zip',
            '.rar',
            '.7z',
            '.mp4',
            '.wmv',
            '.mkv',
            '.avi',
            '.mp3',
            '.wav',
            '.ogg',
            '.xls',
            '.xlsx',
            '.doc',
            '.docx',
            '.ppt',
            '.pptx',
            '.jpg',
            '.jpeg',
            '.png',
            '.tiff',
            '.bmp',
            '.gif',
            '.fb2',
            '.epub',
            '.rtf',
        ]

        for(let dl of downloads) {
            if(urlLink.match(dl)) {
                e.preventDefault()
            } else {
                for(let itd of whitelistdomains) {
                    if(urlLink.match(itd)) {
                        redirect = false;
                        break;
                    } else {
                        for(let itl of whitelistlinks) {
                            if(urlLink == itl) {
                                redirect = false;
                                break;
                            } else {
                                redirect = true;
                            }
                        }
                    }
                }
            }
        }
        
        if(redirect)
            for(let hp of homepage) {
                mainWindow.loadURL(hp);
            }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});