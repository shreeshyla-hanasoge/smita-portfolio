#!/usr/bin/env bash
#
# Deploy a review build of the site to its own S3 bucket.
#
# This is NOT the production deploy — that is ./deploy.sh, which pushes to
# smita-portfolio-website-2025 behind CloudFront at studiomintleaf.in. This
# script never touches either.
#
# What it does beyond a plain build-and-sync, and why:
#
#   1. VITE_PREVIEW=1        turns off react-ga4 and shows the preview badge
#   2. strips the gtag block  the analytics snippet is hardcoded in index.html,
#                             outside React's reach. Left in, a reviewer walking
#                             the stubbed checkout would post `purchase` events
#                             with rupee values into the studio's production
#                             GA4 property — inventing revenue and corrupting
#                             the demand data E9 is gated on.
#   3. robots.txt disallow    a public copy of the whole site is otherwise free
#                             to rank against studiomintleaf.in for the studio's
#                             own name.
#
# Usage:  ./scripts/deploy-preview.sh [bucket-name]

set -euo pipefail

BUCKET="${1:-studiomintleaf-shop-preview}"
REGION="ap-south-1"

echo "▸ Building preview bundle"
VITE_PREVIEW=1 npm run build

INDEX="dist/index.html"
[ -f "$INDEX" ] || { echo "✗ dist/index.html missing — build failed?"; exit 1; }

echo "▸ Stripping production analytics from index.html"
python3 - "$INDEX" <<'PY'
import re, sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()

# The gtag loader and its inline config block, both hardcoded in index.html.
before = html
html = re.sub(
    r'\s*<!-- Google tag \(gtag\.js\) -->.*?gtag\(\'config\'[^\n]*\n\s*</script>',
    '\n    <!-- analytics removed for the preview build -->',
    html,
    flags=re.S,
)
html = re.sub(r'\s*<script[^>]*googletagmanager[^>]*>\s*</script>', '', html)

if 'googletagmanager' in html or "gtag('config'" in html:
    sys.exit('✗ analytics snippet still present after strip — refusing to publish')

# Belt and braces: the SPA sets this via Helmet too, but a crawler that does not
# run JavaScript only ever sees the static head.
html = html.replace(
    '<meta charset="UTF-8" />',
    '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow" />',
)

open(path, 'w', encoding='utf-8').write(html)
print('  removed %d bytes of analytics markup' % (len(before) - len(html)))
PY

echo "▸ Writing robots.txt"
cat > dist/robots.txt <<'EOF'
# Preview build of studiomintleaf.in — not the live site.
# Nothing here should be indexed.
User-agent: *
Disallow: /
EOF

echo "▸ Syncing to s3://$BUCKET"
# Hashed assets can cache hard; index.html and robots.txt must not, or reviewers
# keep seeing yesterday's build after a redeploy.
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --exclude index.html --exclude robots.txt \
  --cache-control "public, max-age=31536000, immutable"

aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache, must-revalidate" --content-type "text/html"

aws s3 cp dist/robots.txt "s3://$BUCKET/robots.txt" \
  --cache-control "no-cache" --content-type "text/plain"

echo
echo "✓ Preview deployed"
echo "  http://$BUCKET.s3-website.$REGION.amazonaws.com/shop"
