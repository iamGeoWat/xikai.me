// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  async redirects() {
    return [
      {
        source: '/resume',
        destination: 'https://drive.google.com/file/d/1vDNRGYird41cEnu8WIMDNabUQuELGvRH',
        permanent: true
      },
      {
        source: '/open-in-apple-maps',
        destination: 'https://www.icloud.com/shortcuts/b18353f0bbe049eaaabb74b9e3b83853',
        permanent: true
      }
    ]
  },
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
})
