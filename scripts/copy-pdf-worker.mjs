// scripts/copy-pdf-worker.mjs
// Kopiuje worker pdfjs-dist zgodny z wersją używaną przez react-pdf do /public,
// żeby ProtectedPDF mógł go załadować spod stabilnego URL (/pdf.worker.min.mjs).
// Uruchamiane przy postinstall oraz przed build.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Preferuj wersję pdfjs-dist zagnieżdżoną w react-pdf (zgodna z jej API),
// a jeśli jej nie ma — wersję z korzenia node_modules.
const candidates = [
  join(root, "node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
  join(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
];

let srcPath = null;
for (const p of candidates) {
  if (existsSync(p)) {
    srcPath = p;
    break;
  }
}

if (!srcPath) {
  console.warn("[copy-pdf-worker] Nie znaleziono pdf.worker.min.mjs — pomijam.");
  process.exit(0);
}

const destDir = join(root, "public");
const destPath = join(destDir, "pdf.worker.min.mjs");

if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
copyFileSync(srcPath, destPath);

console.log(`[copy-pdf-worker] Skopiowano worker: ${srcPath} -> ${destPath}`);
