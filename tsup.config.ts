import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts", "src/cli.ts"],
    outDir: "dist",
    target: "node16",
    format: ["cjs", "esm"],
    shims: true,
    clean: true,
    splitting: false,
    dts: !options.watch,
}));
