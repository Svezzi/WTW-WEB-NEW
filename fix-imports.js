const fs = require('fs');
const path = require('path');

// Function to update import paths in a file
function updateImportPaths(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace @/components/layout/AuthLayout with ../../components/layout/AuthLayout
  content = content.replace(
    /from ['"]@\/components\/layout\/AuthLayout['"]/g, 
    'from "../../components/layout/AuthLayout"'
  );
  
  // Replace @/contexts/AuthContext with ../../contexts/AuthContext
  content = content.replace(
    /from ['"]@\/contexts\/AuthContext['"]/g, 
    'from "../../contexts/AuthContext"'
  );
  
  // Replace other @/ imports if needed
  content = content.replace(
    /from ['"]@\/config\/firebase['"]/g, 
    'from "../../config/firebase"'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated import paths in: ${filePath}`);
}

// Main function
function fixImports() {
  console.log('Starting to fix import paths...');
  
  const authPagesDir = path.join(__dirname, 'src', 'pages', 'auth');
  
  // Check if directory exists
  if (!fs.existsSync(authPagesDir)) {
    console.error(`Auth pages directory not found: ${authPagesDir}`);
    return;
  }
  
  // Get all TypeScript files in the auth directory
  const files = fs.readdirSync(authPagesDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
  
  // Update import paths in each file
  for (const file of files) {
    const filePath = path.join(authPagesDir, file);
    updateImportPaths(filePath);
  }
  
  console.log('Import path fixing completed!');
}

// Run the function
fixImports(); 