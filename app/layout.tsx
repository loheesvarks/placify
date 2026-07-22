import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Placify - AI-Powered Placement Preparation',
  description:
    'Personalized AI-driven placement preparation platform for college students, fresh graduates, and job seekers.',
  keywords: [
    'placement preparation',
    'interview preparation',
    'coding interview',
    'AI mentor',
    'career guidance',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
