import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nodemailer nutzt Node.js-Interna und wird deshalb nicht gebundlet.
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
