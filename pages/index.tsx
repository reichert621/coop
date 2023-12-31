import {GetServerSidePropsContext} from 'next';
import React from 'react';
import Head from 'next/head';
import {ArrowRightIcon} from '@heroicons/react/24/solid';
import {Session, createPagesServerClient} from '@supabase/auth-helpers-nextjs';

import {A, Link} from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import {DiscordIcon} from '@/components/Icons';

export default function Home({session}: {session: Session}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  console.log('Logged in as:', session);

  const handleScrollAndHighlightAboutMe = () => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op</title>
        <meta name="description" content="Apply to join the Hacker Co-op!" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
        <div className="flex items-center justify-end gap-2 px-4 sm:px-8">
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
          {session ? (
            <Link
              className="rounded-md"
              href="/dashboard"
              variant="secondary"
              size="sm"
            >
              Dashboard <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <Link
              className="rounded-md"
              href="/login"
              variant="secondary"
              size="sm"
            >
              Sign in <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <div className="mb-4 mt-8 sm:mb-8 sm:mt-16">
            <div className="mb-4 flex">
              <span className="animate-bounce rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-pink-100">
                The Hacker Co-op: Coming soon!
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
              Join a small group of{' '}
              <span className="bg-gradient-to-r from-pink-400 to-indigo-500 bg-clip-text text-transparent">
                ambitious learners
              </span>
            </h1>
            <p className="mt-2 text-lg text-gray-300 sm:mt-4 sm:text-xl">
              The Hacker Co-op Discord community is a space where beginner and
              senior programmers can come together and support one another.
            </p>
          </div>

          <FadeIn direction="up" delay={200}>
            <A
              className="w-full rounded-lg"
              variant="primary"
              size="lg"
              href="https://docs.google.com/forms/d/e/1FAIpQLScIq8C6crNpSHJomth-urPay_zGnb7KmO_AGVaegZ3jVfNzhA/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply now for access
            </A>
          </FadeIn>

          <FadeIn direction="left" delay={1000}>
            <div className="mt-16">
              <div className="mb-12 border-l-4 border-pink-300 pl-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-100">
                  What is this?
                </h3>
                <p className="mb-2 text-gray-300">
                  The Hacker Co-op will be a small Discord community of 10 to 20
                  people who have started learning programming, and want to
                  level up with a group of like-minded individuals.
                </p>
                <p className="mb-2 text-gray-300">
                  The community will be moderated by senior level engineers like{' '}
                  <button
                    className="text-gray-100 underline hover:text-white"
                    onClick={handleScrollAndHighlightAboutMe}
                  >
                    myself
                  </button>
                  , in order to provide mentorship, advice, and help unblock
                  learners. In the beginning, it will only be me, which is why
                  I&apos;d like to keep the group small to start. 🙂
                </p>
              </div>

              <div className="mb-12 border-l-4 border-pink-400 pl-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-100">
                  How does it work?
                </h3>
                <p className="mb-2 text-gray-300">
                  The community will be focused on learning through building
                  individual web-based projects. To start, the group will be
                  comprised of people interested in using one of the most
                  popular tech stacks: HTML, CSS, JavaScript/TypeScript/NodeJS.
                  Each individual will be responsible for coming up with their
                  own project ideas.
                </p>
                <p className="mb-2 text-gray-300">
                  The goal is to simulate what it&apos;s like working at a
                  typical Silicon Valley tech company. Each week, we will set
                  individual goals, write code, create Pull Requests in GitHub,
                  and review each other&apos;s code. Each member is expected to
                  build in public.
                </p>
                <p className="mb-2 text-gray-300">
                  The community will be kept relatively small to start. People
                  that fail to participate or meet expectations will be removed
                  from the community, so that others may join.
                </p>
              </div>
              <div className="mb-12 border-l-4 border-pink-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-100">
                  How do I apply?
                </h3>
                <p className="mb-2 text-gray-300">
                  <a
                    className="text-gray-100 underline hover:text-white"
                    href="https://docs.google.com/forms/d/e/1FAIpQLScIq8C6crNpSHJomth-urPay_zGnb7KmO_AGVaegZ3jVfNzhA/viewform?usp=sf_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here
                  </a>{' '}
                  to fill out a Google Form application. 🚀
                </p>
                <p className="mb-2 text-gray-300">
                  For the first cohort, the following applicants are preferred:
                </p>
                <ul className="mb-2 list-inside list-disc text-gray-300">
                  <li>
                    People that have some basic experience with HTML, CSS, and
                    JS/TS
                  </li>
                  <li>
                    People that have some basic experience with git and GitHub
                  </li>
                  <li>
                    People that are willing to commit at least 12 hours a week
                    to learning
                  </li>
                  <li>People that generally work in a US time zone</li>
                </ul>
                <p className="mb-2 text-gray-300">
                  I apologize if this seems unnecessarily restrictive &mdash; I
                  just want to make sure everyone has a good experience, and it
                  helps if everyone is focused on learning similar tools in
                  similar time zones.
                </p>
              </div>
              <div
                ref={scrollRef}
                className="mb-12 border-l-4 border-pink-600 pl-4"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-100">
                  Who are you?
                </h3>
                <p className="mb-2 text-gray-300">
                  My name is Alex (
                  <a
                    className="text-gray-100 underline hover:text-white"
                    href="https://www.linkedin.com/in/alexreichert/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  /
                  <a
                    className="text-gray-100 underline hover:text-white"
                    href="https://github.com/reichert621/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github
                  </a>
                  ). I&apos;ve been a software developer for almost 10 years
                  now. I started my career in San Francisco working at various
                  startups, then spent a bit of time at Stripe, at which point I
                  moved to New York.
                </p>
                <p className="mb-2 text-gray-300">
                  In the summer of 2020, I went through Y Combinator. Since
                  then, I&apos;ve spent most of my time working on my own
                  startups. 👨‍💻
                </p>
              </div>
              <div className="mb-12 border-l-4 border-pink-700 pl-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-100">
                  Why are you doing this?
                </h3>
                <p className="mb-2 text-gray-300">
                  I have some free time on my hands this summer, and I was
                  considering doing some volunteer work. I&apos;ve always
                  enjoyed coding and mentoring junior engineers, so I figured
                  this could be a nice way to give back, especially as someone
                  who was also self-taught.
                </p>
                <p className="mb-2 text-gray-300">
                  I also would like to launch a few side projects this summer,
                  and would love to have an accountability group to work with!
                  🔥
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="mb-24">
            <FadeIn direction="up" delay={200}>
              <A
                className="mb-2 w-full rounded-lg"
                variant="primary"
                size="lg"
                href="https://docs.google.com/forms/d/e/1FAIpQLScIq8C6crNpSHJomth-urPay_zGnb7KmO_AGVaegZ3jVfNzhA/viewform?usp=sf_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply now for access
              </A>
            </FadeIn>
            <FadeIn direction="up" delay={400}>
              <div className="text-center text-sm text-gray-300">
                In the meantime, come say hi on{' '}
                <a
                  className="text-gray-100 underline hover:text-white"
                  href="https://discord.gg/pJCpqTkn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>{' '}
                👋
              </div>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createPagesServerClient(ctx);
  const {
    data: {session},
  } = await supabase.auth.getSession();

  return {props: {session}};
}
