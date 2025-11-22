
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Enable React strict mode for safer development
  reactStrictMode: true,

  // ✅ Skip TypeScript errors during build (fast deployment)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Skip ESLint errors during build (fast deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Example: allow external images if needed
  images: {
    domains: ["yourdomain.com"], // add any domains you load images from
  },

  // ✅ Optional: standalone output for serverless deployments
  output: "standalone",
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // ✅ Enable React strict mode for safer development
//   reactStrictMode: true,

//   // ✅ Skip TypeScript errors during build (fast deployment)
//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   // ✅ Skip ESLint errors during build (fast deployment)
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   // ✅ Example: allow external images if needed
//   images: {
//     domains: ["yourdomain.com"], // add any domains you load images from
//   },
// };

// export default nextConfig;
