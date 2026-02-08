# Repository Guidelines

## Project Structure & Module Organization
This repository is a static Webflow export with hand-edited content.
- Root: page entry points such as `index.html`, `about.html`, `contact.html`, `servicii.html`, `404.html`, and `401.html`.
- `css/`: global styles (`normalize.css`, `webflow.css`) plus project-specific styling in `sky-5cdb33.webflow.css`.
- `js/webflow.js`: bundled interaction/runtime script from Webflow.
- `images/` and `fonts/`: static assets used across pages.
- `docs/`: content, research, and conversion notes (`content.md`, `research.md`, `conversion.md`).

## Build, Test, and Development Commands
No build pipeline is required; files are served directly.
- `python3 -m http.server 8000`: run a local static server from repo root.
- `open http://localhost:8000/index.html`: open the homepage locally on macOS.
- `rg --files -g '*.html'`: list all editable page files.
- `rg -n 'TODO|FIXME' .`: find pending cleanup items before opening a PR.

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML/CSS to match existing files.
- Keep filenames lowercase and descriptive (prefer kebab-case for new files, e.g., `pricing-table.html`).
- Preserve Webflow utility/class conventions (`w-...`) and avoid renaming generated classes unless all references are updated.
- Keep custom inline CSS/JS minimal; prefer editing shared styles in `css/sky-5cdb33.webflow.css`.

## Testing Guidelines
Automated tests are not configured; use manual regression checks.
- Validate each changed page at desktop and mobile widths (at least ~1440px, ~768px, ~390px).
- Confirm navigation links, CTA buttons, and form flows behave correctly.
- Check browser console for JS errors and network panel for missing assets (404s).
- Verify SEO-critical tags (`<title>`, description, and JSON-LD blocks) after content edits.

## Commit & Pull Request Guidelines
Local `.git` history is not available in this workspace, so use a clear, conventional format.
- Commit format: `type(scope): summary` (example: `fix(contact): correct hero CTA link`).
- Keep commits focused by page or concern (content, styling, assets).
- PRs should include: brief intent, list of changed files/pages, manual test notes, and screenshots for visual changes.
