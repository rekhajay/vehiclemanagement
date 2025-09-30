/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    SQL_SERVER: process.env.SQL_SERVER,
    SQL_DATABASE: process.env.SQL_DATABASE,
  },
}

module.exports = nextConfig
