import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';

const sortCases = [
  {
    name: 'sorts products by name A to Z',
    option: 'az',
    values: (inventoryPage) => inventoryPage.getProductNames(),
    sort: (values) => [...values].sort((a, b) => a.localeCompare(b)),
  },
  {
    name: 'sorts products by name Z to A',
    option: 'za',
    values: (inventoryPage) => inventoryPage.getProductNames(),
    sort: (values) => [...values].sort((a, b) => b.localeCompare(a)),
  },
  {
    name: 'sorts products by price low to high',
    option: 'lohi',
    values: (inventoryPage) => inventoryPage.getProductPrices(),
    sort: (values) => [...values].sort((a, b) => a - b),
  },
  {
    name: 'sorts products by price high to low',
    option: 'hilo',
    values: (inventoryPage) => inventoryPage.getProductPrices(),
    sort: (values) => [...values].sort((a, b) => b - a),
  },
];

test.describe('product sorting', () => {
  test.beforeEach(async ({ page }) => {
    const { SAUCE_USERNAME: username, SAUCE_PASSWORD: password } = process.env;

    if (!username || !password) {
      throw new Error(
        'Missing SAUCE_USERNAME or SAUCE_PASSWORD. Copy .env.example to .env and set both values.'
      );
    }

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
  });

  for (const sortCase of sortCases) {
    test(sortCase.name, async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.confirmLoaded();

      const initialCount = await inventoryPage.inventoryItems.count();
      await inventoryPage.sortBy(sortCase.option);

      const actualValues = await sortCase.values(inventoryPage);
      expect(actualValues).toEqual(sortCase.sort(actualValues));
      expect(actualValues).toHaveLength(initialCount);
    });
  }
});
