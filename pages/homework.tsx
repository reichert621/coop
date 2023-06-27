import React from 'react';
import Head from 'next/head';

import Alert from '@/components/Alert';
import {A} from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import {DiscordIcon} from '@/components/Icons';

const curl = `
curl https://www.hackercoop.dev/api/boop \\
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  --header "Content-Type: application/json" \\
  --data '{"content": "Hello world!"}'
`.trim();

export default function Homework() {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Homework</title>
        <meta
          name="description"
          content="The Hacker Co-op homework assignment"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
        <div className="flex items-center justify-end px-4 sm:px-8">
          <A
            className="rounded-md"
            variant="discord"
            size="sm"
            icon={<DiscordIcon className="mr-2 h-4 w-4" />}
            href="https://discord.gg/pJCpqTkn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join us on Discord
          </A>
        </div>
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8 sm:py-16">
          <h1 className="mb-4 mt-8 border-b-2 border-gray-700 pb-2 text-4xl font-extrabold text-white sm:text-5xl">
            Homework Assignment
          </h1>

          <FadeIn direction="left">
            <Alert
              className="mb-6"
              type="info"
              title="Limited to applicants"
              description="Please submit an application before proceeding."
              cta={
                <A
                  className="rounded-md"
                  size="sm"
                  variant="secondary"
                  href="https://docs.google.com/forms/d/e/1FAIpQLScIq8C6crNpSHJomth-urPay_zGnb7KmO_AGVaegZ3jVfNzhA/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply now
                </A>
              }
            />
          </FadeIn>

          <FadeIn direction="left" delay={200}>
            <div className="mb-24 flex flex-col gap-4">
              <h2 className="mt-2 text-3xl font-bold text-white">Overview</h2>

              <p className="text-lg text-gray-300">
                For this assignment, you will be building a simple webpage that
                handles taking in some text input from the user, and sends the
                text as a message to a{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://discord.com/channels/1122935602271223838/1123062270998630440"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord channel
                </a>
                , using an API endpoint that I will provide below.
              </p>

              <p className="text-lg text-gray-300">
                The webpage should be build using{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://nextjs.org/learn/basics/create-nextjs-app/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NextJS
                </a>
                /
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://react.dev/learn/start-a-new-react-project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ReactJS
                </a>
                , and should look something like this:
              </p>

              <img
                className="w-full rounded border-2 border-gray-700"
                src="/homework.png"
              />

              <p className="text-lg text-gray-300">
                Here is a rough demo of how the functionality might look, with
                the webpage on the left, and the Discord channel window on the
                right.
              </p>

              <p className="text-lg text-gray-300">
                As you can see, after the message is entered and sent via the
                webpage, it should appear in the{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://discord.com/channels/1122935602271223838/1123062270998630440"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord channel
                </a>
                :
              </p>

              <div className="-mx-2 sm:-mx-8">
                <video
                  src="/homework.mov"
                  className="my-4 h-full rounded border-2 border-gray-700 bg-black p-2"
                  autoPlay
                  loop
                  muted
                />
              </div>

              <hr className="border border-gray-700" />

              <h2 className="mt-2 text-3xl font-bold text-white">
                Instructions
              </h2>

              <p className="text-lg text-gray-300">
                To get started, you&apos;ll need a basic understanding of HTML,
                CSS, JavaScript/TypeScript, and git. You&apos;ll also need some
                familiarity with{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://react.dev/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ReactJS
                </a>
                .
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Getting set up
              </h3>

              <p className="text-lg text-gray-300">
                First, you&apos;ll want to set up your app with{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://nextjs.org/learn/basics/create-nextjs-app/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NextJS
                </a>
                . (I don&apos;t expect that you have experience with NextJS, but
                if you have some basic understanding of JavaScript and ReactJS,
                it shouldn&apos;t be too difficult to learn.)
              </p>

              <p className="text-lg text-gray-300">
                Once your app boilerplate is set up and running, you&apos;ll
                need to create a{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://docs.github.com/en/get-started/quickstart/create-a-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  new private repository on GitHub
                </a>{' '}
                to manage and share your code.{' '}
                <strong className="text-gray-100">
                  Make sure to keep it private for now
                </strong>
                , so that other applicants cannot see your code.
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Building your app
              </h3>

              <p className="text-lg text-gray-300">
                You can use whatever libraries or resources you like to build
                your app, but it shouldn&apos;t require much. (For example, in
                my demo above, I used TailwindCSS for styling the UI, but for
                something so simple basic CSS would be totally fine.)
              </p>

              <p className="text-lg text-gray-300">
                In order to send messages to Discord, you&apos;ll need to use
                this API endpoint I set up. If you copy the cURL command below
                into your terminal, and replace <code>YOUR_ACCESS_TOKEN</code>{' '}
                with the token I provided in my email, you should be able to see
                how it works:
              </p>

              <pre className="overflow-scroll rounded border border-gray-700 bg-black px-3 py-3 text-sm">
                <code className="whitespace-pre">{curl}</code>
              </pre>

              <p className="text-lg italic text-gray-300">
                When sending a message via the API, please prefix it with
                &quot;Message from [your username]&quot;, so that I can
                distinguish where messages are coming from!
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Deploying your app
              </h3>

              <p className="text-lg text-gray-300">
                Once your app is ready, you&apos;ll need to set up a free
                account with{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://vercel.com/docs/getting-started-with-vercel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel
                </a>
                , so that you can deploy your app once it&apos;s ready. Vercel
                makes it super easy to deploy NextJS/ReactJS applications for
                free.
              </p>

              <p className="text-lg text-gray-300">
                When you&apos;re happy with your app, and it has been
                successfully deployed to Vercel, reply to my email with a link.
                The link should look something like{' '}
                <code>https://xxxxx.vercel.app</code>.
              </p>

              <p className="text-lg text-gray-300">
                I should be able to click the link, enter a message, and verify
                that it can successfully be sent to the Discord channel.
              </p>

              <hr className="border border-gray-700" />

              <h2 className="mt-2 text-3xl font-bold text-white">Need help?</h2>

              <p className="text-lg text-gray-300">
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://discord.gg/pJCpqTkn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join the Discord server
                </a>
                , and email me your Discord username so I can verify you. Once
                you&apos;re verified, you&apos;ll be able to ask questions in
                the private homework{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://discord.com/channels/1122935602271223838/1123067716291547187"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #discussion
                </a>{' '}
                channel.
              </p>

              <p className="text-lg text-gray-300">
                Also, if you applied but haven&apos;t received an email yet,
                feel free to reach out at{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="mailto:hackercoop2023@gmail.com"
                >
                  hackercoop2023@gmail.com
                </a>
                .
              </p>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
