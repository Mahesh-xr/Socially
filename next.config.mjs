/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // keep this if you already have it
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
