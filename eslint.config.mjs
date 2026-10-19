import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "node_modules/**", "public/draco/**", "next-env.d.ts", ".impeccable/**"] },
];

export default config;
