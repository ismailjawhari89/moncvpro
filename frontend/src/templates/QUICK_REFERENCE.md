# Modern Pro Template - Quick Reference

## 🚀 Quick Start

```typescript
import { getTemplate } from '@/templates/definitions';
import { TemplateRenderer } from '@/templates/components/TemplateRenderer';

const template = getTemplate('modern-pro');

<TemplateRenderer template={template} data={cvData} locale="en" />
```

## 📋 Template ID
`modern-pro`

## 🎨 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#1e40af` | Headers, accents, links |
| Background | `#ffffff` | Page background |
| Text | `#111827` | Main body text |
| Muted | `#6b7280` | Secondary text, contact |
| Borders | `#e5e7eb` | Lines, separators |

## 📐 Typography Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Name | 28px | 700 | Primary |
| Job Title | 14px | 500 | Primary |
| Section Header | 12px | 700 | Primary |
| Body Text | 11px | 400 | Text |
| Contact | 10px | 400 | Muted |

## 📏 Spacing

| Element | Value |
|---------|-------|
| Section Gap | 16px |
| Column Gap | 24px |
| Item Padding | 8px |
| Document Margin | 32px |

## 🖼️ Photo Settings

- **Size**: 100px × 100px
- **Shape**: Circle
- **Border**: 2px solid #e5e7eb
- **Position**: Top-left (LTR) / Top-right (RTL)

## 📊 Layout

```
┌─────────────────────────────────────┐
│  Photo  Name                        │
│         Job Title                   │
│         Summary (max 2 lines)       │
├──────────────┬──────────────────────┤
│ LEFT (30%)   │ RIGHT (70%)          │
│              │                      │
│ • Contact    │ • Summary            │
│ • Skills     │ • Experience         │
│ • Languages  │ • Education          │
│              │                      │
└──────────────┴──────────────────────┘
│         Footer                      │
└─────────────────────────────────────┘
```

## 🔧 Settings Object

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

## 🌍 RTL Support

```typescript
// Arabic mode
<TemplateRenderer 
  template={template} 
  data={arabicData} 
  locale="ar" 
/>
```

**Changes in RTL:**
- Font → Cairo
- Direction → RTL
- Photo → Top-right
- Columns → Reversed

## 🎨 Customization

```typescript
const customColors = {
  colors: {
    primary: '#059669', // Custom green
    // ... other colors
  }
};

<TemplateRenderer 
  template={template} 
  data={cvData}
  customizations={customColors}
/>
```

## 📦 Block Components

| Block | Type | Purpose |
|-------|------|---------|
| header | HeaderBlock | Photo, name, title, summary |
| contact | ContactBlock | Email, phone, location |
| summary | SummaryBlock | Professional summary |
| experience | ExperienceBlock | Work history |
| education | EducationBlock | Academic background |
| skills | SkillsBlock | Skills by category |
| languages | LanguagesBlock | Language proficiencies |
| footer | FooterBlock | Footer with separator |

## 📄 File Locations

```
/frontend/src/templates/
├── definitions/modernPro.json    # Template config
├── definitions/index.ts          # Registry
├── components/TemplateRenderer.tsx
├── components/blocks/HeaderBlock.tsx
└── types.ts                      # TypeScript types
```

## ✅ Acceptance Criteria

- [x] Template definition created
- [x] Photo support (circular, 100px)
- [x] Two-column layout (30/70)
- [x] Typography matches specs
- [x] RTL support enabled
- [ ] All blocks implemented
- [ ] PDF export tested
- [ ] Integration complete

## 🐛 Troubleshooting

**Photo not showing?**
- Check `photoUrl` is provided in data
- Verify `showPhoto: true` in settings

**Layout broken?**
- Verify column widths sum to 100%
- Check `columnLayout: "two-column"`

**RTL not working?**
- Ensure `locale="ar"` is set
- Check template has `rtl.supported: true`

## 📞 Support

- Docs: `/frontend/src/templates/definitions/README.md`
- Testing: `/frontend/src/templates/TESTING.md`
- Examples: `/frontend/src/templates/examples/ModernProExample.tsx`

---

**Version**: 1.0.0 | **Updated**: 2026-01-01
