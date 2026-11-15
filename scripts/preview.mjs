import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, relative, sep } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const file = resolve(
      root,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    const localPath = relative(root, file);
    if (
      localPath.startsWith("..") ||
      localPath.split(sep).some((part) => part.startsWith(".")) ||
      !types[extname(file)]
    ) {
      response.writeHead(404).end("Not found");
      return;
    }
    const data = await readFile(file);
    response
      .writeHead(200, {
        "Content-Type": types[extname(file)],
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      })
      .end(data);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`BCCL preview: http://127.0.0.1:${port}`),
);
