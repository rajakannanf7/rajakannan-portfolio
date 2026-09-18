import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://rajakannan.com'),
  title: { default: 'Raja Kannan: I shoot it. Then I make it unreal.', template: '%s | Raja Kannan' },
  description:
    'Raja Kannan is a photographer, motion designer and 3D/AI artist in Chennai. Fashion photography, motion, 3D and AI, from the first flash to the final frame.',
  openGraph: {
    type: 'website',
    title: 'Raja Kannan: I shoot it. Then I make it unreal.',
    description: 'Fashion photography, motion, 3D and AI, from the first flash to the final frame.',
    images: ['/img/v2/hero-unreal.webp'],
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#0A0A0B', colorScheme: 'dark' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
