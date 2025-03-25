const fs = require('fs');
const path = require('path');

// Main function to disable auth pages
function disableAuthPages() {
  console.log('Starting to disable auth pages...');
  
  const authPagesDir = path.join(__dirname, 'src', 'pages', 'auth');
  const disabledAuthPagesDir = path.join(__dirname, 'src', 'pages', 'auth-disabled');
  
  // Check if auth directory exists
  if (!fs.existsSync(authPagesDir)) {
    console.log(`Auth pages directory not found: ${authPagesDir}`);
    return;
  }
  
  // If the disabled directory already exists, remove it first
  if (fs.existsSync(disabledAuthPagesDir)) {
    console.log(`Removing existing disabled auth directory: ${disabledAuthPagesDir}`);
    fs.rmSync(disabledAuthPagesDir, { recursive: true, force: true });
  }
  
  // Rename the auth directory to auth-disabled
  fs.renameSync(authPagesDir, disabledAuthPagesDir);
  console.log(`Renamed ${authPagesDir} to ${disabledAuthPagesDir}`);
  
  // Create a simple placeholder auth directory
  fs.mkdirSync(authPagesDir);
  
  // Create a simple placeholder page
  const placeholderContent = `
export default function AuthPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Authentication Coming Soon
        </h1>
        <p className="text-gray-600 mb-4">
          The authentication system is currently under development. 
          Please check back later for full functionality.
        </p>
        <div className="mt-6">
          <a 
            href="/"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-center"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(authPagesDir, 'index.tsx'), placeholderContent);
  console.log('Created placeholder auth page');
  
  console.log('Auth pages successfully disabled!');
}

// Run the function
disableAuthPages(); 