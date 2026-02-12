#!/bin/bash
# Agentia Sky — Build/Optimization Pipeline
# Usage: ./build.sh
set -euo pipefail

echo "=== Agentia Sky Build Pipeline ==="

# 1. PurgeCSS
echo "[1/5] Purging unused CSS..."
mkdir -p css/purged
npx purgecss \
  --css css/normalize.css css/webflow.css css/sky-5cdb33.webflow.css \
  --content "*.html" "assets/js/*.js" \
  --output css/purged/ \
  --safelist w--open w--current w-nav-overlay zoom-out hidden loading active \
  --font-face --keyframes

# 2. Consolidate + Minify CSS
echo "[2/5] Consolidating and minifying CSS..."
cat css/purged/normalize.css css/purged/webflow.css css/purged/sky-5cdb33.webflow.css > css/combined.css
npx clean-css-cli -O2 -o assets/css/styles.min.css css/combined.css

# Replace old @font-face with WOFF2 declarations
python3 -c "
import re
with open('assets/css/styles.min.css', 'r') as f:
    css = f.read()
css = re.sub(r'@font-face\{[^}]+\}', '', css)
new_fonts = \"\"\"@font-face{font-family:Cabinetgrotesk;src:url('../fonts/cabinet-400.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Cabinetgrotesk;src:url('../fonts/cabinet-500.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}@font-face{font-family:Cabinetgrotesk;src:url('../fonts/cabinet-700.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}@font-face{font-family:Eudoxussans;src:url('../fonts/eudoxus-400.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Eudoxussans;src:url('../fonts/eudoxus-500.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}@font-face{font-family:Eudoxussans;src:url('../fonts/eudoxus-700.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}\"\"\"
css = new_fonts + css
css = css.replace(\"url('../images/cohort-twentysix-1.jpg')\", \"url('../images/cohort-twentysix-1.webp')\")
with open('assets/css/styles.min.css', 'w') as f:
    f.write(css)
"

# 3. Minify JS
echo "[3/5] Minifying JavaScript..."
npx terser assets/js/main.js -o assets/js/main.min.js --compress --mangle

# 4. Content hashes for cache busting
echo "[4/5] Generating content hashes..."
CSS_HASH=$(md5 -q assets/css/styles.min.css | cut -c1-8)
JS_HASH=$(md5 -q assets/js/main.min.js | cut -c1-8)
echo "  CSS hash: $CSS_HASH"
echo "  JS hash:  $JS_HASH"

# 5. Summary
echo "[5/5] Build complete!"
echo ""
echo "=== File Sizes ==="
echo "CSS:    $(du -h assets/css/styles.min.css | cut -f1)"
echo "JS:     $(du -h assets/js/main.min.js | cut -f1)"
echo "Fonts:  $(du -sh assets/fonts/ | cut -f1)"
echo "Images: $(du -sh assets/images/ | cut -f1)"
echo "Total:  $(du -sh assets/ | cut -f1)"

# Cleanup
rm -rf css/purged css/combined.css
