import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';

test('successful login', async ({ page }) => {
  const { SAUCE_USERNAME: username, SAUCE_PASSWORD: password } = process.env;

  if (!username || !password) {
    throw new Error(
      'Missing SAUCE_USERNAME or SAUCE_PASSWORD. Copy .env.example to .env and set both values.'
    );
  }

  const loginpage = new LoginPage(page);
  await loginpage.goto();
  await loginpage.login(username, password);

  // A successful Sauce Demo login redirects the user to the inventory page.
  const inventoryPage = new InventoryPage(page);
  await expect(page).toHaveURL(inventoryPage.url);
  await expect(inventoryPage.title).toHaveText('Products');
});
