import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { categories, bccl, launchers } from "../comparison-data.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const pages = ["index.html", "compare.html"];
let totalIds = 0;
for (const page of pages) {
  const html = await readFile(resolve(root, page), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: IDs must be unique`);
  totalIds += ids.length;
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (ref.startsWith("#"))
      assert(ids.includes(ref.slice(1)), `${page}: missing ${ref}`);
    else if (ref.startsWith("./")) {
      const [path, anchor] = ref.split("#");
      await access(resolve(root, path));
      if (anchor) {
        const target = await readFile(resolve(root, path), "utf8");
        assert(
          target.includes(`id="${anchor}"`),
          `${page}: missing target ${ref}`,
        );
      }
    } else
      assert(
        ref.startsWith("https://"),
        `${page}: asset must use a relative path: ${ref}`,
      );
  }
  for (const [, refs] of html.matchAll(
    /aria-(?:controls|labelledby)="([^"]+)"/g,
  )) {
    refs
      .split(" ")
      .forEach((id) =>
        assert(ids.includes(id), `${page}: missing ARIA target ${id}`),
      );
  }
  assert(
    html.includes('href="./assets/icon.ico"'),
    `${page}: original icon must be used`,
  );
  assert(
    !/<iframe|<canvas|<video/.test(html),
    `${page}: avoid heavy background renderers`,
  );
  assert(
    !/帆船|启航|航行|船只/.test(html),
    `${page}: remove nautical imagery and copy`,
  );
}
const html = await readFile(resolve(root, "index.html"), "utf8");
const codeFiles = [
  "index.html",
  "compare.html",
  "styles.css",
  "app.js",
  "themes.js",
  "compare.js",
  "comparison-data.js",
];
const source = (
  await Promise.all(
    codeFiles.map((file) => readFile(resolve(root, file), "utf8")),
  )
).join("\n");
assert(
  !/\b[A-Za-z]:[\\/]|file:\/\//.test(source),
  "No absolute filesystem paths",
);
assert(source.includes("prefers-reduced-motion"), "Respect reduced motion");
assert(
  source.includes("visibilitychange") &&
    source.includes("IntersectionObserver"),
  "Pause offscreen animation",
);
assert(
  !/requestAnimationFrame|setInterval/.test(source),
  "No continuous JS animation loop",
);
const links = [...html.matchAll(/href="([^"]+\.exe)"/g)].map(
  (match) => match[1],
);
assert(
  links.length >= 3 && new Set(links).size === 1,
  "Header, hero and section must download the same file",
);
assert.equal(categories.length, 4);
assert.equal(Object.keys(launchers).length, 3);
assert.equal(
  Object.values(bccl.sections).flatMap((section) => section.cons || []).length,
  2,
  "Keep BCCL tradeoffs to two",
);
for (const product of [bccl, ...Object.values(launchers)]) {
  for (const category of categories) {
    assert(
      product.sections[category.id]?.pros.length,
      `${product.name}: missing ${category.id}`,
    );
  }
}
const themes = await readFile(resolve(root, "themes.js"), "utf8");
assert.equal(
  [...themes.matchAll(/id: "(?:mist|sage|lilac|rose|apricot|teal)"/g)].length,
  6,
  "Six palettes, each with light and dark variants",
);
console.log(
  `PASS: 2 pages, ${totalIds} unique IDs, local assets, anchors, ARIA, 12 themes, 3 opponents × 4 categories, two BCCL tradeoffs, downloads and animation lifecycle.`,
);
