import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const html = await readFile(resolve(root, "index.html"), "utf8");
const css = await readFile(resolve(root, "styles.css"), "utf8");
const js = await readFile(resolve(root, "app.js"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "HTML IDs must be unique");
for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (ref.startsWith("#"))
    assert(ids.includes(ref.slice(1)), `Missing anchor: ${ref}`);
  else if (ref.startsWith("./")) await access(resolve(root, ref));
  else
    assert(ref.startsWith("https://"), `Asset path must be relative: ${ref}`);
}
for (const [, ref] of html.matchAll(
  /aria-(?:controls|labelledby)="([^"]+)"/g,
)) {
  ref
    .split(" ")
    .forEach((id) => assert(ids.includes(id), `Missing ARIA target: ${id}`));
}
assert(
  !/\b[A-Za-z]:[\\/]|file:\/\//.test(html + css + js),
  "Do not include absolute filesystem paths",
);
assert(html.includes('href="./assets/icon.ico"'), "Original ICO must be used");
assert(
  html.includes("prefers-reduced-motion") ||
    css.includes("prefers-reduced-motion"),
  "Respect reduced motion",
);
assert(
  js.includes("visibilitychange") && js.includes("IntersectionObserver"),
  "Pause offscreen background animation",
);
const downloadLinks = [...html.matchAll(/href="([^"]+\.exe)"/g)].map(
  (match) => match[1],
);
assert(
  downloadLinks.length >= 3,
  "Downloads must appear in header, hero and download section",
);
assert.equal(
  new Set(downloadLinks).size,
  1,
  "All download links must use the same release asset",
);
assert(
  !/<iframe|<canvas|<video/.test(html),
  "Avoid expensive background renderers",
);
assert(
  !/requestAnimationFrame|setInterval/.test(js),
  "No continuous JavaScript animation loop",
);
console.log(
  `PASS: ${ids.length} unique IDs, local assets, anchors, ARIA, download links, relative paths, reduced motion and animation lifecycle.`,
);
