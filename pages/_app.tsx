import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {
  Inter,
  Inconsolata,
  Fira_Mono,
  Fira_Code,
  VT323,
} from 'next/font/google';
import {useState} from 'react';
import {ToastContainer} from 'react-toastify';
import {createPagesBrowserClient} from '@supabase/auth-helpers-nextjs';
import {SessionContextProvider, Session} from '@supabase/auth-helpers-react';

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
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());

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
      <ToastContainer autoClose={8000} theme="dark" />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  );
}
