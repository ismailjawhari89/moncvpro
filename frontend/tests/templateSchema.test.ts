import { describe, it, expect } from 'vitest';
import { TemplateSchema } from '../src/templates/schema';
import modern from '../src/templates/definitions/modern.json';

describe('Template Schema Validation', () => {
    it('should validate the modern template JSON correctly', () => {
        const result = TemplateSchema.safeParse(modern);
        if (!result.success) {
            console.error(result.error);
        }
        expect(result.success).toBe(true);
    });

    it('should reject invalid template without ID', () => {
        const invalid = { ...modern, id: undefined };
        const result = TemplateSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('should validate blocks structure', () => {
        const result = TemplateSchema.safeParse(modern);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.blocks.length).toBeGreaterThan(0);
            expect(result.data.blocks[0].type).toBeDefined();
        }
    });
});
