import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import json from "@rollup/plugin-json";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

// Only externalize React and UI component libraries that use React
const externals = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "@vis.gl/react-google-maps",
];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      commonjs(),
      json(),
      postcss({
        plugins: [
          tailwindcss(),
          autoprefixer()
        ],
        extract: "dist/meridian.css",
        inject: false,
        use: ["sass"],
        modules: false,
        minimize: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        declarationDir: undefined
      }),
      // terser(),  // COMMENT OUT TEMPORARILY
    ],
    external: (id) => {
      if (externals.some(ext => id === ext || id.startsWith(ext + '/'))) {
        return true;
      }
      return false;
    },
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types || "dist/index.d.ts", format: "es" }],
    plugins: [
      dts(),
      postcss({
        inject: false,
        extract: false,
      }),
    ],
    external: (id) => {
      if (/\.css$/.test(id)) return true;
      if (externals.some(ext => id === ext || id.startsWith(ext + '/'))) {
        return true;
      }
      return false;
    },
  },
];