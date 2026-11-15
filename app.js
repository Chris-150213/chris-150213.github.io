(() => {
  "use strict";
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let preference;
  try {
    preference = localStorage.getItem("bccl-motion");
  } catch {
    /* Private browsing may disable storage. */
  }
  let motionEnabled =
    preference === null || preference === undefined
      ? !reduceMotion.matches
      : preference === "on";
  const toast = document.querySelector("#toast");
  let toastTimer;
  const notify = (message) => {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 3500);
  };
  const syncMotion = () => {
    root.classList.toggle("motion-off", !motionEnabled);
    root.classList.toggle("motion-on", motionEnabled);
    document.querySelectorAll(".motion-toggle").forEach((button) => {
      button.setAttribute("aria-pressed", String(motionEnabled));
      const label = motionEnabled ? "关闭动态效果" : "开启动态效果";
      if (button.classList.contains("icon-button")) {
        button.setAttribute("aria-label", label);
        button.title = label;
      }
      const text = button.querySelector(".motion-label");
      if (text)
        text.textContent = `动态效果已${motionEnabled ? "开启" : "关闭"}`;
    });
  };
  document.querySelectorAll(".motion-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      motionEnabled = !motionEnabled;
      preference = motionEnabled ? "on" : "off";
      try {
        localStorage.setItem("bccl-motion", preference);
      } catch {
        /* Keep the current session preference. */
      }
      syncMotion();
    }),
  );
  reduceMotion.addEventListener("change", () => {
    if (preference === null || preference === undefined) {
      motionEnabled = !reduceMotion.matches;
      syncMotion();
    }
  });
  syncMotion();

  // Only two small clouds move continuously. Pause them when offscreen or hidden.
  const syncVisibility = () =>
    root.classList.toggle("page-hidden", document.hidden);
  document.addEventListener("visibilitychange", syncVisibility);
  syncVisibility();
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((item) => revealObserver.observe(item));
    root.classList.add("js");
    new IntersectionObserver(([entry]) =>
      root.classList.toggle("hero-outside", !entry.isIntersecting),
    ).observe(document.querySelector(".hero"));
  }

  const menu = document.querySelector("#mobile-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenu = () => {
    menu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开导航");
  };
  menuToggle.addEventListener("click", () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuToggle.setAttribute("aria-expanded", String(opening));
    menuToggle.setAttribute("aria-label", opening ? "关闭导航" : "打开导航");
  });
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!menu.hidden && !event.target.closest(".site-header")) closeMenu();
  });
  matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const preview = document.querySelector(".preview-stage");
  const sideItems = [...document.querySelectorAll(".sidebar-item")];
  const selectTab = (tab) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !selected;
    });
    const view = tab.id.replace("tab-", "");
    preview.dataset.preview = view;
    sideItems.forEach((item, index) =>
      item.classList.toggle(
        "active",
        index === { launch: 0, multiplayer: 2, theme: 3 }[view],
      ),
    );
    if (motionEnabled && preview.animate) {
      preview
        .querySelectorAll(".mock-view")
        .forEach((item) =>
          item.getAnimations().forEach((animation) => animation.cancel()),
        );
      preview.querySelector(`.mock-${view}`).animate(
        [
          { opacity: 0.3, transform: "translateY(5px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 240, easing: "ease-out" },
      );
    }
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });

  // Preserve native details semantics and no-JS support; animate only user toggles.
  document.querySelectorAll("details").forEach((details) => {
    const summary = details.querySelector("summary");
    const content = details.querySelector(".accordion-content");
    let animation = null;
    let intendedOpen = details.open;
    summary.addEventListener("click", (event) => {
      if (!content.animate || !motionEnabled) return;
      event.preventDefault();
      const from = details.open ? content.getBoundingClientRect().height : 0;
      if (animation) {
        animation.cancel();
        animation = null;
      }
      intendedOpen = !intendedOpen;
      details.open = true;
      const to = intendedOpen ? content.scrollHeight : 0;
      animation = content.animate(
        [
          { height: `${from}px`, opacity: from === 0 ? 0 : 1 },
          { height: `${to}px`, opacity: intendedOpen ? 1 : 0 },
        ],
        { duration: 240, easing: "cubic-bezier(.2,.7,.3,1)" },
      );
      animation.onfinish = () => {
        details.open = intendedOpen;
        animation = null;
      };
    });
    details.addEventListener("toggle", () => {
      if (!animation) intendedOpen = details.open;
    });
  });

  document
    .querySelector("#copy-hash")
    .addEventListener("click", async (event) => {
      const hash = event.currentTarget.dataset.hash;
      try {
        if (!navigator.clipboard) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(hash);
        notify("SHA-256 已复制，可用于核对下载文件。");
      } catch {
        const details = document.querySelector(".release-details");
        details.open = true;
        const range = document.createRange();
        range.selectNodeContents(document.querySelector(".file-hash"));
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        notify("请在展开的文件信息中手动复制 SHA-256。");
      }
    });
  document.querySelector("#year").textContent = String(
    new Date().getFullYear(),
  );
})();
