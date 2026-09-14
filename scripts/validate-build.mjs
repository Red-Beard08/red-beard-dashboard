import { readFile, stat } from "node:fs/promises";

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const versions = JSON.parse(await readFile("versions.json", "utf8"));
const main = await readFile("main.js", "utf8");
const css = await readFile("styles.css", "utf8");
const failures = [];

if (manifest.id !== "red-beard-dashboard") failures.push("Unexpected plugin id.");
if (manifest.version !== "1.2.0") failures.push("Manifest is not version 1.2.0.");
if (!versions[manifest.version]) failures.push("versions.json is missing the current release.");
if (manifest.isDesktopOnly !== false) failures.push("Dashboard must remain mobile-compatible.");
if (!main.includes("registerWidget") || !main.includes("red-beard-dashboard-layout")) failures.push("Bundle is missing the public widget/layout contract.");
if (!main.includes("open-settings") || !main.includes("red-beard-dashboard:managed-start")) failures.push("Bundle is missing settings or managed layout support.");
if (!css.includes("safe-area-inset-bottom") || !css.includes("@media")) failures.push("Styles are missing mobile-safe layout rules.");
if ((await stat("main.js")).size < 5_000) failures.push("main.js appears unexpectedly small.");
if (/require\(["'](?:fs|path|electron|os|child_process)["']\)/.test(main)) failures.push("main.js contains a desktop-only runtime import.");

if (failures.length) throw new Error(failures.join("\n"));
console.log("Validated Red-Beard Dashboard release files and portability.");
