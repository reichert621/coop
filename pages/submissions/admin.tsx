import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';

import toaster from '@/utils/toaster';
import {parseErrorMessage} from '@/utils/index';
import {A} from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import {DiscordIcon, GithubIcon, VercelIcon} from '@/components/Icons';
import {Label} from '@/components/Input';
import Alert from '@/components/Alert';

const HACKER_EMAIL_INDEX = process.env.NEXT_PUBLIC_HACKER_EMAIL_INDEX || 6;

type ApplicationSubmission = {
  id?: number | string;
  created_at?: string | Date;
  updated_at?: string | Date;
  email: string;
  discord_username: string;
  github_username: string;
  homework_staging_url: string;
  homework_github_url: string;
  project_proposal: string;
  status?: string;
};

export default function Submissions() {
  const router = useRouter();
  const [isLoading, setLoadingState] = React.useState(true);
  const [submissions, setApplicationSubmissions] = React.useState<
    ApplicationSubmission[]
  >([]);

  React.useEffect(() => {
    const init = async () => {
      try {
        const {data} = await axios.get(`/api/applications`);
        console.log('Found applications', data.applications);
        const {applications = []} = data;
        setApplicationSubmissions(applications);
      } catch (err: any) {
        const message = parseErrorMessage(err);
        console.error('Failed to fetch:', message);
        toaster.error(message);
      } finally {
        setLoadingState(false);
      }
    };

    if (router.isReady) {
      init();
    }
  }, [router.isReady]);

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-gray-900 p-8 text-gray-100">
        <Alert
          className="w-full max-w-2xl"
          type="danger"
          title="Access denied."
          description="This page is restricted to admin accounts only."
        />
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Applications</title>
        <meta name="description" content="Demo project page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8">
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <FadeIn>
            <div className="my-16">
              <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl">
                Applications
              </h1>

              <div className="space-y-4">
                {submissions.map((submission) => {
                  const {
                    email,
                    discord_username,
                    github_username,
                    homework_staging_url,
                    homework_github_url,
                    project_proposal,
                  } = submission;

                  return (
                    <div
                      key={email}
                      className="rounded border border-gray-700 bg-gray-800 p-4"
                    >
                      <div className="mb-4 flex justify-between border-b border-gray-700 pb-4">
                        <a
                          className="text-lg font-bold text-white hover:underline"
                          href={`https://mail.google.com/mail/u/${HACKER_EMAIL_INDEX}/#search/${email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {email}
                        </a>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm">
                            <DiscordIcon className="mr-2 h-4 w-4" />
                            {discord_username}
                          </span>
                          <a
                            className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm"
                            href={`https://github.com/${github_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GithubIcon className="mr-2 h-4 w-4" />
                            {github_username}
                          </a>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label className="mb-2 text-gray-400">Homework</Label>
                        <div className="flex items-center gap-2">
                          <A
                            href={homework_staging_url}
                            className="rounded-md"
                            variant="discord"
                            size="sm"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<VercelIcon className="mr-2 h-4 w-4" />}
                          >
                            Demo
                          </A>
                          <A
                            href={homework_github_url}
                            className="rounded-md"
                            variant="discord"
                            size="sm"
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={<GithubIcon className="mr-2 h-4 w-4" />}
                          >
                            GitHub Repository
                          </A>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label className="mb-2 text-gray-400">
                          Project Proposal
                        </Label>
                        <p className="whitespace-break-spaces text-base text-gray-300">
                          {project_proposal}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
