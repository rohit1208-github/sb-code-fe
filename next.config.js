/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        domains: ['34.60.128.41', 'via.placeholder.com'],
    },
    poweredByHeader: false,
    compress: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*/',
                destination: 'http://34.60.128.41:8000/api/:path*/',
            },
        ]
    },
}

module.exports = nextConfig
  