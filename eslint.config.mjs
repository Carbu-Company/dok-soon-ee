import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  // 무거운 폴더는 린트 제외 (속도 ↑)
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", "build/**", ".turbo/**", "coverage/**"],
  },

  // Next.js 권장 규칙
  ...compat.extends("next/core-web-vitals"),

  // Prettier와 ESLint 통합
  ...compat.extends("prettier"),

  // 프로젝트 공통 설정/해결자
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // 필요 시 여기서 규칙 조정
      // 예: "react-hooks/exhaustive-deps": "off"
    },
  },
];

export default config;
