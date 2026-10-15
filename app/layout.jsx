import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Geaser Jan Gadingan | Portfolio',
  description: 'Portfolio of Geaser Jan Gadingan, an aspiring web developer building modern websites, mobile apps, and AI-powered tools.',
  applicationName: 'Geaser Jan Portfolio',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="aqua-blue" data-color-mode="dark" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
