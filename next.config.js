/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    SOLANA_TRACKER_API_KEY: process.env.SOLANA_TRACKER_API_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  },
}

module.exports = nextConfig 