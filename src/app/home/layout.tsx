import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nutrillo - Food Log',
  description: 'Track your meals and nutrition journey',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#319795',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nutrillo',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ 
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {children}
    </main>
  );
} 