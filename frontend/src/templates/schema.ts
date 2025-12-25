import { z } from "zod";

export const BlockSchema = z.object({
    type: z.string(),
    position: z.enum(["top", "main", "sidebar", "footer"]).optional(),
    settings: z.record(z.string(), z.any()).optional().default({}),
});

const PaletteSchema = z.object({
    primary: z.string(),
    accent: z.string(),
    text: z.string(),
    muted: z.string(),
    background: z.string().default("#ffffff"),
});

const TypographySchema = z.object({
    heading: z.string().default("Inter"),
    body: z.string().default("Inter"),
    ui: z.string().optional(),
});

export const TemplateSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    thumbnail: z.string(),
    category: z.string().optional(), // Added for template categorization
    metadata: z.object({
        layout: z.enum(["one-column", "two-column", "sidebar"]),
        version: z.string().optional(),
        baseFontSize: z.number().default(14),
    }),
    typography: TypographySchema.optional(), // Make optional for backward compatibility or defaults
    palette: PaletteSchema,
    variants: z.record(z.string(),
        z.object({
            name: z.string(),
            palette: PaletteSchema.partial(),
            typography: TypographySchema.partial().optional(),
        })
    ).optional(),
    spacing: z.object({
        sectionGap: z.number().default(24),
        itemGap: z.number().default(8),
    }).default({
        sectionGap: 24,
        itemGap: 8
    }),
    blocks: z.array(BlockSchema),
});
