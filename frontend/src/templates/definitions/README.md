# Modern Pro CV Template

## Overview

The **Modern Pro** template is a professional CV template designed to showcase CVs in the best light for human readers. It features a clean two-column layout with photo support and modern typography.

## Features

✅ **Photo Support**: Circular profile photo (100px) with elegant border  
✅ **Two-Column Layout**: 30% left sidebar + 70% main content  
✅ **Professional Design**: Clean blue (#1e40af) and gray color scheme  
✅ **RTL Support**: Full Arabic (RTL) support with Cairo font  
✅ **Modern Typography**: Inter font family with proper hierarchy  
✅ **PDF Export Ready**: Optimized for high-quality PDF generation  

## Template Structure

### Header Section
- **Photo**: Circular, 100px diameter, top-left position
- **Name**: Bold, 28px, primary color (#1e40af)
- **Job Title**: Medium, 14px, primary color
- **Summary**: Max 2 lines, 11px, dark gray

### Layout

#### Left Column (30%)
1. **Contact Information**
   - No icons (clean text-only)
   - Font size: 10px
   - Color: Muted gray (#6b7280)

2. **Skills**
   - Grouped by category
   - Section header: 12px, uppercase, bold
   - Skills: 10px, vertical layout

3. **Languages**
   - Proficiency levels shown
   - Vertical layout
   - 10px font size

#### Right Column (70%)
1. **Professional Summary**
   - Full paragraph format
   - 11px, line height 1.6
   - Dark gray text

2. **Experience**
   - Job title: 12px, bold
   - Company: 11px, primary color
   - Dates: 10px, muted gray
   - Bullet points with primary color bullets

3. **Education**
   - Degree: 12px, bold
   - Institution: 11px, primary color
   - Dates: 10px, muted gray

### Footer
- Subtle separator line (#e5e7eb)
- Optional certificate information
- 9px, light gray text

## Design Specifications

### Colors
```json
{
  "primary": "#1e40af",      // Professional Blue
  "background": "#ffffff",    // White
  "text": "#111827",         // Near Black
  "mutedText": "#6b7280",    // Gray
  "borders": "#e5e7eb"       // Light Gray
}
```

### Typography
```json
{
  "fontFamily": "Inter, system-ui, -apple-system, sans-serif",
  "name": "28px / 700",
  "jobTitle": "14px / 500",
  "sectionHeader": "12px / 700 / uppercase",
  "body": "11px / 400",
  "contact": "10px / 400"
}
```

### Spacing
```json
{
  "sectionGap": "16px",
  "columnGap": "24px",
  "itemPadding": "8px",
  "documentMargin": "32px"
}
```

## Settings

```json
{
  "showPhoto": true,
  "photoShape": "circle",
  "showSummary": true,
  "showContactIcons": false,
  "columnLayout": "two-column",
  "atsCompatible": false
}
```

## RTL Support

The template fully supports RTL (Right-to-Left) languages:

- **Font**: Cairo (Arabic-optimized)
- **Direction**: RTL
- **Photo Position**: Automatically switches to top-right
- **Column Order**: Reversed for RTL

## Usage

### In Code

```typescript
import { getTemplate } from '@/templates/definitions';

const modernProTemplate = getTemplate('modern-pro');

// Use template settings
const { settings, design, blocks } = modernProTemplate;
```

### Block Components

The template uses the following block components:

- `HeaderBlock` - Photo, name, job title, summary
- `ContactBlock` - Contact information
- `SummaryBlock` - Professional summary
- `ExperienceBlock` - Work experience
- `EducationBlock` - Education history
- `SkillsBlock` - Skills by category
- `LanguagesBlock` - Language proficiencies
- `FooterBlock` - Footer with separator

## Export Settings

### PDF Export
- **Page Size**: A4
- **Margins**: 32px all sides
- **Quality**: High
- **Selectable Text**: Yes
- **Font Embedding**: Yes

## Implementation Notes

1. **No New Components**: Uses existing block types from the component library
2. **Configuration-Based**: All styling controlled via JSON settings
3. **ATS Not Priority**: Optimized for human readers, not ATS parsing
4. **Clean Design**: No gradients or fancy effects - professional simplicity

## Testing Checklist

- [ ] Photo displays correctly (circular, 100px)
- [ ] Two-column layout renders with proper proportions (30/70)
- [ ] All typography scales match specifications
- [ ] Colors are consistent throughout
- [ ] RTL mode works without breaking layout
- [ ] PDF export is clean and professional
- [ ] No content overflow issues
- [ ] Template can be selected and applied
- [ ] Works with sample CV data

## File Location

```
/frontend/src/templates/definitions/modernPro.json
/frontend/src/templates/definitions/index.ts
```

## Version History

- **v1.0.0** (2026-01-01): Initial release

## Author

MonCVPro Team

## License

MIT
