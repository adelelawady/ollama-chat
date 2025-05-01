// This file is executed in the renderer process
console.log('Renderer process started');

// Example of using Node.js features in the renderer process
const os = require('os');
console.log('Platform:', os.platform());
console.log('CPU Architecture:', os.arch()); 