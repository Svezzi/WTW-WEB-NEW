const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Copy file if it exists
function copyFileIfExists(source, destination) {
  if (fs.existsSync(source)) {
    ensureDirectoryExists(path.dirname(destination));
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${source} -> ${destination}`);
  } else {
    console.error(`Source file not found: ${source}`);
  }
}

// Main function
function fixModules() {
  console.log('Starting to fix modules...');
  
  // Fix AuthLayout
  const authLayoutSrc = path.join(__dirname, 'src', 'components', 'layout', 'AuthLayout.tsx');
  const authLayoutDest = path.join(__dirname, 'src', 'pages', 'components', 'layout', 'AuthLayout.tsx');
  
  // Fix AuthContext
  const authContextSrc = path.join(__dirname, 'src', 'contexts', 'AuthContext.tsx');
  const authContextDest = path.join(__dirname, 'src', 'pages', 'contexts', 'AuthContext.tsx');
  
  // Copy files
  copyFileIfExists(authLayoutSrc, authLayoutDest);
  copyFileIfExists(authContextSrc, authContextDest);
  
  console.log('Module fixing completed!');
}

// Run the function
fixModules(); 