import Menu from "./menu.js";

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

const menu = new Menu();

const mountNode = document.getElementById("menu");
const countNode = document.getElementById("count");

function render() {
  const menuItems = menu.getAllItems();
  const frag = document.createDocumentFragment();
  for (const item of menuItems) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
    <span class="name">${item.name}</span><span class="price">£${Number(
      item.price
    ).toLocaleString('en-gb', {
      minimumFractionDigits: 2,
    })}</span>`;
    frag.append(li);
  }
  mountNode.innerHTML = "";
  mountNode.append(frag);
  countNode.textContent = menuItems.length;
}
render();
