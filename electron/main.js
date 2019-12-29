const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, BrowserWindow, ipcMain } = require('electron');
const { channels } = require('../src/shared/constants');
const isDev = require('electron-is-dev');
const path = require('path');
const dbHelper = require(path.join(__dirname, './database/dbHelper'));
const url = require('url');
let window;

function createWindow () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });
  window.loadURL(startUrl);
  window.on('closed', function () {
    window = null;
  });
  window.setMenu(null);

  if (isDev) {
    window.webContents.openDevTools();
  }

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
}

function databaseOperations() {
  dbHelper.checkIfDatabaseExists();
}
app.on('ready', databaseOperations);
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (window === null) {
    createWindow();
  }
});

ipcMain.on(channels.GET_VOLUNTEER_NAMES, (event) => {
    dbHelper.getVolunteerNames().then(result => {
      event.sender.send(channels.GET_VOLUNTEER_NAMES, result);
    });
});

ipcMain.on(channels.GET_VOLUNTEERS, (event, range) => {
 dbHelper.getVolunteers(range).then(result => {
      event.sender.send(channels.GET_VOLUNTEERS, result);
 });
});

ipcMain.on(channels.DELETE_VOLUNTEER, (event, id) => {
  dbHelper.deleteVolunteer(id).then(result => {
      event.sender.send(channels.DELETE_VOLUNTEER, result);
  });
});

ipcMain.on(channels.INSERT_VOLUNTEER, async (event, volunteer) => {
  dbHelper.insertVolunteer(volunteer).then(insertedID => {
      event.sender.send(channels.INSERT_VOLUNTEER, insertedID);
  });
});

