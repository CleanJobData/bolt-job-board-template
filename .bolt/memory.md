# Project memory

## Product intent & audience

- Job board template built with Vite + React, intended for users to copy and customize for their own job boards.
- Not tied to a single brand; default title uses generic "Job Board — Find Your Next Dream Job."
- Data powered by CleanJobData API; footer credits "Powered by CleanJobData API."

## Brand personality & voice

- Generic, white-label-friendly defaults suitable for a template.
- CleanJobData brand appears only as API/data provider credit, not as the page title or primary brand.

## Visual design & UX direction

- Theme switching supported via a theme script in `index.html`.
- Uses custom fonts loaded in `index.html`.
- Tailwind CSS + Lucide React icons (per `.bolt/prompt`).

## Decisions, constraints & rationale

- Keep `index.html` meta description, theme script, and fonts unchanged when editing title.
- Footer "Powered by CleanJobData API" link must remain unchanged.
- Default `<title>` changed from "CleanJobData — Find Your Next Dream Job" to "Job Board — Find Your Next Dream Job" so template copies don't carry the original brand name.
- Publishing is user-triggered via Bolt UI Publish button; assistant cannot publish automatically.

## Open questions & assumptions

- Deployment target is Bolt Cloud (publish via top-right Publish button).
- Template users are expected to update title and branding to their own job board identity.