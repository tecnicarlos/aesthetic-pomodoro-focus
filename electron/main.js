const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let tray = null;
let win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, '../assets/icon.png'),
        autoHideMenuBar: true,
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        win.loadURL('http://localhost:8081');
        win.webContents.openDevTools();
    } else {
        const indexPath = path.join(__dirname, '../dist/index.html');
        win.loadFile(indexPath).catch(e => console.error('Failed to load file:', e));
    }

    // Handle close event to minimize to tray
    win.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });
}

function createTray() {
    const iconPath = path.join(__dirname, '../assets/icon.png'); // Ensure this icon exists!
    // Fallback icon if needed, or handle error if icon missing
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open Aesthetic Pomodoro', click: () => win.show() },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Aesthetic Pomodoro Focus');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        win.show();
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    ipcMain.on('update-timer', (event, data) => {
        const { timeLeft, progress } = data;
        if (tray) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            // Update Tray Tooltip
            tray.setToolTip(`Aesthetic Pomodoro: ${timeString} remaining`);

            // Update Window Title (Taskbar)
            if (win) {
                win.setTitle(`${timeString} - Aesthetic Pomodoro`);
                win.setProgressBar(progress); // Show progress on taskbar icon
            }
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Do nothing, keep app running in tray
    }
});
