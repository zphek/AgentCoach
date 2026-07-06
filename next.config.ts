import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "lucius-gulpy-nonconnotatively.ngrok-free.dev",
    "agentcoach-production-5c67.up.railway.app",
  ],
};

export default nextConfig;
