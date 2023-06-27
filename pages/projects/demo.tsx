import React from 'react';
import Head from 'next/head';

export default function Demo() {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Demo</title>
        <meta name="description" content="Demo project page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8">
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <div className="my-16">
            <h1 className="mb-4 text-center text-4xl font-extrabold text-white sm:text-5xl">
              Hello world!
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
}
