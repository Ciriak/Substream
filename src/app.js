const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(`file://${__dirname}/app/index.html`)
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}
