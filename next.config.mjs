/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/discover",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;