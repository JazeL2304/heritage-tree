import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HeritageTree - Imperial Family Lineage Ledger',
  description: 'Interactive family tree builder, genealogical ledger & lineage scroll generator.',
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fbf9f5] text-[#1f1d1d] min-h-screen flex flex-col font-['Poppins'] antialiased">
        {children}
      </body>
    </html>
  );
}
