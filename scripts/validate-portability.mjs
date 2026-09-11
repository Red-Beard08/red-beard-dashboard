import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const roots = ["src", "scripts", "README.md", "manifest.json", "package.json", "esbuild.config.mjs", "styles.css"];
const forbidden = [/C:\\\\Users\\\\/i, /iCloud~md~obsidian/i, /Collections\\\\Counseling/i, /Collections\\\\Movies/i, /Red-Beard's Dashboard\.md/i, /gho_[A-Za-z0-9]+/i, /sk-[A-Za-z0-9]+/i];
const files = [];
async function walk(target) {
  const info = await stat(target);
  if (info.isDirectory()) for (const entry of await readdir(target)) await walk(path.join(target, entry));
  else files.push(target);
}
for (const root of roots) if (await stat(root).then(() => true).catch(() => false)) await walk(root);
const failures = [];
for (const file of files) {
  // The scanner necessarily contains the patterns it is looking for.
  if (file.endsWith("validate-portability.mjs")) continue;
  const content = await readFile(file, "utf8");
  if (forbidden.some(pattern => pattern.test(content))) failures.push(file);
}
if (failures.length) throw new Error(`Portable-source scan failed: ${failures.join(", ")}`);
console.log("Validated dashboard source portability.");
