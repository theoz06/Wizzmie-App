/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login',
          permanent: true, // Redirect permanen (status code 308)
        },
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000', // Sesuaikan dengan port server API Anda
          pathname: '/api/images/**', // Path sesuai dengan lokasi gambar Anda
        },
      ],
    },
  };
  
  export default nextConfig;
  