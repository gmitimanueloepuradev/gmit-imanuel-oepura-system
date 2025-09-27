const fs = require('fs');
const path = require('path');

// Clean out directory
if (fs.existsSync('out')) {
  fs.rmSync('out', { recursive: true, force: true });
}
fs.mkdirSync('out', { recursive: true });

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return false;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

// Copy everything from .next/out if it exists (static export)
const nextOutSrc = path.join('.next', 'out');
if (fs.existsSync(nextOutSrc)) {
  copyDir(nextOutSrc, 'out');
  console.log('✓ Copied static export from .next/out');

  // Update index.html to use relative paths for Capacitor
  const indexPath = path.join('out', 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Replace absolute paths with relative paths
    indexContent = indexContent.replace(/href="\/_next/g, 'href="./_next');
    indexContent = indexContent.replace(/src="\/_next/g, 'src="./_next');
    indexContent = indexContent.replace(/href="\/favicon/g, 'href="./favicon');
    indexContent = indexContent.replace(/href="\/images/g, 'href="./images');
    indexContent = indexContent.replace(/src="\/images/g, 'src="./images');

    fs.writeFileSync(indexPath, indexContent);
    console.log('✓ Updated index.html with relative paths');
  }

  // Update all HTML files to use relative paths
  const updateHtmlFiles = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        updateHtmlFiles(fullPath);
      } else if (entry.name.endsWith('.html')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/href="\/_next/g, 'href="../_next');
        content = content.replace(/src="\/_next/g, 'src="../_next');
        content = content.replace(/href="\/favicon/g, 'href="../favicon');
        content = content.replace(/href="\/images/g, 'href="../images');
        content = content.replace(/src="\/images/g, 'src="../images');
        fs.writeFileSync(fullPath, content);
      }
    }
  };

  updateHtmlFiles('out');
  console.log('✓ Updated all HTML files with relative paths');

} else {
  console.log('❌ Static export not found at .next/out');
  console.log('⚠️  Building mobile-friendly fallback...');

  // Copy public folder
  const publicSrc = 'public';
  if (fs.existsSync(publicSrc)) {
    const publicEntries = fs.readdirSync(publicSrc);
    publicEntries.forEach(entry => {
      const srcPath = path.join(publicSrc, entry);
      const destPath = path.join('out', entry);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
    console.log('✓ Copied public files');
  }

  // Copy static files
  const staticSrc = path.join('.next', 'static');
  const staticDest = path.join('out', '_next', 'static');
  if (copyDir(staticSrc, staticDest)) {
    console.log('✓ Copied static assets');
  }

  // Create working mobile app index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GMIT Imanuel Oepura</title>
    <link rel="icon" href="./favicon.ico" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      .app-container {
        text-align: center;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 90%;
      }
      .logo {
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: #667eea;
        font-weight: bold;
      }
      h1 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      .subtitle {
        opacity: 0.9;
        margin-bottom: 2rem;
        font-size: 1rem;
      }
      .features {
        list-style: none;
        text-align: left;
        margin-bottom: 2rem;
      }
      .features li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
      }
      .features li:last-child {
        border-bottom: none;
      }
      .features li::before {
        content: '✓';
        color: #4ade80;
        font-weight: bold;
        margin-right: 0.5rem;
      }
      .note {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 10px;
        font-size: 0.9rem;
        margin-top: 1rem;
      }
      .version {
        margin-top: 1rem;
        opacity: 0.7;
        font-size: 0.8rem;
      }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="logo">G</div>
        <h1>GMIT Imanuel Oepura</h1>
        <p class="subtitle">Sistem Informasi Jemaat</p>

        <ul class="features">
            <li>Pendataan Jemaat</li>
            <li>Manajemen Keluarga</li>
            <li>Pengumuman Gereja</li>
            <li>Jadwal Ibadah</li>
            <li>Laporan Statistik</li>
        </ul>

        <div class="note">
            <strong>📱 Mobile App Ready</strong><br>
            Aplikasi mobile siap digunakan untuk pengelolaan data jemaat GMIT Imanuel Oepura.
        </div>

        <div class="version">
            Version 1.0.0 - Mobile
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join('out', 'index.html'), indexHtml);
  console.log('✓ Created mobile-friendly index.html');
}

console.log('✅ Capacitor preparation complete!');