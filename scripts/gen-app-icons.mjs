import sharp from "sharp";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const iconSvg = await readFile(resolve(root, "src/app/icon.svg"), "utf8");
const inner = iconSvg.replace(/<\?xml[^?]*\?>/g, "").replace(/<\/?svg[^>]*>/g, "");

// Apple touch icon: 180×180 PNG on solid brand-950 background, icon scaled to ~62% with safe-area padding.
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#2e1065"/>
  <g transform="translate(34 34) scale(1.75)">${inner}</g>
</svg>`;

await sharp(Buffer.from(appleSvg))
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, "src/app/apple-icon.png"));

console.log("Wrote src/app/apple-icon.png");

// Multi-size favicon.ico: embed 32, 48, 64 PNGs.
// Browsers pick the best match for the display context (tab, bookmark, retina).
// 16×16 omitted — the detailed tail can't survive that resolution; let browsers downscale 32 instead.
const sizes = [32, 48, 64];
const pngs = await Promise.all(
  sizes.map((s) =>
    sharp(Buffer.from(iconSvg))
      .resize(s, s)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);  // reserved
header.writeUInt16LE(1, 2);  // type: ICO
header.writeUInt16LE(sizes.length, 4);  // image count

const dirSize = 16 * sizes.length;
let offset = 6 + dirSize;
const entries = Buffer.alloc(dirSize);
sizes.forEach((s, i) => {
  const base = i * 16;
  entries.writeUInt8(s === 256 ? 0 : s, base);     // width
  entries.writeUInt8(s === 256 ? 0 : s, base + 1); // height
  entries.writeUInt8(0, base + 2);                 // palette
  entries.writeUInt8(0, base + 3);                 // reserved
  entries.writeUInt16LE(1, base + 4);              // planes
  entries.writeUInt16LE(32, base + 6);             // bits/pixel
  entries.writeUInt32LE(pngs[i].length, base + 8); // image size
  entries.writeUInt32LE(offset, base + 12);        // offset
  offset += pngs[i].length;
});

await writeFile(
  resolve(root, "src/app/favicon.ico"),
  Buffer.concat([header, entries, ...pngs]),
);

console.log(`Wrote src/app/favicon.ico (sizes: ${sizes.join(", ")})`);

// Markup copy: same SVG under public/ so it can be referenced from JSX.
// src/app/icon.svg is consumed by Next.js as a route, not a static asset.
await copyFile(
  resolve(root, "src/app/icon.svg"),
  resolve(root, "public/images/logo-mark.svg"),
);

console.log("Wrote public/images/logo-mark.svg");
