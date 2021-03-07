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
    fs.writeFile('whitelist.json', JSON.stringify(response.data), function (err) {
        //console.log(err);
    });
})

let rawdata = fs.readFileSync('whitelist.json');
let whitelist = JSON.parse(rawdata);

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

    mainWindow.loadURL('https://exler.ru');

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('web-contents-created', (_event, contents) => {
    contents.on('will-navigate', (e, urlLink) => {

        let redirect = false;

        for(let it of whitelist) {
            if(urlLink.match(it)) {
                redirect = false;
                break;
            } else {
                redirect = true;
            }
        }
        
        if(redirect)
            //console.log("redirect");
            mainWindow.loadURL('https://google.com');
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