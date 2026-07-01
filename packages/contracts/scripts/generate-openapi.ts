import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildOpenApiDocument } from "../src/openapi";

async function main() {
  const outputDir = resolve(process.cwd(), "docs/api");
  await mkdir(outputDir, { recursive: true });
  await writeFile(
    resolve(outputDir, "openapi.json"),
    JSON.stringify(buildOpenApiDocument(), null, 2),
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
