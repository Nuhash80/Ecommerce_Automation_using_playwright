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

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  await loginPage.goto();
  await loginPage.login(username, password);

  // A successful Sauce Demo login redirects the user to the inventory page.
  await inventoryPage.confirmLoaded();
});

test('unsuccessful login displays an error message', async ({ page }) => {
  
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'incorrect_password');

  await expect(loginPage.errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
  await expect(page).toHaveURL(loginPage.url);
});
