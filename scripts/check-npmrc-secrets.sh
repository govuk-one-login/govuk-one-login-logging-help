#!/usr/bin/env bash
# Prevents committing hardcoded tokens in .npmrc files.
# Runs as part of the Husky pre-commit hook.

set -euo pipefail

STAGED_NPMRC=$(git diff --cached --name-only | grep '\.npmrc$' || true)

if [ -z "$STAGED_NPMRC" ]; then
  exit 0
fi

echo "🔍 Checking staged .npmrc files for hardcoded tokens..."

PATTERN='_authToken=(ghp_|github_pat_|npm_|[A-Za-z0-9_-]{20,})'

for file in $STAGED_NPMRC; do
  if git show ":$file" | grep -qE "$PATTERN"; then
    echo ""
    echo "❌ ERROR: Hardcoded token detected in $file"
    echo ""
    echo "   Use an environment variable reference instead:"
    echo "   //npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}"
    echo ""
    echo "   To fix: replace the token value with \${GITHUB_TOKEN}"
    echo "   and export the token in your shell environment."
    echo ""
    exit 1
  fi
done

echo "✅ No hardcoded tokens found in .npmrc files."
