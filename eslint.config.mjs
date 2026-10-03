import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Arbeitskopien von Claude Code. Jede ist ein vollständiger Checkout samt
    // eigenem Build – ohne diese Zeile meldet `npm run lint` lokal tausende
    // Fehler aus Dateien, die nicht zu diesem Stand gehören.
    ".claude/**",
    ".generated/**",
  ]),
]);

export default eslintConfig;
