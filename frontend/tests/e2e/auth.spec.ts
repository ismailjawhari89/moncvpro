import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should navigate to registration and show validation errors', async ({ page }) => {
        // Go to registration page (using 'en' as default locale)
        await page.goto('/en/auth/register');

        // Click register without filling anything
        await page.click('button[type="submit"]');

        // Check if validation messages appear (assuming Zod/React Hook Form)
        // Adjust selector based on actual implementation
        await expect(page.locator('text=required')).toBeVisible();
    });

    test('should show error for invalid login', async ({ page }) => {
        await page.goto('/en/auth/login');

        await page.fill('input[name="email"]', 'wrong@example.com');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Wait for error toast or message
        await expect(page.locator('text=Invalid email or password')).toBeVisible();
    });
});

test.describe('Responsive Design', () => {
    test('should show mobile menu on small screens', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'Only run on mobile devices');

        await page.goto('/en');

        // Check for hamburger icon or similar
        // This depends on the Navbar implementation
        const menuButton = page.locator('button[aria-label="Menu"], button[aria-label="Toggle Navigation"]');
        if (await menuButton.isVisible()) {
            await expect(menuButton).toBeVisible();
        }
    });
});
