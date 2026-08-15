---
name: maintain-html-resume
description: Maintain this repository's JSON-driven HTML and PDF resume pipeline. Use when Codex works in the html-resume codebase to add or edit resume bundles, change generated resume markup, tune print CSS or pagination, regenerate tracked HTML/PDF outputs, or diagnose Node/Puppeteer build problems.
---

# Maintain HTML Resume

Read [references/codebase.md](references/codebase.md) before making repository changes. Treat it as the source for the data contract, pipeline boundaries, and project-specific pitfalls.

## Follow the change workflow

1. Inspect `git status` and preserve unrelated user changes.
2. Identify the source layer:
   - Edit `resume-bundles/<name>.json` for resume content.
   - Edit `generate-resume.js` for document structure or data-field support.
   - Edit `styles.css` for shared screen/print presentation and pagination.
   - Edit `generate-pdf.js` for browser launch or PDF settings.
3. Modify source files, not generated artifacts. Keep a bundle's basename stable unless the output files should also be renamed.
4. Regenerate the affected tracked outputs:
   - Run `npm run build -- <bundle>` after a bundle-specific change.
   - Run `npm run generate-html -- <bundle>` or `npm run generate-pdf -- <bundle>` when only one stage is needed.
   - Run `npm run build` without a bundle after shared generator, CSS, font, or PDF-setting changes that affect every resume.
5. Review `git diff` and confirm that every changed file is intentional.

## Validate proportionally

- Parse every file in `resume-bundles/` as JSON after data changes.
- Run `node --check` on changed JavaScript files.
- Open or render-check affected HTML/PDF output when layout, pagination, fonts, or links changed.
- Confirm corresponding `generated-templates/<name>.html` and `generated-pdfs/<name>.pdf` files exist when adding a bundle.
- Do not use `npm test` as a success check; it is an intentional placeholder that exits with failure.

## Preserve project conventions

- Use UTF-8 JSON and `[b]...[/b]` for the only supported inline rich-text shorthand.
- Keep generated HTML and PDFs committed when their sources change.
- Keep changes dependency-light. There is no framework, schema library, formatter, linter, or test harness in the current project.
- Avoid broad cleanup of existing resume copy or legacy root-level `man.html`/`man.pdf` unless the user requests it.
