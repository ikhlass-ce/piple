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
  fs.copyFileSync(path.join(workspaceDir, 'index.html'), path.join(tempProjDir, 'index.html'));

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
