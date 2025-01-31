/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en', 'vi'],
        defaultLocale: 'en',
    },
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'cliply.co',
            },
            {
                protocol: 'https',
                hostname: 'encrypted-tbn0.gstatic.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'hcm.ss.bfcplatform.vn',
            },
        ]
    }
};

export default nextConfig;
