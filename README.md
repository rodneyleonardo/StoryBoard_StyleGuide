# Storyboard Styles · WPP AI

A client-facing library of storyboard styles. Ten visual languages, each drawn on the same two scenes (a muscle car on a New York street, a boy at the breakfast table), so the treatment is the only variable.

Static site. No build step, no dependencies. Runs on GitHub Pages as is.

## Publish on GitHub Pages

1. Create a repository and upload the contents of this folder to its root (keep `.nojekyll`).
2. Settings, Pages, Source: Deploy from a branch, branch `main`, folder `/ (root)`.
3. The site goes live at `https://<user>.github.io/<repo>/` within a minute or two.

Links to a single style work directly, for example `.../#graphic-cel-inked-realism`.

Note: on a free GitHub plan, Pages needs a public repository, so the frames and the WPP logo are publicly reachable.

## Structure

```
index.html        page shell
styles.css        layout and type
app.js            views, routing, interactions
data.js           the ten styles: name, family, description, order
assets/           WPP logo (SVG, vectorized from the supplied PNG), favicon
images/<slug>/    car-1, car-2, kid-1, kid-2 (.webp, 1088 x 608)
tools/add_images.py  converts real frames into images/
```

## Edit content

- Reorder, rename or re-describe styles in `data.js`. The index layout adapts to any count.
- Replace frames by dropping new files into `images/<slug>/` with the same names.

## Type

- Garamond Std Light is a commercial face and is not on Google Fonts. EB Garamond has no light weight there.
- Primary: Cormorant Garamond Light (300), the closest Garamond with a true light weight on Google Fonts.
- Secondary: Inter Tight, a neutral grotesk that matches the micro labels of the reference.
- If WPP licenses Garamond Std Light for web, add the `@font-face` and put its name first in `--serif` in `styles.css`.

## Interactions

- Index: hover links a style's name and frames; Scene toggle switches every thumbnail between Street and Breakfast; the menu opens a quick index with preview.
- Style page: stage viewer, four frames, arrow keys to step, click or Full screen for a lightbox (swipe on phones), Compare puts the same frame next to any other style, Copy link for sharing, previous and next style.

## Admin

`admin.html` manages the library: add, edit, hide/show, reorder and delete styles. It isn't linked from the site and is marked noindex. Open it directly at `/admin.html`.

1. Create a fine-grained GitHub token: Settings → Developer settings → Personal access tokens → Fine-grained tokens. Repository access: only this repo. Permissions: Contents, Read and write.
2. Open `/admin.html`, paste the token, Connect.
3. Make changes. Nothing goes live until you press **Publish to site**, which writes one commit (data.js plus images). The site updates in about a minute.

New frames are resized to 1088 × 608 and converted to WebP in the browser. Use Chrome for adding frames.
The token is stored only in that browser's local storage. Use Disconnect to clear it. Never commit a token to the repo.
