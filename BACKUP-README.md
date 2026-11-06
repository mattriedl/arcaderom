# Backup of the live arcadewebsite.com

This branch is a snapshot of https://arcadewebsite.com exactly as it was served on **2026-11-06**, downloaded from the public site. It is kept separately from `main` and is not deployed anywhere.

- 4,711 files: every page listed in `sitemap.xml`, plus all thumbnails, assets and game files they load.
- Many games load their actual game code from outside CDNs (for example jsDelivr). Those external files are not included; only the pages on arcadewebsite.com are.
- 64 files that the pages reference were already returning "404 Not Found" on the live site at the time of the backup, so they could not be included (for example `/js/main.js` and several `/games/.../TemplateData/` files).
- Server-side files that visitors never see (server config, anything not linked from the public pages) cannot be captured this way.

To restore, upload the contents of this branch (except this file) to the web root.
