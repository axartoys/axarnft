export const metadata = {
  metadataBase: {
    scheme: 'https',
    host: 'axar.io'
  },
  title: {
    default: 'Axar - Decentralize Your Digital Persona',
    template: '%s | Axar'
  },
  description: 'Axar empowers you to own and move your AI interactions freely, no matter the form factor or AI model.',
  keywords: ['Axar', 'NFT', 'AI', 'Decentralized', 'Persona', 'Blockchain'],
  authors: [{ name: 'Axar' }],
  creator: 'Axar',
  publisher: 'Axar',
  robots: {
    index: true,
    follow: true,
    googlebot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://axar.io',
    title: 'Axar - Decentralize Your Digital Persona',
    description: 'Axar empowers you to own and move your AI interactions freely, no matter the form factor or AI model.',
    siteName: 'Axar',
    images: [
      {
        url: '/nft-1.jpeg',
        width: 1200,
        height: 630,
        alt: 'Axar Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axar - Decentralize Your Digital Persona',
    description: 'Axar empowers you to own and move your AI interactions freely, no matter the form factor or AI model.',
    images: ['/nft-1.jpeg']
  },
  verification: {
    google: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE',
    yandex: '', 
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  themeColor: '#FF5A7E',
  manifest: {
    name: 'Axar',
    short_name: 'Axar',
    description: 'Axar - Decentralize Your Digital Persona',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FF5A7E',
    icons: [
      {
        src: '/nft-1.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/nft-2.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  },
};
