import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // C:\claude tem seu próprio package-lock.json (monorepo do adega-pdv, projeto
  // separado). Fixamos a raiz de tracing aqui para o Next não inferir errado.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
