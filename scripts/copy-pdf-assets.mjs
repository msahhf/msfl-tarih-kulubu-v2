import { cpSync, copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * PDF.js is loaded lazily in the browser. Its worker and the optional
 * font/colour/wasm assets must be available from /public so that a CDN or
 * third-party viewer is never required at runtime.
 *
 * The files are generated during `predev` / `prebuild` and ignored by git.
 */
const root = process.cwd();
const source = join(root, "node_modules", "pdfjs-dist");
const target = join(root, "public", "pdf");

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

copyFileSync(
  join(source, "build", "pdf.worker.min.mjs"),
  join(target, "pdf.worker.min.mjs")
);

for (const directory of ["cmaps", "standard_fonts", "wasm", "iccs"]) {
  cpSync(join(source, directory), join(target, directory), { recursive: true });
}

console.log("PDF.js assets copied to public/pdf");
