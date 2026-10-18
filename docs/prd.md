# Product requirements: portfolio site

## Summary

A personal portfolio site for a single owner. It presents projects, background, and current focus. Its distinguishing feature is a keyboard-driven home page where every key is a way into the content, and every state is a URL. It is built to be read by people on phones, by people on desktops, and by AI tools.

## Audience

- Recruiters, collaborators, and community organizers who want a quick, accurate picture of the owner's work.
- Visitors on mobile networks and older phones, who need the page to load fast.
- Keyboard-first visitors and people who want to share an exact view of the site.
- AI assistants and crawlers, which should be able to read the content as Markdown and plain text.

## Goals

1. Show projects, background, and current focus clearly on every screen size, from 375 px phones to desktop.
2. Make every visible state reachable by URL, so any view can be shared, bookmarked, or reproduced.
3. Offer a keyboard path to every section, with the same actions available from the keyboard, the command palette, and the navbar.
4. Support light and dark themes that follow the operating system by default and can be forced by URL.
5. Provide search over site content that works without a server and without a runtime call to a language model.
6. Expose each content page as Markdown, and publish machine-readable indexes of the site at build time.

## Non-goals

- A content management system. Content lives in version-controlled files.
- Server-side rendering, serverless functions, or dynamic routes. The site is static.
- A blog or log at launch. The posts collection exists as an empty scaffold.
- Languages other than English at launch. Additional locales follow later.
- Analytics. None are added until the owner decides to launch them.
- Commercial use. The source is published under a noncommercial license.
- A progressive web app at launch.

## Functional requirements

- Keyboard hero on the home page. Action keys open the About, Projects, Log, and Search overlays, toggle the theme and mute, cycle the language, and open the command palette. Letter aliases exist for the main actions.
- Overlays open and close from the URL. Back closes an overlay. Escape closes it.
- Command palette with navigation, actions, and projects. Opens from a key or a URL.
- Keyword search over all content. Semantic search is a later enhancement that loads only when the visitor starts searching.
- A copy-email action that copies the owner's contact address to the clipboard.
- Project pages with summaries, links, and a Markdown companion.
- Sitemap, canonical links, and a Markdown alternate link on every page.

## Success metrics

Performance, measured on a mid-range mobile profile with slow 4G throttling:

- Lighthouse mobile performance score of at least 95.
- Largest Contentful Paint under 2.0 s.
- Cumulative Layout Shift under 0.05.
- Interaction to Next Paint under 200 ms.

Quality:

- Zero critical or serious accessibility violations in an axe-core scan of each page.
- Zero console errors or warnings on each page in QA.
- Every action key routes to its documented URL state.
- Every page has a Markdown companion, and the site-wide index lists every page.

Search:

- Keyword results appear within 200 ms on a cold page load.
- The semantic model finishes loading within 8 s on slow 4G, and merged results appear within 25 ms once it is warm.
- Search keeps working with keyword results alone if the model fails to load.

Visual:

- Layouts render without collapse at 375, 768, and 1280 px widths, in light and dark themes.

## Constraints

- Static output on Cloudflare. No server runtime.
- Self-hosted fonts. No third-party font CDN.
- Source-available license (PolyForm Noncommercial 1.0.0). Third-party attribution is in the NOTICE file.
- Package management with pnpm.

## Open questions

- Final tagline. Three candidates will be drafted before launch.
- Whether a log or blog ships at launch or after.
- Whether the semantic search model is shipped with the site or fetched on first use. The current plan fetches it on first use.
