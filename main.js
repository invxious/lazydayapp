// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, electron} = require('electron')
const {autoUpdater} = require('electron-updater')
const {isDev} = require('electron-is-dev')
const path = require('path')

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let splash

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    minWidth: 900,
    minHeight: 500,
    show: false,
    icon: __dirname +'/images/logo.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: true

    }
  })
  mainWindow.loadFile('index.html')

  splash = new BrowserWindow({width: 300, height: 400, transparent: true, frame: false, alwaysOnTop: true,icon: __dirname +'/images/logo.ico'})
  splash.loadFile('splash.html')
  splash.setResizable(false)


  mainWindow.on('closed', function () {
    mainWindow = null
  })

  splash.on('closed', function () {
    splash = null
  })


  mainWindow.once('ready-to-show', () => {
    splash.destroy()
    mainWindow.maximize()
    mainWindow.show()
  })
}


app.on('ready', () =>{
  createWindow()
  if(!isDev){
    autoUpdater.checkForUpdates()
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for Updates...');
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update_available');
  console.log('Update Available');
  console.log('Version ', info.version);
  console.log("Released ", info.releaseDate);
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
