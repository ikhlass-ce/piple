const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const workspaceDir = __dirname;
const tempProjDir = path.join(process.env.USERPROFILE || 'C:\\Users\\PC', '.gemini', 'antigravity', 'project_temp');

try {
  console.log('1. Preparing temp project directory: ' + tempProjDir);
  if (!fs.existsSync(tempProjDir)) {
    fs.mkdirSync(tempProjDir, { recursive: true });
  }

  console.log('2. Preparing package.json to prevent infinite recursion...');
  const pkgContent = fs.readFileSync(path.join(workspaceDir, 'package.json'), 'utf8');
  const pkgJson = JSON.parse(pkgContent);
  // Modify the dev script to 'vite' in the temp directory to prevent infinite recursion
  pkgJson.scripts.dev = 'vite';
  fs.writeFileSync(path.join(tempProjDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

  console.log('3. Copying configuration files...');
  fs.copyFileSync(path.join(workspaceDir, 'vite.config.js'), path.join(tempProjDir, 'vite.config.js'));
  
  // Custom Vite index.html loading /src/main.jsx with diagnostic error overlay
  const viteIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    window.onerror = function(message, source, lineno, colno, error) {
      var div = document.createElement('div');
      div.style.position = 'fixed';
      div.style.top = '0';
      div.style.left = '0';
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.background = '#800';
      div.style.color = '#fff';
      div.style.padding = '30px';
      div.style.zIndex = '999999';
      div.style.fontFamily = 'monospace';
      div.style.overflow = 'auto';
      div.innerHTML = '<h1 style="color:#ff4d4d;margin-bottom:10px;">🚨 Browser Runtime Error</h1>' +
                      '<p style="font-size:16px;"><strong>Message:</strong> ' + message + '</p>' +
                      '<p style="font-size:16px;"><strong>Source URL:</strong> ' + source + '</p>' +
                      '<p style="font-size:16px;"><strong>Line:</strong> ' + lineno + ' | <strong>Column:</strong> ' + colno + '</p>' +
                      (error && error.stack ? '<pre style="background:#400;padding:15px;border-radius:5px;margin-top:15px;white-space:pre-wrap;">' + error.stack + '</pre>' : '') +
                      '<p style="margin-top:20px;color:#ccc;">💡 <em>Tip: Verify that the dev server is running and check the terminal logs for compilation errors.</em></p>';
      document.body.appendChild(div);
      return false;
    };
  </script>
  <title>piple - Netflix-Style Streaming</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>
<body style="background-color: #111; color: #fff; margin: 0;">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(tempProjDir, 'index.html'), viteIndexHtml);

  console.log('4. Linking src directory using Junction...');
  const tempSrc = path.join(tempProjDir, 'src');
  const workspaceSrc = path.join(workspaceDir, 'src');
  
  if (fs.existsSync(tempSrc)) {
    try {
      execSync(`cmd.exe /c rmdir "${tempSrc}"`);
    } catch (e) {
      console.warn('Failed to remove junction using rmdir, trying fs.rmSync...', e);
      try {
        fs.rmdirSync(tempSrc);
      } catch (rmdirErr) {
        fs.rmSync(tempSrc, { recursive: true, force: true });
      }
    }
  }
  execSync(`cmd.exe /c mklink /J "${tempSrc}" "${workspaceSrc}"`);
  console.log('Junction link created successfully.');

  // If node_modules doesn't exist, run npm install
  const nodeModulesPath = path.join(tempProjDir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('5. Running npm install in temp directory...');
    execSync('npm install --no-audit --no-fund --loglevel info', {
      cwd: tempProjDir,
      stdio: 'inherit'
    });
  } else {
    console.log('5. node_modules already exists, skipping installation.');
  }

  console.log('6. Launching Vite dev server (npm run dev)...');
  const viteProcess = spawn('cmd.exe', ['/c', 'npm run dev'], {
    cwd: tempProjDir,
    stdio: 'inherit'
  });

  viteProcess.on('close', (code) => {
    console.log(`Vite server exited with code ${code}`);
  });

} catch (err) {
  console.error('An error occurred in run_vite_workaround:', err);
  process.exit(1);
}
