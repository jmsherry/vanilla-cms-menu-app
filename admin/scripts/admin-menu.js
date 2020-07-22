import { MenuItem } from "./../../scripts/menu.js";

const { log, clear, dir } = console;

export default class AdminMenu {
  #items = []; // Now a private field, so you can't tamper with it from outside this class
  constructor(itemsDataArray = []) {
    if (!Array.isArray(itemsDataArray)) {
      throw new Error(`Items must be an array. Received ${itemsDataArray}`);
    }

    const stored = JSON.parse(localStorage.getItem("items")) || [];
    for (const item of stored) {
      this.#items.push(item);
    }

    for (const itemData of itemsDataArray) {
      this.#items.push(new MenuItem(itemData));
    }
  }

  getAllItems() {
    return this.#items.slice(); // return a copy, so it can't be affected outside
  }

  removeAllItems() {
    this.#items.length = 0;
    this.save();
  }

  // GET a item record's index (by id)
  getItemIndex(id) {
    if (!id) {
      throw new Error(`An id must be provided to getItemIndex`);
    }
    if (typeof id !== "string") {
      throw new Error(
        `The id provided to getItemIndex must be a string. Received ${id}(${typeof id})`
      );
    }
    const index = this.#items.findIndex((item) => {
      return item._id === id;
    });

    if (!~index) {
      log(`Item with _id of ${id} not found`);
    }
    return index;
  }

  // GET a item by id
  getItemById(id) {
    const index = this.getItemIndex(id);
    if (!~index) {
      return null;
    }
    const targetItem = this.#items[index];
    return { ...targetItem }; // return a copy, so it can't be affected outside
  }

  addItem(itemData) {
    // Check if data provided
    if (!itemData) {
      throw new Error(`No data provided to addItem: received ${itemData}`);
    }

    // Create a new item
    const newItem = new MenuItem(itemData);

    // push it into our internal array
    this.#items.push(newItem);

    this.save();

    // Return the finished product for reference
    return { ...newItem };
  }

  updateItem(updates = {}) {
    // Check id is correct
    const { _id: id } = updates;
    if (!id) {
      throw new Error(
        "An id of the item you want to change must be provided to updateItem"
      );
    }
    if (typeof id !== "string") {
      throw new Error(`id must be a string. Received ${id}(${typeof id})`);
    }

    // Get old item
    const targetItemIndex = this.getItemIndex(id);
    const targetItem = this.#items[targetItemIndex];

    // Notify if not found (This should not happen, hence the error rather than just returning...)
    if (!targetItem) {
      throw new Error(`Item not found`);
    }

    // Create a new Item to validate
    const updatedItem = new MenuItem({
      ...targetItem,
      ...updates,
    });

    // Remove the old and insert the new
    this.#items.splice(targetItemIndex, 1, updatedItem);
    this.save();
    return { ...updatedItem }; // before returning the new item
  }

  // DELETE item
  removeItem(id) {
    if (!id) {
      throw new Error(`No id provided to removeItem: received ${id}`);
    }
    const index = this.getItemIndex(id);
    if (!~index) {
      return null; // throw err
    }
    const deleted = this.#items.splice(index, 1);
    this.save();
    return deleted;
  }

  save() {
    localStorage.setItem("items", JSON.stringify(this.#items));
  }
}
