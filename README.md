<p align="center"><img src="dist/usman-dev-logo.png" width="160" alt="Usman Dev — Full-Stack Developer" /></p>

# Usman Dev — Developer Portfolio

A responsive personal portfolio built with **HTML, CSS and JavaScript**. Explore project galleries, skills and the work behind each door. Includes a form-based Portfolio Studio for keeping content up to date.

![Usman Dev — Build, Solve, Improve](docs/images/usman-dev-banner.svg)

**[Live portfolio](https://malikusmandev.vercel.app) · [Portfolio Studio](https://malikusmandev.vercel.app/editor.html)**

## Features

- Cream-to-dark introduction, animated notebook role card and original owner branding.
- Four interactive project doors, including **Video Editing**.
- Four real GitHub projects with **five original visual guides each**.
- Data-driven skills, profile links and experience chapters.
- Email, WhatsApp, Facebook and GitHub contact links.
- About, education and expanded skill groups from the owner's supplied CV, plus a downloadable two-page CV PDF.
- Portfolio Studio: add/edit/remove projects and skills, preview a browser draft, import/export JSON and download updated content.
- Keyboard navigation, responsive layouts, accessible labels and reduced-motion support.
- Static hosting: no server, database or runtime dependency required.

## Project visuals

These are original source-based documentation illustrations, not screenshots of running applications.

| Malik Oil Store | SKV Construction |
| --- | --- |
| ![Malik Oil Store overview](dist/images/projects/malik-oil-store/01-cover.svg) | ![SKV Construction overview](dist/images/projects/SKV/01-cover.svg) |

| CAM — development preview | Malik Oil — Android workspace |
| --- | --- |
| ![CAM overview](dist/images/projects/CAM/01-cover.svg) | ![Malik Oil Android overview](dist/images/projects/Malik-Oil/01-cover.svg) |

Each project's `dist/images/projects/` folder includes overview, features, architecture, workflow and technology visuals.

## Run locally

Open `dist/index.html` in a browser. For draft preview and consistent browser storage, serve the folder locally:

```sh
python -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. No package installation is required. Optional source validation uses Node.js 20 or later:

```sh
npm run check
```

## Update your portfolio

Open `/editor.html` for Portfolio Studio. Edit your profile, add project live/GitHub/image links and update your skills.

**Save draft stores changes only in that browser.** Draft preview is private to that browser's storage; it does not update the public website. Download `content.js`, replace `dist/content.js` in this repository, and push to the production branch to publish through the connected Vercel project. Use JSON backup/import to move a draft to another device.

You can also edit `dist/content.js` directly. All personal details, links, projects, skills and timeline entries live in that one file. Project `gallery` arrays reference the five-image guides. Local image paths must start with `images/`; external image URLs must use HTTP or HTTPS.

## Deploy on Vercel

Import this repository, select the **Other** framework preset and use the repository root. The included `vercel.json` serves the `dist` directory without build or install steps. Production Git deployments publish the configured production branch.

Production address: **https://malikusmandev.vercel.app**. Connected Git repository: `MalikUsmanAbid/usman-dev-portfolio`; production branch: `main`.

## Loading and motion

The live page uses responsive WebP portraits (about 25-57 KB), a 3 KB header logo and a small favicon. Original PNGs remain in the repository for safekeeping but are not the normal page-loading assets. DM Sans and Manrope Latin variable fonts are served locally with swap/preload; their OFL licenses are included in `dist/fonts/`. Below-fold project imagery is lazy-loaded. The rotating notebook has a stable width, and scroll updates avoid unchanged DOM writes. Reduced motion keeps the role label and door transforms stable.

Responsive browser checks cover 320, 360, 390, 768, 1024 and 1440 px widths, project doors, mobile navigation, overflow, role-label fit, reduced motion and Studio content validation. Device emulation is used; physical-phone testing is separate.

## Source map

```text
dist/
  index.html          Portfolio
  content.js          Editable content
  app.js              Portfolio interactions
  style.css           Reference-inspired layout
  personalized.css    Branding, skills and galleries
  editor.html         Portfolio Studio
  editor.js           Browser draft and export workflows
  editor.css          Studio styles
  images/projects/    Twenty original SVG visual guides
docs/images/          Profile banner
scripts/check.mjs     Dependency-free source/asset validation
vercel.json           Static deployment configuration
```

## Contact

[GitHub](https://github.com/MalikUsmanAbid) · [Email](mailto:usmandev234@gmail.com) · [WhatsApp](https://wa.me/923157543808) · [Facebook](https://www.facebook.com/profile.php?id=61594398140960)

Owner photography, logo, branding and original visual guides belong to Usman Dev. No third-party project licenses are changed by this portfolio repository.
