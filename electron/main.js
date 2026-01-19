const { app, BrowserWindow } = require('electron');
const path = require('path');

// Prevent multiple instances of the app
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    // Create myWindow, load the rest of the app, etc...
    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
}

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: "ColorForge",
        backgroundColor: '#0f172a', // Matches main app dark bg
        show: false, // Don't show until ready to prevent white flash
        webPreferences: {
            nodeIntegration: false, // Security: Disable Node in renderer
            contextIsolation: true, // Security: Enable Context Isolation
            sandbox: true           // Security: Enable Sandbox
        },
        icon: path.join(__dirname, '../build/icon.ico'), // Point to build folder icon
        autoHideMenuBar: true
    });

    // Load the built app
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

    // Graceful startup
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
