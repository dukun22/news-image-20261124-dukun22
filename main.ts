// News Image 24 Nov: copy the poster to the output directory.
// The repository holds the finished poster; this program only copies it
// to /output/entry.png after checking the PNG signature and the 1 MiB cap,
// so two runs always write identical bytes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const data = readFileSync(src);
const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!data.subarray(0, 8).equals(pngSig)) {
  throw new Error("entry.png is not a PNG file");
}
if (data.length > 1048576) {
  throw new Error("entry.png exceeds the 1 MiB limit");
}
mkdirSync(outDir, { recursive: true });
const out = join(outDir, "entry.png");
writeFileSync(out, data);
console.log(`wrote ${out} (${data.length} bytes)`);
