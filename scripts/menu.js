const { log, clear, dir } = console;

/*************************************************************
 * PROGRAMMING - THE CLASS THAT CREATES THE DATA RECORDS
 **************************************************************/

export class MenuItem {
  constructor(data) {
    const { name="", price, stock = 0, description = "", tags = [] } = data;
    // log(arguments);

    // Defensive Checks go here...

    this._id = String(Math.random());
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.description = description;
    this.tags = tags;
  }
  validate() {
    console.log("Validation function");
  }
}

/*************************************************************
 * PROGRAMMING - THE CLASS THAT CREATES APPS THAT CAN CONTROL SETS OF THOSE RECORDS
 **************************************************************/

export default class Menu {
  #items = []; // Now a private field, so you can't tamper with it from outside this class
  constructor(itemsDataArray = []) {
    if (!Array.isArray(itemsDataArray)) {
      throw new Error(`Items must be an array. Received ${itemsDataArray} (${typeof item})`);
    }

    const stored = JSON.parse(localStorage.getItem("items")) || [];
    for (const item of stored) {
      this.#items.push(item);
    }

    for (const itemData of itemsDataArray) {
      this.#items.push(new MenuItem(itemData));
    }
  }

  // GET ALL items
  getAllItems() {
    return this.#items.slice(); // return a copy, so it can't be affected outside
  }
}
