import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;