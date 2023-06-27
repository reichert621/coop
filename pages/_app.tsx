import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {
  Inter,
  Inconsolata,
  Fira_Mono,
  Fira_Code,
  VT323,
} from 'next/font/google';

const sans = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
});

const mono = Fira_Code({
  variable: '--font-mono',
  display: 'swap',
  subsets: ['latin'],
});

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${sans.style.fontFamily};
            --font-mono: ${mono.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}