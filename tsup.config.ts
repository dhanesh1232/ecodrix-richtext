// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig([
  // --- ESM build ---
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist/es",
    sourcemap: true,
    clean: true,
    minify: false,
    dts: {
      resolve: true,
      entry: "src/index.ts",
      compilerOptions: {
        baseUrl: ".",
        typeRoots: ["./src/types", "./node_modules/@types"],
      },
    },
    external: ["react", "react-dom"],
    loader: {
      ".css": "copy",
    },
    esbuildOptions(options) {
      options.assetNames = "globals"; // ensures same CSS filename
    },
  },

  // --- CJS build ---
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outDir: "dist/cjs",
    sourcemap: true,
    dts: false, // already generated above
    clean: false,
    minify: false,
    external: ["react", "react-dom"],
    loader: {
      ".css": "copy",
    },
    esbuildOptions(options) {
      options.assetNames = "globals";
    },
  },

  // --- IIFE / UMD build ---
  {
    entry: ["src/index.ts"],
    format: ["iife"],
    outDir: "dist/umd",
    sourcemap: true,
    minify: true,
    dts: false,
    globalName: "RichText",
    clean: false,
    external: ["react", "react-dom"],
    loader: {
      ".css": "copy",
    },
    esbuildOptions(options) {
      // ✅ Ensures your global bundle has a consistent name
      options.globalName = "RichText";
      options.assetNames = "globals";
      options.define = {
        "process.env.NODE_ENV": JSON.stringify("production"),
      };
    },
    // ✅ Provide globals for externals in UMD build
    esbuildPlugins: [
      {
        name: "external-react-globals",
        setup(build) {
          build.onResolve({ filter: /^react$/ }, () => ({
            path: "react",
            external: true,
            namespace: "react",
          }));
          build.onResolve({ filter: /^react-dom$/ }, () => ({
            path: "react-dom",
            external: true,
            namespace: "react-dom",
          }));
        },
      },
    ],
  },
]);
