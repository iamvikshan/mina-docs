#!/bin/bash

# Exit immediately if a pipeline returns a non-zero status
set -euo pipefail

echo "Starting environment setup..."

# 1. Update and upgrade system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Make author.sh executable if it exists
if [ -f scripts/author.sh ]; then
  echo "Making scripts/author.sh executable..."
  chmod +x scripts/author.sh
fi

# 3. Set the timezone
echo "Setting timezone to Africa/Nairobi..."
sudo ln -sf /usr/share/zoneinfo/Africa/Nairobi /etc/localtime

# 4. Install CodeRabbit CLI
echo "Installing CodeRabbit CLI..."
curl -fsSL https://cli.coderabbit.ai/install.sh | sh

# 5. Fetch hooks from the iamvikshan/atlas repository
echo "Fetching hooks from GitHub..."

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' INT TERM EXIT
git clone --depth 1 --filter=blob:none --sparse https://github.com/iamvikshan/atlas.git "$TMP_DIR"
git -C "$TMP_DIR" sparse-checkout set scripts/hooks

mkdir -p scripts/hooks
SRC="$TMP_DIR/scripts/hooks"

if [ ! -d "$SRC" ]; then
  echo "ERROR: hooks directory not found in fetched repository." >&2
  exit 1
fi

copied=0

for f in "$SRC"/*; do
  [ -e "$f" ] || continue
  cp -R "$f" scripts/hooks/
  copied=$((copied + 1))
done

for f in "$SRC"/.*; do
  name="${f##*/}"
  if [ "$name" = "." ] || [ "$name" = ".." ]; then continue; fi
  [ -e "$f" ] || continue
  cp -R "$f" scripts/hooks/
  copied=$((copied + 1))
done

if [ "$copied" -eq 0 ]; then
  echo "ERROR: source hooks directory is empty; nothing copied." >&2
  exit 1
else
  echo "Hooks successfully fetched and copied!"
fi

echo "Setup complete!"