const electron = require('electron');
const session = electron.session;

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        frame: true,
        fullscreen: false,
        webPreferences: {
            devTools: true,
            webSecurity: false,
            nodeIntegration: false,
            contextIsolation: false
        }
});

//mainWindow.webContents.openDevTools();

mainWindow.loadURL('https://google.com');

mainWindow.on('closed', function () {
    mainWindow = null
})

const UrlFilter = {
    urls: [
        '*://*.mail.ru/*',
        '*://*.exler.ru/*',
        '*://*.oper.ru/*',
    ]
};

mainWindow.webContents.session.webRequest.onBeforeRequest(UrlFilter, (details, callback) => {
    //console.log('onBeforeRequest details', details);
    console.log(details.url);
    const { url } = details;
    const localURL = url.replace(details.url, 'http://localhost' )

    callback({
        cancel: false,
        redirectURL: ( encodeURI(localURL ) )
    });
});

mainWindow.webContents.session.webRequest.onErrorOccurred((details) => {
    console.log('error occurred on request');
    console.log(details);
})
}

app.on('ready', createWindow)

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