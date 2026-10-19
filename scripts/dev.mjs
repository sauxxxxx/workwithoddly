import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Next's development workers must use the same path as Turbopack. On Windows,
// opening the checkout through a junction can otherwise mix drive prefixes.
process.chdir(realpathSync(fileURLToPath(new URL("../", import.meta.url))));
process.argv.splice(2, 0, "dev");

await import("next/dist/bin/next");
