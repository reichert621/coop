import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';
import {
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

import toaster from '@/utils/toaster';
import {parseErrorMessage} from '@/utils/index';
import {A, Button} from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import {DiscordIcon, GithubIcon, VercelIcon} from '@/components/Icons';
import {Label} from '@/components/Input';
import Alert from '@/components/Alert';

const HACKER_EMAIL_INDEX = process.env.NEXT_PUBLIC_HACKER_EMAIL_INDEX || 6;

type ApplicationSubmission = {
  id: number | string;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
  email: string;
  discord_username: string;
  github_username: string;
  homework_staging_url: string;
  homework_github_url: string;
  project_proposal: string;
  hash?: string;
};

const ApplicationStatusBadge = ({status}: {status: string}) => {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
          <ClockIcon className="mr-2 h-4 w-4" />
          Pending
        </span>
      );
    case 'accepted':
      return (
        <span className="inline-flex items-center rounded-full bg-green-700 px-3 py-1 text-sm text-green-100">
          <CheckCircleIcon className="mr-2 h-4 w-4" />
          Accepted
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center rounded-full bg-red-700 px-3 py-1 text-sm text-red-100">
          <XCircleIcon className="mr-2 h-4 w-4" />
          Rejected
        </span>
      );
    default:
      return null;
  }
};

const ApplicationSubmissionDetails = ({
  submission,
  action,
  onReject,
  onAccept,
}: {
  submission: ApplicationSubmission;
  action: 'rejected' | 'accepted' | null;
  onReject: (submission: ApplicationSubmission) => void;
  onAccept: (submission: ApplicationSubmission) => void;
}) => {
  const {
    id,
    email,
    status,
    discord_username,
    github_username,
    homework_staging_url,
    homework_github_url,
    project_proposal,
    hash,
  } = submission;

  return (
    <div className="rounded border border-gray-700 bg-gray-800 p-4">
      <div className="mb-4 border-b border-gray-700 pb-4">
        <div className="flex justify-between gap-4">
          <a
            className="text-lg font-bold text-white hover:underline"
            href={`https://mail.google.com/mail/u/${HACKER_EMAIL_INDEX}/#search/${email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>

          <ApplicationStatusBadge status={status} />
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm">
            <DiscordIcon className="mr-2 h-4 w-4" />
            {discord_username}
          </span>
          <a
            className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm hover:bg-gray-600"
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
        <Label className="mb-2 text-gray-400">Project Proposal</Label>
        <p className="whitespace-break-spaces text-base text-gray-300">
          {project_proposal}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
        <A
          className="rounded-md"
          href={`/submissions/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="discord"
          size="sm"
          icon={<PencilSquareIcon className="mr-2 h-4 w-4" />}
        >
          Edit
        </A>
        <div className="flex items-center gap-2">
          <Button
            className="rounded-md"
            variant="discord"
            size="sm"
            disabled={!!action || status === 'rejected'}
            pending={action === 'rejected'}
            icon={<XCircleIcon className="mr-2 h-4 w-4" />}
            onClick={() => onReject(submission)}
          >
            {status === 'rejected' ? 'Rejected!' : 'Reject'}
          </Button>
          <Button
            className="rounded-md"
            variant="secondary"
            size="sm"
            disabled={!!action || status === 'accepted'}
            pending={action === 'accepted'}
            icon={<CheckCircleIcon className="mr-2 h-4 w-4" />}
            onClick={() => onAccept(submission)}
          >
            {status === 'accepted' ? 'Accepted!' : 'Accept'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Submissions() {
  const router = useRouter();
  const [isLoading, setLoadingState] = React.useState(true);
  const [submissions, setApplicationSubmissions] = React.useState<
    ApplicationSubmission[]
  >([]);
  const [statusUpdateAction, setStatusUpdateAction] = React.useState<
    null | 'accepted' | 'rejected'
  >(null);

  const fetchAllApplications = async () => {
    try {
      const {data} = await axios.get(`/api/applications`);
      console.log('Found applications', data.applications);
      const {applications = []} = data;
      setApplicationSubmissions(applications);
    } catch (err: any) {
      const message = parseErrorMessage(err);
      console.error('Failed to fetch:', message);
      toaster.error(message);
    }
  };

  React.useEffect(() => {
    if (router.isReady) {
      fetchAllApplications().finally(() => setLoadingState(false));
    }
  }, [router.isReady]);

  const handleUpdateStatus = async (
    id: string | number,
    status: 'accepted' | 'rejected'
  ) => {
    try {
      setStatusUpdateAction(status);
      await axios.post(`/api/applications/${id}/status`, {status});
      await fetchAllApplications();
      toaster.success(`Successfully ${status} application.`);
    } catch (err: any) {
      const message = parseErrorMessage(err);
      console.error(`Failed to update status to "${status}":`, message);
      toaster.error(message);
    } finally {
      setTimeout(() => setStatusUpdateAction(null), 800);
    }
  };

  const handleRejectApplication = async ({id}: ApplicationSubmission) => {
    await handleUpdateStatus(id, 'rejected');
  };

  const handleAcceptApplication = async ({id}: ApplicationSubmission) => {
    await handleUpdateStatus(id, 'accepted');
  };

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

  const pending = submissions.filter(
    (s) => s.status !== 'accepted' && s.status !== 'rejected'
  );
  const accepted = submissions.filter((s) => s.status === 'accepted');
  const rejected = submissions.filter((s) => s.status === 'rejected');

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

              <section className="mb-8">
                <h2 className="mb-4 border-b border-gray-700 pb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                  Pending
                </h2>

                <div className="space-y-4">
                  {pending.length > 0 ? (
                    pending.map((submission) => {
                      return (
                        <ApplicationSubmissionDetails
                          key={submission.id}
                          submission={submission}
                          action={statusUpdateAction}
                          onReject={handleRejectApplication}
                          onAccept={handleAcceptApplication}
                        />
                      );
                    })
                  ) : (
                    <div className="text-gray-400">
                      No application submissions in this category.
                    </div>
                  )}
                </div>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 border-b border-gray-700 pb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                  Accepted
                </h2>

                <div className="space-y-4">
                  {accepted.length > 0 ? (
                    accepted.map((submission) => {
                      return (
                        <ApplicationSubmissionDetails
                          key={submission.id}
                          submission={submission}
                          action={statusUpdateAction}
                          onReject={handleRejectApplication}
                          onAccept={handleAcceptApplication}
                        />
                      );
                    })
                  ) : (
                    <div className="text-gray-400">
                      No application submissions in this category.
                    </div>
                  )}
                </div>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 border-b border-gray-700 pb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                  Rejected
                </h2>

                <div className="space-y-4">
                  {rejected.length > 0 ? (
                    rejected.map((submission) => {
                      return (
                        <ApplicationSubmissionDetails
                          key={submission.id}
                          submission={submission}
                          action={statusUpdateAction}
                          onReject={handleRejectApplication}
                          onAccept={handleAcceptApplication}
                        />
                      );
                    })
                  ) : (
                    <div className="text-gray-400">
                      No application submissions in this category.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
