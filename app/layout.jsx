import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Cursor from '../components/ui/Cursor';
import SmoothScroll from '../components/ui/SmoothScroll';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://rajakannan.com'),
  title: {
    default: 'Raja Kannan — Motion, 3D & AI Visual Design',
    template: '%s — Raja Kannan',
  },
  description:
    'Motion designer, 3D artist and AI visual creator based in Chennai. Fashion photography, motion, 3D and AI — from capture to final frame.',
  openGraph: {
    type: 'website',
    title: 'Raja Kannan — Motion, 3D & AI Visual Design',
    description: 'I shoot it — then make it unreal.',
    images: ['/img/manifesto-bg.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#08080A',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body className="grain font-sans antialiased">
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
