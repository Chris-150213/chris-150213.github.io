import { categories, bccl, launchers } from "./comparison-data.js";
const selector = document.querySelector("#launcher-select");
const tabs = [...document.querySelectorAll("[data-category]")];
let category = "install";
const makeList = (items, type) => {
  const block = document.createElement("div");
  block.className = `comparison-list ${type}`;
  const title = document.createElement("h3");
  title.textContent = type === "pros" ? "优势" : "需要考虑";
  const list = document.createElement("ul");
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.append(li);
  });
  block.append(title, list);
  return block;
};
const fillCard = (card, product) => {
  const section = product.sections[category];
  card.querySelector(".comparison-name").textContent = product.name;
  card.querySelector(".comparison-subtitle").textContent = product.subtitle;
  const initial = card.querySelector(".product-initial");
  if (initial) initial.textContent = product.initial;
  const content = card.querySelector(".comparison-content");
  content.replaceChildren();
  const title = document.createElement("h2");
  title.textContent = section.title;
  content.append(title, makeList(section.pros, "pros"));
  if (section.cons?.length) content.append(makeList(section.cons, "cons"));
  const source = card.querySelector(".comparison-source");
  source.href = section.source || product.source;
  source.textContent = `${product.name} 官方资料`;
};
const render = () => {
  const selected = launchers[selector.value] || launchers.pcl;
  fillCard(document.querySelector("#bccl-card"), bccl);
  fillCard(document.querySelector("#other-card"), selected);
  tabs.forEach((tab) => {
    const active = tab.dataset.category === category;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  const info = categories.find((item) => item.id === category);
  document.querySelector("#category-description").textContent =
    info.description;
  document
    .querySelector("#comparison-board")
    .setAttribute("aria-labelledby", `category-${category}`);
  document.querySelector("#comparison-status").textContent =
    `正在对比 BCCL 与 ${selected.name}：${info.name}`;
  const url = new URL(location.href);
  url.searchParams.set("launcher", selector.value);
  url.searchParams.set("category", category);
  history.replaceState(null, "", url);
};
const query = new URLSearchParams(location.search);
if (Object.hasOwn(launchers, query.get("launcher")))
  selector.value = query.get("launcher");
if (categories.some((item) => item.id === query.get("category")))
  category = query.get("category");
selector.addEventListener("change", render);
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    category = tab.dataset.category;
    render();
  });
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    category = tabs[next].dataset.category;
    render();
    tabs[next].focus();
  });
});
render();
