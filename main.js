'use strict';

const { app, BrowserWindow } = require('electron')
require('./server.js')

require('electron-reload')(__dirname);

function createWindow () {
  let win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('public/cats.html')
  win.webContents.openDevTools()
}

app.on('ready', createWindow)
