#!/usr/bin/env python3
"""Patch react-dom package.json to remove the 'bun' condition from server exports.

Bun's built-in react-dom/server doesn't export renderToPipeableStream,
which Zudoku's SSR prerender step requires. This script removes the 'bun'
condition so it falls through to the 'node' version.
"""
import json
import os

pkg_path = os.path.join(os.path.dirname(__file__), '..', 'node_modules', 'react-dom', 'package.json')
pkg_path = os.path.normpath(pkg_path)

with open(pkg_path) as f:
    pkg = json.load(f)

exports = pkg.get('exports', {})
server_exports = exports.get('./server', {})

if 'bun' in server_exports:
    del server_exports['bun']
    with open(pkg_path, 'w') as f:
        json.dump(pkg, f, indent=2)
        f.write('\n')
    print('Patched react-dom/server exports: removed bun condition')
else:
    print('react-dom/server exports already patched')
