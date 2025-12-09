# Pro Templates System

This project uses a modular, JSON-based template system to generate CVs and export them to PDF.

## 📁 Structure

- `src/templates/definitions/*.json`: Template definitions (Metadata, Palette, Layout, Blocks).
- `src/templates/components/blocks/`: React components for each block type (Header, Experience, etc.).
- `src/templates/layouts/`: Layout components (OneColumn, TwoColumn, Sidebar).
- `src/templates/components/TemplateRenderer.tsx`: Main entry point for rendering a template.
- `src/app/api/export-pdf`: API route for server-side PDF generation using Puppeteer.

## 🚀 How to Add a New Template

1. **Create JSON Definition**:
   Copy `src/templates/definitions/modern.json` and name it `your-template.json`.
   Update the `id`, `name`, and `blocks` configuration.

2. **Register Template**:
   Import your JSON in `src/templates/definitions/index.ts` and add it to the `templates` object.

3. **Add Thumbnail**:
   Place a preview image in `public/templates/your-thumbnail.png` and reference it in the JSON `thumbnail` field.

## 🖨️ PDF Export

The PDF export uses **Puppeteer** running on the server (API Route).
It renders the generic `TemplateRenderer` into a headless browser and prints to PDF.

### Local Development
Ensure you have run `npm install` to install Puppeteer.
The API is at `POST /api/export-pdf`. Payload: `{ "html": "..." }`.

### Production Deployment (Vercel)
For Vercel, you need to configure `puppeteer-core` and `@sparticuz/chromium` due to size limits.
See `src/app/api/export-pdf/route.ts` comments.

## 🧪 Testing

Run tests with:
```bash
npm run test
# or
npx vitest run tests/
```
