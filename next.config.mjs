/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: 'asset/source',
    })
    return config
  },
  async redirects() {
    return [
      {
        source: '/resume',
        destination: 'https://drive.google.com/file/d/1vDNRGYird41cEnu8WIMDNabUQuELGvRH',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
