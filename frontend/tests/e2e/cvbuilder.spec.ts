// E2E Test for CV Builder - Live Preview and Template Application
// Run with: npx playwright test tests/e2e/cvbuilder.spec.ts

import { test, expect } from '@playwright/test';

test.describe('CV Builder - Core Functionality', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to CV Builder
        await page.goto('/en/cv-builder');
        await page.waitForLoadState('networkidle');
    });

    test('should display blank form with placeholders on initial load', async ({ page }) => {
        // Verify page loaded
        await expect(page.locator('h1')).toContainText('CV Builder');

        // Verify preview shows placeholder text
        const preview = page.locator('#cv-preview-content');
        await expect(preview).toContainText('Your Name');
        await expect(preview).toContainText('Professional Title');

        // Verify no console errors
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/01_initial_state.png' });

        // Assert no "Cannot read properties of undefined" errors
        expect(errors.filter(e => e.includes('Cannot read properties of undefined'))).toHaveLength(0);
    });

    test('should update Live Preview when typing in Full Name', async ({ page }) => {
        // Find the Full Name input
        const fullNameInput = page.locator('input[placeholder*="Full Name"], input[placeholder*="name"]').first();

        // Clear and type
        await fullNameInput.fill('Fatima Zahra');

        // Wait for preview update (debounce)
        await page.waitForTimeout(300);

        // Verify preview shows the typed name
        const preview = page.locator('#cv-preview-content');
        await expect(preview).toContainText('Fatima Zahra');

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/02_after_name_input.png' });
    });

    test('should navigate to Templates section', async ({ page }) => {
        // Click on Templates section button
        await page.click('button:has-text("Templates")');

        // Verify Templates Gallery is visible
        await expect(page.locator('h3:has-text("Templates")')).toBeVisible();

        // Verify template cards are shown
        await expect(page.locator('text=Modern - Software Engineer')).toBeVisible();
        await expect(page.locator('text=Classic - Business Manager')).toBeVisible();
        await expect(page.locator('text=Creative - Marketing Manager')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/03_templates_section.png' });
    });

    test('should apply template and update preview', async ({ page }) => {
        // Navigate to Templates section
        await page.click('button:has-text("Templates")');
        await page.waitForTimeout(500);

        // Click on the first template (Modern - Software Engineer)
        await page.click('button:has-text("Modern - Software Engineer")');

        // Wait for template application
        await page.waitForTimeout(1000);

        // Verify preview shows template data
        const preview = page.locator('#cv-preview-content');
        await expect(preview).toContainText('Ahmed Ben Ali');
        await expect(preview).toContainText('Senior Full Stack Developer');
        await expect(preview).toContainText('TechCorp Morocco');

        // Verify skills are populated
        await expect(preview).toContainText('React');
        await expect(preview).toContainText('Node.js');

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/04_after_template_apply.png' });
    });

    test('should reset form to blank state', async ({ page }) => {
        // First apply a template
        await page.click('button:has-text("Templates")');
        await page.waitForTimeout(500);
        await page.click('button:has-text("Modern - Software Engineer")');
        await page.waitForTimeout(1000);

        // Click reset button
        page.on('dialog', dialog => dialog.accept()); // Accept confirmation
        await page.click('button[title="Reset to blank form"]');

        // Wait for reset
        await page.waitForTimeout(500);

        // Verify preview shows placeholders again
        const preview = page.locator('#cv-preview-content');
        await expect(preview).toContainText('Your Name');
        await expect(preview).toContainText('Professional Title');

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/05_after_reset.png' });
    });

    test('should toggle dark mode', async ({ page }) => {
        // Click theme toggle button
        await page.click('button:has(svg.text-gray-700), button:has(svg.lucide-moon)');

        // Verify dark mode is applied (background changes)
        const mainDiv = page.locator('div.min-h-screen').first();
        await expect(mainDiv).toHaveClass(/bg-gray-900/);

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/06_dark_mode.png' });

        // Toggle back to light mode
        await page.click('button:has(svg.text-yellow-400), button:has(svg.lucide-sun)');
        await expect(mainDiv).toHaveClass(/bg-gray-50/);
    });

    test('should export CV options are available', async ({ page }) => {
        // Click export button
        await page.click('button:has-text("Exporter"), button:has-text("Export")');

        // Verify export options are visible
        await expect(page.locator('text=PDF')).toBeVisible();
        await expect(page.locator('text=Word')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/07_export_options.png' });
    });

    test('full flow: load, input, template, verify preview', async ({ page }) => {
        // Step 1: Verify initial blank state
        const preview = page.locator('#cv-preview-content');
        await expect(preview).toContainText('Your Name');

        // Step 2: Type name
        const fullNameInput = page.locator('input').first();
        await fullNameInput.fill('Fatima Zahra');
        await page.waitForTimeout(300);
        await expect(preview).toContainText('Fatima Zahra');

        // Step 3: Open Templates
        await page.click('button:has-text("Templates")');
        await page.waitForTimeout(500);

        // Step 4: Apply Marketing Manager template
        await page.click('button:has-text("Marketing Manager")');
        await page.waitForTimeout(1000);

        // Step 5: Verify template data in preview
        await expect(preview).toContainText('Digital Marketing Manager');
        await expect(preview).toContainText('BrandBoost Agency');
        await expect(preview).toContainText('SEO/SEM');

        // Step 6: No console errors
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error' && !msg.text().includes('favicon')) {
                errors.push(msg.text());
            }
        });

        expect(errors.filter(e => e.includes('Cannot read properties of undefined'))).toHaveLength(0);

        // Take final screenshot
        await page.screenshot({ path: 'tests/e2e/screenshots/e2e_cvbuilder_flow.png' });
    });

});
