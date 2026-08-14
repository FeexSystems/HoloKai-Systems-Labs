import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HoloKai — Where Civilizations Remember',
    short_name: 'HoloKai',
    description:
      'Civilization-scale AI research OS for Pan-African history, epigraphy, and astronomy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05050a',
    theme_color: '#c8952a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'reference', 'utilities'],
    lang: 'en',
    dir: 'ltr',
  };
}
