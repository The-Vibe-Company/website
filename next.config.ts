import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Force single lexical instance to prevent error #64 in production
    // Vercel bundling can duplicate lexical modules, breaking instanceof checks
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      lexical: path.resolve(__dirname, 'node_modules/lexical'),
    }

    return webpackConfig
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
