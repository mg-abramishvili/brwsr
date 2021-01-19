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
        //console.log(urlLink);

        const whitelist = [ "https://www.exler.ru/blog", "google.com", "google.ru" ];

        let redirect = false;
        for(let it of whitelist){
          if(urlLink.match(it)){
              redirect = false;
              break;
          }else{
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