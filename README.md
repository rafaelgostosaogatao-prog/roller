# Roller

Static website ready for GitHub Pages. No build or server required.

## Publish for free

1. Create a public GitHub repository named roller.
2. Upload index.html, parser.js, dados.json, and .nojekyll into the repository root.
3. In Settings > Pages, select Deploy from a branch, main, and / (root), then Save.
4. Open https://YOUR-USERNAME.github.io/roller/ once deployment finishes.

dados.json supplies the starting data for new browsers. Edits are stored in
localStorage for the current site path and browser. They do not update the
repository or sync between devices. Clearing site data removes saved edits.
Browser storage must be enabled. Files uploaded to the public repository are public.

For local use, serve this directory with a static HTTP server rather than opening
index.html directly.