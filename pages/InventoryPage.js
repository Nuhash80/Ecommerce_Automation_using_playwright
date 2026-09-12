// @ts-check
import { expect } from '@playwright/test';

export class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async confirmLoaded() {
    //await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html')
    await expect(this.title).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * @param {'az' | 'za' | 'lohi' | 'hilo'} option
   */
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
    await expect(this.sortDropdown).toHaveValue(option);
  }

  async getProductNames() {
    return this.itemNames.allTextContents();
  }

  async getProductPrices() {
    const prices = await this.itemPrices.allTextContents();
    return prices.map((price) => Number.parseFloat(price.replace('$', '')));
  }
}
