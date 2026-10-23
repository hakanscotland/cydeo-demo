import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'PINT FC — Club Website',
  description: 'Official club website and matchday attendance for PINT FC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
