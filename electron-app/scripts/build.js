const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  distDir: path.join(__dirname, '../../dist'), // Path to the existing dist folder
  buildDir: path.join(__dirname, '../build'),  // Path to the electron app build folder
};

// Function to copy directory recursively
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Main build process
function build() {
  try {
    console.log('Starting build process...');

    // Check if dist directory exists
    if (!fs.existsSync(config.distDir)) {
      console.error('Dist directory not found. Please build the frontend first.');
      process.exit(1);
    }

    // Clean build directory if it exists
    if (fs.existsSync(config.buildDir)) {
      console.log('Cleaning build directory...');
      fs.rmSync(config.buildDir, { recursive: true, force: true });
    }

    // Create build directory
    fs.mkdirSync(config.buildDir, { recursive: true });

    // Copy dist files to electron app
    console.log('Copying dist files to electron app...');
    copyDir(config.distDir, config.buildDir);

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 