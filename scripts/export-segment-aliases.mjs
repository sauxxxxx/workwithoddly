import { copyFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Next 16 exports segment payloads into folders, while its client requests dot-
// separated filenames. Publish equivalent aliases for ordinary static hosts.
const output = fileURLToPath(new URL("../out/", import.meta.url));
let aliases = 0;

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "_next") await visit(source);
      continue;
    }
    if (!entry.name.endsWith(".txt")) continue;
    const parts = path.relative(output, source).split(path.sep);
    const segment = parts.findIndex((part) => part.startsWith("__next."));
    if (segment < 0 || segment === parts.length - 1) continue;
    const destination = path.join(
      output,
      ...parts.slice(0, segment),
      parts.slice(segment).join("."),
    );
    try {
      const existing = await readFile(destination);
      if (!existing.equals(await readFile(source)))
        throw new Error(`Conflicting export alias: ${destination}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await copyFile(source, destination);
    }
    aliases++;
  }
}

await visit(output);
console.log(`Static export: ${aliases} segment payload aliases ready.`);
