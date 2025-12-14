export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.deacero.com',
        pathname: '/**'
      }
    ], 
  }
};
