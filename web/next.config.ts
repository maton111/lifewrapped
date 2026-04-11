import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack workspace root to the Next app folder to avoid lockfile auto-detection warnings.
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
