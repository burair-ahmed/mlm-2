const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('route.ts') || file.endsWith('route.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const routes = getFiles(apiDir);

console.log(`Found ${routes.length} API route files.\n`);

routes.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  // Skip commented out files entirely (like some we saw)
  const isEntirelyCommented = content.trim().startsWith('//') && !content.includes('export async function');
  if (isEntirelyCommented) {
    // console.log(`Skipping commented out route: ${relativePath}`);
    return;
  }

  // Check if it's an public route like login or register
  if (relativePath.includes('auth/login') || relativePath.includes('auth/register')) {
    return;
  }

  // Check if it's a cron job or webhook (which might need API key or other auth)
  if (relativePath.includes('api/cron')) {
    console.log(`[CRON] Verify authentication for cron route: ${relativePath}`);
    return;
  }

  // Check if it imports/calls authenticate
  const hasAuthenticate = content.includes('authenticate');
  const hasCommentedOutAuth = content.match(/\/\/\s*const\s+auth\s*=\s*await\s+authenticate/);
  
  if (!hasAuthenticate) {
    console.log(`[MISSING AUTH] No mention of 'authenticate' in: ${relativePath}`);
  } else if (hasCommentedOutAuth) {
    console.log(`[COMMENTED AUTH] 'authenticate' is commented out in: ${relativePath}`);
  }
});
