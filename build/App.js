const { app, BrowserWindow } = require("electron");

function createWindow() {
    let win = new BrowserWindow({
        width: 274,
        height: 437,
        frame: false,
        resizable: true,
        transparent: true,
        movable: true,
        minWidth: 274,
        maxWidth: 274,
        minHeight: 124,
        backgroundColor: "#00FFFFFF",
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile("index.html");
}

app.whenReady().then(createWindow);
