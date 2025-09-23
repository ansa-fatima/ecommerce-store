import type { Metadata } from 'next';
import { 
  Inter, 
  Poppins, 
  Roboto, 
  Open_Sans, 
  Montserrat, 
  Lato, 
  Source_Sans_3, 
  Nunito, 
  Playfair_Display, 
  Merriweather,
  Raleway,
  Ubuntu,
  Crimson_Text,
  DM_Sans
} from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import ChatBot from '@/components/ChatBot';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const lato = Lato({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-source-sans-3',
  display: 'swap',
});

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

const raleway = Raleway({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
});

const ubuntu = Ubuntu({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson-text',
  display: 'swap',
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Ecommerce Store - Modern Shopping Experience',
  description: 'Discover amazing products at cftvygvctvygvyvtvygbygvyv prices. Shop with confidence and enjoy fast delivery.',
  keywords: 'ecommerce, shopping, products, online store, fashion, electronics',
  authors: [{ name: 'Ecommerce Store' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Ecommerce Store - Modern Shopping Experience',
    description: 'Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Store - Modern Shopping Experience',
    description: 'Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.className} ${poppins.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${sourceSans3.variable} ${nunito.variable} ${playfairDisplay.variable} ${merriweather.variable} ${raleway.variable} ${ubuntu.variable} ${crimsonText.variable} ${dmSans.variable} h-full`}>
        <Providers>
          {children}
          <ChatBot />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
