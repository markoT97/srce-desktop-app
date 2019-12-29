const { ipcRenderer } = require('electron');
const { channels } = require('../src/shared/constants');
window.ipcRenderer = ipcRenderer;
window.channels = channels;
window.__devtron = {require: require, process: process}
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
