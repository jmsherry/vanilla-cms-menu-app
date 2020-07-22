import AdminMenu from "./admin-menu.js";

// const basicItemData = [
//   {
//     name: "Spag Bol",
//     price: 300,
//   },
//   {
//     name: "Pizza",
//     price: 400,
//   },
//   {
//     name: "Pasta Marinara",
//     price: 350,
//   },
//   {
//     name: "Calzone",
//     price: 500,
//   },
// ];
const menu = new AdminMenu();

const clearButton = document.getElementById("clearData");

if (clearButton) {
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    // localStorage.removeItem("items");
    menu.removeAllItems();
    render();
  });
}

const mountNode = document.getElementById("menu");

function render() {
  console.log("rendering");
  const menuItems = menu.getAllItems();
  const frag = document.createDocumentFragment();
  for (const item of menuItems) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
    <span class="name">${item.name}</span><span class="price">£${Number(
      item.price
    ).toLocaleString("en-gb", {
      minimumFractionDigits: 2,
    })}</span>
    <div class="controls">
      <a href="/admin/update-item.html?id=${
        item._id
      }" class="btn btn-warning"><span class="sr-only">Edit</span><i class="far fa-edit"></i></a>
      <button class="btn btn-danger delete" data-id="${
        item._id
      }"><span class="sr-only">Delete</span><i class="far fa-trash-alt"></i></button>
    </div>`;
    frag.append(li);
  }
  mountNode.innerHTML = "";
  mountNode.append(frag);
}

if (mountNode) {
  render();

  mountNode.addEventListener("click", (e) => {
    const { target } = e;
    if (
      (target && target.matches("button.delete")) ||
      target.closest("button").matches("button.delete")
    ) {
      console.log("delete");
      const id = target.closest("button.delete").dataset.id;
      console.log(`id for deletion: ${id}`);
      menu.removeItem(id);
      target.closest("li").remove();
    }
  });
}

const addForm = document.forms["add-form"];
console.log("addForm", addForm);
if (addForm) {
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(addForm));
    console.log("add data", data);
    menu.addItem(data);
    addForm.reset();
  });
}

const updateForm = document.forms["update-form"];
console.log("updateForm", updateForm);
if (updateForm) {
  // Get id and populate form
  var params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const itemToUpdate = menu.getItemById(id);
  populate(updateForm, itemToUpdate);

  // handle submit
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(updateForm));
    data._id = id;
    console.log("update data", data, id);
    menu.updateItem(data);
    updateForm.reset();
    location.href = "/admin/index.html";
  });
}

/*************************************************************
 * UTILITIES
 **************************************************************/

/**
 * Populate form fields from a JSON object.
 *
 * @param form object The form element containing your input fields.
 * @param data object that has the data in
 */

function populate(form, data) {
  // walk the object
  for (const key in data) {
    // if this is a system property then bail...
    if (!data.hasOwnProperty(key)) {
      continue;
    }

    // get key/value for inputs
    let name = key;
    let value = data[key];

    // Make any bad values an empty string
    if (!value && value !== 0) {
      value = "";
    }

    // try to find element in the form
    const element = form.elements[name];

    // If we can't then bail
    if (!element) {
      continue;
    }

    // see what type an element is to handle the process differently
    const type = element.type || element[0].type;

    switch (type) {
      case "checkbox": {
        // Here, value is an array of values to be spread across the checkboxes that make up this input. It's the value of the input as a whole, NOT the value of one checkbox.
        const values = Array.isArray(value) ? value : [value];

        for (let j = 0, len = element.length; j < len; j += 1) {
          const thisCheckbox = element[j];
          if (values.includes(thisCheckbox.value)) {
            thisCheckbox.checked = true;
          }
        }
        break;
      }
      case "select-multiple": {
        const values = Array.isArray(value) ? value : [value];

        for (let k = 0, len = element.options.length; k < len; k += 1) {
          const thisOption = element.options[k];
          if (values.includes(thisOption.value)) {
            thisOption.selected = true;
          }
        }
        break;
      }
      // case "select":
      // case "select-one":
      //   element.value = value.toString() || value;
      //   break;

      // case "date":
      //   element.value = new Date(value).toISOString().split("T")[0];
      //   break;

      // text boxes
      default:
        element.value = value;
        break;
    }
  }
}
