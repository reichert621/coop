import {Html, Head, Main, NextScript} from 'next/document';
import Script from 'next/script';

export default function Document() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <Html lang="en">
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {!!id && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
        )}
        {!!id && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                window.dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', '${id}');
            `}
          </Script>
        )}

        {/* 
        <meta name="application-name" content="TODO" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TODO" />
        <meta name="description" content="TODO" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#111827" />

        <link rel="apple-touch-icon" href="/icons/todo.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/todo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/todo.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/todo.png" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/todo.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="TODO" />
        <meta name="twitter:title" content="TODO" />
        <meta name="twitter:description" content="TODO" />
        <meta name="twitter:image" content="/icons/todo-192x192.png" />
        <meta name="twitter:creator" content="@reichertjalex" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TODO" />
        <meta property="og:description" content="TODO" />
        <meta property="og:site_name" content="TODO" />
        <meta property="og:url" content="TODO" />
        <meta property="og:image" content="/icons/todo.png" /> 
        */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
