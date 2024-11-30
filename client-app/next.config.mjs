/** @type {import('next').NextConfig} */
const nextConfig = {async redirects() {
    return [
        {
            source: '/',
            destination: '/login',
            permanent: true, // Redirect permanen (status code 308)
        },
    ];
}};

export default nextConfig;
