const {app, BrowserWindow} = require ('electron');
const path = require("path");
const url = require("url");
// const AutoLaunch = require('auto-launch');

let win;

// var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
//   // Someone tried to run a second instance, we should focus our window.
//   if (win) {
//     if (win.isMinimized()) win.restore();
//     win.focus();
//   }
// });

// if (shouldQuit) {
//   app.quit();
//   return;
// }

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow ({
    // kiosk: true,
    fullscreen : false,
    resizable : true,
    // movable : false,
    minimizable : true,
    maximizable : true,
    // closable : false,
    // alwaysOnTop : true,
    // show : true,
    // frame : false
  });
  win.setMenu (null);
  win.webContents.openDevTools();
  // win.maximize();
  // win.loadURL (`file://${__dirname}/dist/index.html`);
  win.loadURL(
      url.format({
          pathname: path.join(__dirname, "dist", "index.html"),
          protocol: "file",
          slashes: true
      })
  );
  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()
  // Event when the window is closed.
  win.on ('closed', function () {
    win = null;
  });
}


var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (win && win != null) {
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

if (shouldQuit) {
  app.quit();
  return;
}

// Create window on electron intialization
app.on ('ready', createWindow);
// Quit when all windows are closed.
app.on ('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit ();
  }
});
app.on ('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow ();
  }
});

// var minecraftAutoLauncher = new AutoLaunch({
// 	name: 'NCIBox',
// 	path: '/Applications/NCIBox.app',
// });

// minecraftAutoLauncher.enable();

// //minecraftAutoLauncher.disable();

// minecraftAutoLauncher.isEnabled()
// .then(function(isEnabled){
// 	if(isEnabled){
// 	    return;
// 	}
// 	minecraftAutoLauncher.enable();
// })
// .catch(function(err){
//     // handle error
// });
