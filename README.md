# husbindos

husbindos.com — the post-wedding site. Static HTML on GitHub Pages (branch `main`); DNS at Squarespace Domains.

## Editing

Everything you will ever need to change lives in `config.js`:

- **Films** — `FILMS`: paste each YouTube ID into `youtube: ""` as the cuts arrive. Until then that film shows as "still in the edit". `poster` overrides the YouTube thumbnail; `tone` picks the screen colour (`sapphire`, `emerald`, `garnet`).
- **Photos** — `HOME_PHOTOS` (the two snapshots on the home page) and `GALLERY_PHOTOS` (up to five on the photos page) point at files in `assets/`. The photographer's set is in `photos-data.js` and `assets/photos/`; `PHOTO_CHAPTERS` sets the chapters and featured photos. Removing a photo means updating those files too, not only Drive.
- **Notes** — posted to a Google Form, read back from the published "Public" CSV tab of the Sheet "husbindos. — Notes & Registry". Hide a note by setting its "Show" cell to FALSE.
- **Registry** — the two links, `REGISTRY_SPAIN_URL` and `REGISTRY_WORLD_URL`.

Pages: `index.html`, `notes.html`, `photos.html`, `registry.html`, `video.html` (the films). `invite/` redirects to the Paperless Post invite. The peacocks are in `assets/peacock-*.png`, lifted from the invite artwork.
