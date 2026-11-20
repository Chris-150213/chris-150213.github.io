(() => {
  "use strict";
  const palettes = [
    { id: "mist", name: "雾蓝", hue: 216 },
    { id: "sage", name: "鼠尾草", hue: 148 },
    { id: "lilac", name: "丁香", hue: 270 },
    { id: "rose", name: "蔷薇", hue: 344 },
    { id: "apricot", name: "杏桃", hue: 26 },
    { id: "teal", name: "青瓷", hue: 181 },
  ];
  const root = document.documentElement;
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  let saved;
  try {
    saved = localStorage.getItem("bccl-theme");
  } catch {}
  const valid = (value) =>
    /^(light|dark)-(mist|sage|lilac|rose|apricot|teal)$/.test(value || "");
  let current = valid(saved)
    ? saved
    : `${systemDark.matches ? "dark" : "light"}-mist`;
  let manual = valid(saved);
  const apply = (value, persist = false) => {
    if (!valid(value)) return;
    current = value;
    const [mode, id] = value.split("-");
    const palette = palettes.find((item) => item.id === id);
    root.dataset.theme = value;
    root.dataset.mode = mode;
    root.style.setProperty("--hue", palette.hue);
    root.style.colorScheme = mode;
    document
      .querySelectorAll("[data-theme-choice]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.themeChoice === value),
        ),
      );
    document.querySelectorAll("[data-current-theme]").forEach((label) => {
      label.textContent = `${mode === "dark" ? "深色" : "浅色"} · ${palette.name}`;
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.content =
        mode === "dark"
          ? `hsl(${palette.hue} 15% 11%)`
          : `hsl(${palette.hue} 25% 97%)`;
    if (persist) {
      manual = true;
      try {
        localStorage.setItem("bccl-theme", value);
      } catch {}
    }
  };
  apply(current);
  systemDark.addEventListener("change", (event) => {
    if (!manual) apply(`${event.matches ? "dark" : "light"}-mist`);
  });
  document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.querySelector("#theme-dialog");
    const trigger = document.querySelector(".theme-trigger");
    document.querySelectorAll("[data-theme-grid]").forEach((grid) => {
      const mode = grid.dataset.themeGrid;
      palettes.forEach((palette) => {
        const value = `${mode}-${palette.id}`;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "theme-choice";
        button.dataset.themeChoice = value;
        button.style.setProperty("--swatch-hue", palette.hue);
        button.dataset.swatchMode = mode;
        button.setAttribute(
          "aria-label",
          `${mode === "dark" ? "深色" : "浅色"}${palette.name}`,
        );
        button.innerHTML =
          '<span class="theme-swatch" aria-hidden="true"></span><span></span><span class="theme-selected" aria-hidden="true">✓</span>';
        button.children[1].textContent = palette.name;
        button.addEventListener("click", () => apply(value, true));
        grid.append(button);
      });
    });
    apply(current);
    if (trigger && dialog) {
      trigger.addEventListener("click", () => dialog.showModal());
      dialog
        .querySelector(".dialog-close")
        .addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          const rect = dialog.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dialog.close();
        }
      });
    }
  });
})();
