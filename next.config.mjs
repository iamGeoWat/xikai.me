/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/resume',
        destination: 'https://drive.google.com/file/d/1u4c0i5rMtFDIW9P5qVgJb-Nxg5FVr0Dl/view',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
