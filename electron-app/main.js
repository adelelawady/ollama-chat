const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');

let mainWindow;
let server;

function createWindow() {
  const port = 8080;

  // Create HTTP server
  server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let filePath = path.join(__dirname, 'build', parsedUrl.pathname);

    // If the path is root or doesn't exist, serve index.html
    if (parsedUrl.pathname === '/' || !fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'build', 'index.html');
    }

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}`);
        return;
      }

      // Set the content type based on the file extension
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      if (ext === '.js') {
        contentType = 'text/javascript';
      } else if (ext === '.css') {
        contentType = 'text/css';
      } else if (ext === '.json') {
        contentType = 'application/json';
      } else if (ext === '.png') {
        contentType = 'image/png';
      } else if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });

  // Start server
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  // Create browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      enableRemoteModule: true
    }
  });

  // Remove the menu
  mainWindow.setMenu(null);

  // Load the app from the local server
  mainWindow.loadURL(`http://localhost:${port}`);
  
  // Handle console messages
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer console [${level}]: ${message}`);
  });

  // Expose window control functions to renderer
  mainWindow.webContents.executeJavaScript(`
    window.electron = {
      minimize: () => { require('electron').ipcRenderer.send('window-minimize'); },
      maximize: () => { require('electron').ipcRenderer.send('window-maximize'); },
      close: () => { require('electron').ipcRenderer.send('window-close'); }
    };
  `);

  // Handle window control events
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });

  // Wait for the page to load before applying drag functionality
  mainWindow.webContents.on('did-finish-load', () => {
    // Add a small delay to ensure React has rendered the title bar
    setTimeout(() => {
      mainWindow.webContents.executeJavaScript(`
        function getElementByXPath(xpath) {
          return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        
        const titleBar = getElementByXPath('/html/body/div/div[2]/div/div/div[1]');
        if (titleBar) {
          titleBar.style.webkitAppRegion = 'drag';
          console.log('Title bar found and made draggable');
          
          // Make buttons non-draggable
          const buttons = titleBar.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.webkitAppRegion = 'no-drag';
          });
        } else {
          console.log('Title bar not found');
        }
      `);
    }, 1000); // 1 second delay to ensure React has rendered
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    // Close the server when the app is closed
    if (server) {
      server.close();
    }
    app.quit();
  }
}); 