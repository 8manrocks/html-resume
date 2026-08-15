# HTML Resume codebase reference

## Architecture

| Layer | Source | Behavior |
| --- | --- | --- |
| Content | `resume-bundles/*.json` | One JSON document per resume variant. |
| Target selection | `bundle-target.js` | Normalize and validate an optional bundle name, then select matching source artifacts. |
| HTML generation | `generate-resume.js` | Read selected bundles and write same-basename files to `generated-templates/`. |
| Shared presentation | `styles.css`, `fonts/` | Apply Lato typography, section layout, and print page-break rules to every generated resume. |
| PDF generation | `generate-pdf.js` | Open selected generated HTML files in Puppeteer and write same-basename A4 PDFs to `generated-pdfs/`. |
| Orchestration | `build.js`, `package.json` | Run HTML generation before PDF generation and forward the optional bundle target. |

`generated-templates/` and `generated-pdfs/` are tracked build artifacts. Root-level `man.html` and `man.pdf` are legacy standalone artifacts outside the current generators.

## Bundle data contract

Every bundle requires this identity/contact shape because the generator dereferences it unconditionally:

```json
{
  "basics": {
    "name": "First Last",
    "contact": {
      "phone": "...",
      "email": "...",
      "github": "https://...",
      "linkedin": "https://..."
    }
  }
}
```

Supported top-level sections appear in this fixed output order:

1. `summary`: string.
2. `professional_highlights`: array of strings.
3. `experience`: array of `{ company, role, period, location, highlights }`; `tech_stack` is optional.
4. `projects`: array of `{ name, role, highlights }`; `period`, `location`, and `tech_stack` are optional.
5. `skills`: array of `{ category, items }`, where `items` is a display-ready string rather than an array.
6. `certifications`: array of strings.
7. `achievements`: array of strings.
8. `education`: array of `{ institution, degree, period, location }`; `score` and `description` are optional.

`additionalStylings` optionally maps section IDs to trusted inline CSS strings. Known section IDs are `summary`, `professional-highlights`, `experience`, `projects`, `skills`, `certifications`, `achievements`, and `education`. Existing multi-page variants use a value such as `"page-break-after: always; border-bottom: none;"` on `projects`.

## Rendering rules and sharp edges

- `processText` replaces `[b]` and `[/b]` with `<b>` tags in most displayed fields. It does not escape HTML, URLs, or inline CSS; treat bundle files as trusted input.
- An absent optional top-level property suppresses its section. An empty array is truthy in JavaScript and can still emit an empty section, so omit unused properties instead of setting them to `[]`.
- When a section is present, the generator assumes its required nested keys and arrays exist. There is no schema validation or friendly missing-field error.
- The first whitespace-separated token in `basics.name` receives the lightest heading weight; all remaining tokens form the last-name portion.
- Generated pages link to `../styles.css`. Font URLs resolve relative to that stylesheet, so the current directory relationship matters.
- Shared CSS uses native CSS nesting and print rules. Puppeteer's Chromium is the authoritative renderer even if another browser previews it differently.
- PDF output is A4 with 15 mm margins on all sides and `printBackground: true`. Print CSS removes the body's 20 pt screen padding.
- `.project`, `.qualification`, `.certificate`, `.skill-category`, and `.highlights` avoid internal page breaks; headings avoid a break immediately afterward. Use `.page-break`, `.no-break`, or section inline styling for exceptional pagination.
- Pass one bundle basename to target it. `.json` and `.html` suffixes are accepted and normalized; directory paths and multiple targets are rejected.
- Omit the target to process every input. Use full generation for changes to shared rendering or styling.

## Commands and checks

```text
npm install                              install Puppeteer from the lockfile context
npm run generate-html                    generate HTML for every bundle
npm run generate-html -- <bundle>        generate HTML for one bundle
npm run generate-pdf                     generate PDFs for every template
npm run generate-pdf -- <bundle>         generate a PDF for one template
npm run build                             run both stages for every bundle
npm run build -- <bundle>                 run both stages for one bundle
node --check <script.js>                  syntax-check a script
```

Use `npm ci` for a clean dependency installation when reproducibility matters and deleting/replacing the existing `node_modules` directory is acceptable. PDF generation needs a usable Puppeteer-managed Chromium installation.

There is currently no automated test suite, JSON schema, lint task, or formatter. Validate through JSON parsing, JavaScript syntax checks, artifact diffs, and visual inspection of affected output.
