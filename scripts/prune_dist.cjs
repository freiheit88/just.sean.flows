const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const MAX_BYTES = 24 * 1024 * 1024; // 24 MB (Cloudflare Pages limit is 25 MB)

let prunedCount = 0;
let prunedBytes = 0;

function walkAndPrune(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndPrune(fullPath);
      // Remove empty directory if all files inside were pruned
      try {
        if (fs.readdirSync(fullPath).length === 0) {
          fs.rmdirSync(fullPath);
        }
      } catch (e) {}
    } else if (entry.isFile()) {
      try {
        const stats = fs.statSync(fullPath);
        if (stats.size >= MAX_BYTES) {
          const mb = (stats.size / (1024 * 1024)).toFixed(1);
          console.log(`[PRUNE] Removing >24MB asset from dist for Cloudflare Pages: ${entry.name} (${mb} MB)`);
          fs.unlinkSync(fullPath);
          prunedCount++;
          prunedBytes += stats.size;
        }
      } catch (err) {
        console.warn(`[PRUNE] Warning reading ${fullPath}:`, err.message);
      }
    }
  }
}

if (fs.existsSync(DIST_DIR)) {
  console.log('[PRUNE] Scanning dist/ for assets exceeding Cloudflare Pages 25MB limit...');
  walkAndPrune(DIST_DIR);
  const totalMb = (prunedBytes / (1024 * 1024)).toFixed(1);
  console.log(`[PRUNE] Done. Pruned ${prunedCount} oversized files (Total: ${totalMb} MB). dist/ is Cloudflare Pages compliant!`);
} else {
  console.log('[PRUNE] No dist/ directory found. Skipping.');
}
