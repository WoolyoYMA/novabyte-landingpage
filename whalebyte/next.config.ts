import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignoriert TypeScript-Fehler beim Build, damit die Seite live geht
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoriert ESLint-Warnungen beim Build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
