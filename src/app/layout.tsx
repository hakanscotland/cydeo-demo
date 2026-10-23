import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'PINT FC — Club Website',
  description: 'Official club website and matchday attendance for PINT FC.',
};

import Header from '../components/layout/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="app-root">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
