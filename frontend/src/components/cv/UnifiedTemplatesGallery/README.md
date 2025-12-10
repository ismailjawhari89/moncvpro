# Unified Templates Gallery

A comprehensive, responsive, and feature-rich React component for displaying, filtering, and selecting CV templates. This component consolidates the functionality of the previous `TemplatesGallery` and `EnhancedTemplatesGallery` into a single, maintainable architecture.

## 🌟 Features

- **Unified Architecture**: Combines browsing, filtering, and selection logic.
- **Responsive Design**: Supports both Grid view (Desktop/Mobile) and Compact view (Horizontal Scroll) for integrated builders.
- **Advanced Filtering**: Filter by Category, Style, Experience Level, and Search queries.
- **RTL Support**: Full support for Right-to-Left languages (Arabic) with correct styling and direction.
- **Favorites & Recent**: Built-in management for favorite templates and recently viewed items using `localStorage`.
- **Performance**: Optimized rendering with `useMemo` and simplified state management.

## 📂 Structure

```
UnifiedTemplatesGallery/
├── index.ts                # Public API export
├── UnifiedTemplatesGallery.tsx # Main Container Component
├── TemplateCard.tsx        # Individual Template Card (Grid & Compact)
├── TemplatePreviewModal.tsx # Detailed Modal with "Use Template" action
├── FilterDropdown.tsx      # Reusable Dropdown for filters
└── Badges.tsx              # reusable UI badges (ATS Score, Category, Level)
```

## 🛠 Usage

### 1. Full Page Gallery (with filters)

```tsx
import UnifiedTemplatesGallery from '@/components/cv/UnifiedTemplatesGallery';

export default function TemplatesPage() {
  return (
    <UnifiedTemplatesGallery 
      isDark={false}
      showFilters={true}
      compact={false}
    />
  );
}
```

### 2. Builder Integration (Compact Mode)

```tsx
import UnifiedTemplatesGallery from '@/components/cv/UnifiedTemplatesGallery';

// Inside your Builder component
<UnifiedTemplatesGallery 
  selectedTemplate={currentTemplateId}
  onTemplateChange={(id) => setTemplate(id)}
  compact={true}        // Enables horizontal scroll layout
  showFilters={false}   // Hides bulky filters
  isDark={isDarkMode}
/>
```

## 📝 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDark` | `boolean` | `false` | Enables Dark Mode styling. |
| `selectedTemplate` | `string` | `undefined` | ID of the currently active template (for highlighting). |
| `onTemplateChange` | `(id: string) => void` | `undefined` | Callback when a template is selected or "Used". |
| `showFilters` | `boolean` | `true` | Show/Hide the search bar and filter dropdowns. |
| `compact` | `boolean` | `false` | If true, renders a horizontal scroll list suitable for sidebars. |

## 🎨 Styling

The component uses **Tailwind CSS** for styling. It relies on the project's consistent design tokens (colors, spacing, shadows).

## 🌍 Internationalization (i18n)

The component uses `useTemplateTranslations` hook to automatically translate:
- UI Labels ("Popular", "Filters", "Use Template")
- Template Categories and Levels
- Dynamic content based on the current locale (ar/en/fr).

## 🚀 Migration Notes

This component replaces:
- `src/components/cv/TemplatesGallery.tsx` (Deleted)
- `src/components/cv/EnhancedTemplatesGallery.tsx` (Deleted)

Ensure all imports are updated to `@/components/cv/UnifiedTemplatesGallery`.
