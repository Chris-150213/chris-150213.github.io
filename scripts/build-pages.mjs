import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { appendFile, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const downloadName = "BoatChrisCraftLauncher-windowsx64.exe";
const siteRepo = "Chris-150213/chris-150213.github.io";
const sourceRepos = [siteRepo, "123ugbu1312u/Boat-Chris-Craft-Launcher"];
const website = "https://bccl.dpdns.org";
const tags = /^v?(\d+\.\d+(?:\.\d+){0,2})(?:-(alpha|beta|rc|preview)(?:[.-](\d+))?)?$/i;
const supportedNames = [
  /^BoatChrisCraftLauncher-windowsx64\.exe$/i,
  /^Boat[. _-]?Chris[. _-]?Craft[. _-]?Launcher\.exe$/i,
  /^BCCL-[\w.-]+-windows-x64\.exe$/i,
];

async function fetchReleases(repo) {
  const headers = { Accept: "application/vnd.github+json" };
  if (repo === siteRepo && process.env.GH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  }
  const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
    headers,
    signal: AbortSignal.timeout(30_000),
  });
  assert(response.ok, `Failed to list releases for ${repo}: ${response.status}`);
  const releases = await response.json();
  return releases.map(release => {
    const tag = tags.exec(release.tag_name);
    if (release.draft || !release.published_at || !tag) return null;
    const asset = supportedNames
      .map(pattern => release.assets.find(file => file.state === "uploaded" && pattern.test(file.name)))
      .find(Boolean);
    if (!asset) return null;
    return { repo, release, asset, tag };
  }).filter(Boolean);
}

function readRuntime(exe) {
  assert(exe.toString("ascii", 0, 2) === "MZ", "Release is not a Windows executable");
  const pe = exe.readUInt32LE(0x3c);
  assert(exe.readUInt32LE(pe) === 0x4550 && exe.readUInt16LE(pe + 4) === 0x8664, "Release is not Windows x64");

  // .NET apphost marker follows the manifest offset. The manifest records the
  // uncompressed runtimeconfig.json offset and length after the bundle ID.
  const marker = exe.indexOf(Buffer.from("8b1202b96a612038727b930214d7a03213f5b9e6efae3318ee3b2dce24b36aae", "hex"));
  assert(marker >= 8, "Missing .NET bundle header");
  const manifest = Number(exe.readBigUInt64LE(marker - 8));
  assert(manifest > marker && manifest + 13 < exe.length && exe.readUInt32LE(manifest) >= 2, "Invalid .NET bundle manifest");
  let cursor = manifest + 12;
  let idLength = 0;
  for (let shift = 0; ; shift += 7) {
    assert(shift < 35 && cursor < exe.length, "Invalid .NET bundle ID");
    const byte = exe[cursor++];
    idLength += (byte & 0x7f) * 2 ** shift;
    if (!(byte & 0x80)) break;
  }
  cursor += idLength;
  const start = Number(exe.readBigUInt64LE(cursor + 16));
  const size = Number(exe.readBigUInt64LE(cursor + 24));
  assert(start > 0 && size > 0 && start + size <= manifest, "Missing embedded runtime configuration");
  const frameworks = JSON.parse(exe.toString("utf8", start, start + size)).runtimeOptions.includedFrameworks;
  const core = frameworks?.find(item => item.name === "Microsoft.NETCore.App")?.version;
  const desktop = frameworks?.find(item => item.name === "Microsoft.WindowsDesktop.App")?.version;
  assert([core, desktop].every(version => /^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version || "")), "Unable to identify bundled .NET Desktop Runtime");
  return { core, desktop };
}

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const releases = (await Promise.all(sourceRepos.map(fetchReleases))).flat();
releases.sort((a, b) => Date.parse(b.release.published_at) - Date.parse(a.release.published_at));
const selected = releases[0];
assert(selected, "No published BCCL Windows x64 release found");
const { repo, release, asset, tag } = selected;
const digest = /^sha256:([0-9a-f]{64})$/i.exec(asset.digest || "")?.[1]?.toLowerCase();
assert(digest && Number.isSafeInteger(asset.size) && asset.size > 0 && asset.size < 1_000_000_000, "Release asset must fit GitHub Pages and have a SHA-256 digest");
const url = new URL(asset.browser_download_url);
assert(url.origin === "https://github.com" && url.pathname.startsWith(`/${repo}/releases/download/`), "Unexpected release download source");

const syncKey = `${repo}:${release.id}:${asset.id}:${digest}:${release.updated_at}`;
if (process.env.GITHUB_EVENT_NAME === "schedule") {
  const current = await fetch(`${website}/downloads/release.json`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  }).then(response => response.ok ? response.json() : null).catch(() => null);
  if (current?.syncKey === syncKey) {
    await appendFile(process.env.GITHUB_OUTPUT, "deploy=false\n");
    console.log(`Already published: ${repo} ${release.tag_name}.`);
    process.exit(0);
  }
}

await mkdir(join(dist, "downloads"), { recursive: true });
const dest = join(dist, "downloads", downloadName);
const localFile = process.argv[2];
let source;
if (localFile) {
  source = createReadStream(localFile);
} else {
  const response = await fetch(url, { signal: AbortSignal.timeout(240_000) });
  assert(response.ok && response.body, `Release download failed: ${response.status}`);
  source = Readable.fromWeb(response.body);
}
const checksum = createHash("sha256");
let bytes = 0;
await pipeline(source, new Transform({
  transform(chunk, encoding, next) {
    bytes += chunk.length;
    if (bytes > asset.size) return next(new Error("Release download exceeds expected size"));
    checksum.update(chunk);
    next(null, chunk);
  },
}), createWriteStream(dest));
assert(bytes === asset.size && checksum.digest("hex") === digest, "Download failed size or SHA-256 verification");
const runtime = readRuntime(await readFile(dest));
const [, number, channel, channelNumber] = tag;
const channelName = { alpha: "Alpha", beta: "Beta", rc: "RC", preview: "Preview" }[channel?.toLowerCase()];
const version = channelName ? `${channelName} ${number}${channelNumber ? ` (${channelNumber})` : ""}` : number;
const fields = {
  version,
  "size-mib": `${(bytes / 1024 ** 2).toFixed(1)} MiB`,
  "size-bytes": bytes.toLocaleString("en-US"),
  sha256: digest,
  "desktop-runtime": runtime.desktop,
  "core-runtime": runtime.core,
  notes: release.body?.trim() || "该版本未提供更新说明。",
};
const pages = ["index.html", "compare.html", "downloads/index.html"];
for (const page of pages) {
  const template = await readFile(join(root, page), "utf8");
  const rendered = template.replace(
    /<!-- release:([\w-]+) -->[\s\S]*?<!-- \/release:\1 -->/g,
    (_, key) => {
      assert(Object.hasOwn(fields, key), `Unknown release field: ${key}`);
      return escapeHtml(fields[key]);
    },
  ).replace(/data-hash="[0-9a-f]{64}"/g, `data-hash="${digest}"`)
    .replace(/href="([^"]+BoatChrisCraftLauncher-windowsx64\.exe)"/g, `href="$1?v=${digest.slice(0, 12)}"`);
  await writeFile(join(dist, page), rendered);
}
for (const name of [".nojekyll", "CNAME", "assets", "styles.css", "app.js", "themes.js", "compare.js", "comparison-data.js"]) {
  await cp(join(root, name), join(dist, name), { recursive: true });
}
await writeFile(join(dist, "downloads", "release.json"), `${JSON.stringify({ syncKey, version, tag: release.tag_name, bytes, sha256: digest, runtime }, null, 2)}\n`);
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, "deploy=true\n");
console.log(`Verified ${repo} ${release.tag_name}, ${bytes} bytes, SHA-256 ${digest}. .NET Desktop Runtime ${runtime.desktop}.`);
