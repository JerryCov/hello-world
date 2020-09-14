const { fuchsia } = require('color-name');
const {ipcMain, app, BrowserWindow} = require('electron');
const {join} = require('path');
const root = app.getAppPath();
function main()
{
  const win = new BrowserWindow({
    fullscreen:false,
    webPreferences:{
      nodeIntegration:false,
      nodeIntegrationInWorker:false,
      preload:join(root, 'js', 'preload.js'),
      contextIsolation:true
    }
  });
//  win.webContents.openDevTools();
  function init()
  {
    console.log('init');
    function isObject(subject)
    {
      return ('object' === typeof subject);
    }
    function isFunction(subject)
    {
      return ('function' === typeof subject);
    }
    function render(type, message)
    {
      isObject(win) && isObject(win.webContents) && isFunction(win.webContents.send) && win.webContents.send(type, message);
    }
    // uncomment line below to send a message to the front end
    //render('display', {message:'Hello World!'});
  }
  win.loadFile('index.htm');
  win.webContents.on('did-finish-load', init);
}
app.on('ready', main);
app.on('window-all-closed', () => app.quit());
// circumvent alert dialog boxes
ipcMain.removeAllListeners("ELECTRON_BROWSER_WINDOW_ALERT")
ipcMain.on('ELECTRON_BROWSER_WINDOW_ALERT', (event, message, title) => {
	console.warn(`[Alert] ** ${title} ** ${message}`);
	event.returnValue = 0; // **IMPORTANT!**
	// wrapper module will restart app on exit
	app.quit();
});

