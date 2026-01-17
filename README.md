# HTML Resume Generator

A tool to generate HTML and PDF resumes from JSON data bundles, styled with CSS.

## Overview

This project allows you to maintain multiple resume versions (bundles) as JSON files. It generates HTML templates and PDF files dynamically.

## Directory Structure

- **`resume-bundles/`**: Contains resume data in JSON format (e.g., `abhishek-fullstack.json`, `abhishek-frontend.json`).
- **`generated-templates/`**: Output directory for generated HTML files.
- **`generated-pdfs/`**: Output directory for generated PDF files.
- **`styles.css`**: Global stylesheet applied to all generated resumes.

## Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Create/Edit Resume Bundles

Add or modify `.json` files in the `resume-bundles/` directory.

**Structure:**
- `basics`: Name, contact info.
- `professional_highlights` (optional): List of highlights.
- `experience`: List of roles with `tech_stack` (optional) and `highlights`.
- `skills`: Categorized skills. item lists can contain HTML.
- `certifications`: List of certs.
- `education`: Degree, institution, etc.

### 3. Build (Generate HTML & PDF)

Run the full build pipeline:

```bash
npm run build
```

This command runs:
1.  `npm run generate-html`: Converts JSON bundles to HTML in `generated-templates/`.
2.  `npm run generate-pdf`: Converts those HTML files to PDFs in `generated-pdfs/`.

### Individual Commands

- **Generate only HTML**:
  ```bash
  npm run generate-html
  ```
- **Generate only PDF**:
  ```bash
  npm run generate-pdf
  ```
