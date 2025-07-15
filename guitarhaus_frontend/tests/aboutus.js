import { expect, test } from '@playwright/test';

test.describe('About Us Page Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/about-us'); // Adjust based on your routing
  });

  // 1. Verify page loads successfully
  test('should load About Us page', async ({ page }) => {
    await expect(page).toHaveTitle(/About Us/i);
  });

  // 2. Check if the Navbar is visible
  test('should display the Navbar', async ({ page }) => {
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  // 3. Verify "About Us" heading exists
  test('should display the About Us heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toHaveText('About Us');
  });

  // 4. Check if the introductory paragraph is displayed
  test('should display introduction text', async ({ page }) => {
    const introText = page.locator('p:text("Discover the beauty of Nepal")');
    await expect(introText).toBeVisible();
  });

  // 5. Verify the presence of an image
  test('should display the trek image', async ({ page }) => {
    const image = page.locator('img[alt="Trek in Nepal"]');
    await expect(image).toBeVisible();
    expect(await image.getAttribute('src')).toBe('/src/assets/images/about.jpg');
  });

  // 6. Check if "Why Choose Us?" section is visible
  test('should display the Why Choose Us section', async ({ page }) => {
    const whyChooseUs = page.locator('h2:text("Why Choose Us?")');
    await expect(whyChooseUs).toBeVisible();
  });

  // 7. Verify the list items under "Why Choose Us?"
  test('should display key benefits list', async ({ page }) => {
    const listItems = page.locator('ul > li');
    await expect(listItems).toHaveCount(4);
  });

  // 8. Check if the "Our Mission" section is visible
  test('should display Our Mission section', async ({ page }) => {
    const missionHeading = page.locator('h2');
    await expect(missionHeading).toHaveText('Our Mission');
  });

  // 9. Verify mission statement text exists
  test('should display the mission text', async ({ page }) => {
    const missionText = page.locator('p:text("Our goal is to provide trekkers with authentic")');
    await expect(missionText).toBeVisible();
  });

  // 10. Ensure the Footer is present
  test('should display the Footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  // 11. Test Navbar navigation (click on Home)
  test('should navigate to Home when clicking Navbar link', async ({ page }) => {
    await page.click('a:text("Home")');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  // 12. Test Navbar navigation (click on Bookings)
  test('should navigate to Bookings when clicking Navbar link', async ({ page }) => {
    await page.click('a:text("Bookings")');
    await expect(page).toHaveURL('http://localhost:3000/bookings');
  });

  // 13. Test responsiveness by resizing viewport
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const heading = page.locator('h1:text("About Us")');
    await expect(heading).toBeVisible();
  });

  // 14. Ensure content doesn't break on large screens
  test('should be responsive on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const heading = page.locator('h1:text("About Us")');
    await expect(heading).toBeVisible();
  });

  // 15. Check if any broken images exist
  test('should not have broken images', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('src', /.+/);
    }
  });

  // 16. Ensure all links are working
  test('should have working links', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toBeNull();
    }
  });

});