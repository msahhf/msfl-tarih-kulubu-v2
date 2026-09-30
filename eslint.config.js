import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "docs/**",
      "archive/**",
      "scripts/**",
      "*.tsbuildinfo",
      "next-env.d.ts",
    ],
  },
];

export default config;
