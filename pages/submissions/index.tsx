import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';
import {CheckCircleIcon, XMarkIcon} from '@heroicons/react/24/solid';

import toaster from '@/utils/toaster';
import {parseErrorMessage} from '@/utils/index';
import {
  getCachedSubmissionHash,
  setCachedSubmissionHash,
  clearCachedSubmissionHash,
} from '@/utils/storage';
import {Button} from '@/components/Button';
import {Input, Label, TextArea} from '@/components/Input';
import Confetti from '@/components/Confetti';
import Modal from '@/components/Modal';
import FadeIn from '@/components/FadeIn';
import Alert from '@/components/Alert';

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
};

const isNonEmptyString = (str: string) => {
  return !!str && str.trim().length > 0;
};

const isSubmissionEnabled = (state: ApplicationSubmission) => {
  const {
    email,
    discord_username,
    homework_staging_url,
    homework_github_url,
    project_proposal,
  } = state;

  return (
    isNonEmptyString(email) &&
    isNonEmptyString(discord_username) &&
    isNonEmptyString(homework_staging_url) &&
    isNonEmptyString(homework_github_url) &&
    isNonEmptyString(project_proposal)
  );
};

const SuccessModal = ({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} className="w-full max-w-xl">
      <div className="relative flex flex-col items-center justify-center rounded border border-gray-800 bg-gray-800 p-4 text-gray-100 sm:p-8">
        <button
          className="absolute right-2 top-2 text-gray-500 transition-colors hover:text-gray-300"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
        <CheckCircleIcon className="mb-4 mt-4 h-20 w-20 text-indigo-500 sm:h-24 sm:w-24" />

        <Confetti
          className="flex items-center justify-center"
          active={!!isOpen}
          config={{duration: 4000, elementCount: 200}}
        />

        <h1 className="mb-2 text-xl font-bold text-gray-100 sm:text-2xl">
          Application successfully submitted
        </h1>
        <p className="text-sm text-gray-400 sm:text-base">
          Thanks for submitting your application! We&apos;ll be in touch
          shortly.
        </p>
        <Button className="mt-6 rounded-md" variant="discord" onClick={onClose}>
          Return to application
        </Button>
      </div>
    </Modal>
  );
};

export default function Submissions() {
  const router = useRouter();
  const [isLoading, setLoadingState] = React.useState(true);
  const [submission, setExistingSubmission] =
    React.useState<ApplicationSubmission | null>(null);
  const [hash, setSubmissionHash] = React.useState<string | null>(null);
  const [form, setFormState] = React.useState<ApplicationSubmission>({
    email: '',
    discord_username: '',
    github_username: '',
    homework_staging_url: '',
    homework_github_url: '',
    project_proposal: '',
  });
  const [isSubmitting, setSubmittingState] = React.useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = React.useState(false);
  const [error, setErrorMessage] = React.useState<string | null>(null);
  const {
    email,
    discord_username,
    github_username,
    homework_staging_url,
    homework_github_url,
    project_proposal,
  } = form;
  const isSubmitted = !!submission && !!submission.id && !!submission.email;

  React.useEffect(() => {
    const init = async () => {
      try {
        const hash = (router.query.hash ||
          router.query.h ||
          getCachedSubmissionHash()) as string;

        if (!hash) {
          setLoadingState(false);
          return;
        }

        if (!!router.query.reset) {
          clearCachedSubmissionHash();
          setLoadingState(false);
          return;
        }

        const {data} = await axios.get(`/api/applications/${hash}`);
        console.log('Found application', data.application);
        const {application} = data;

        if (application) {
          setExistingSubmission(application);
          setFormState(application);
          setSubmissionHash(hash);
          setCachedSubmissionHash(hash);
        }
      } catch (err: any) {
        const message = parseErrorMessage(err);
        console.error('Failed to fetch:', message);
      } finally {
        setLoadingState(false);
      }
    };

    if (router.isReady) {
      init();
    }
  }, [router.isReady]);

  const handleCreateApplication = async () => {
    try {
      setSubmittingState(true);
      const {data} = await axios.post('/api/applications', {
        email,
        discord_username,
        github_username,
        homework_staging_url,
        homework_github_url,
        project_proposal,
      });
      console.log('Created application:', data);
      const {application} = data;
      setSuccessModalOpen(true);
      setExistingSubmission(application);

      if (application.hash) {
        setSubmissionHash(application.hash);
        setCachedSubmissionHash(application.hash);
      }
    } catch (err: any) {
      const message = parseErrorMessage(err);
      console.error('Failed to submit:', err, message);
      toaster.error(message);
    } finally {
      setTimeout(() => setSubmittingState(false), 800);
    }
  };

  const handleUpdateApplication = async (hash: string) => {
    try {
      setSubmittingState(true);
      const {data} = await axios.put(`/api/applications/${hash}`, {
        discord_username,
        github_username,
        homework_staging_url,
        homework_github_url,
        project_proposal,
      });
      console.log('Updated application:', data);
      const {application} = data;
      setExistingSubmission(application);
      toaster.success('Application successfully updated!');

      if (application.hash) {
        setSubmissionHash(application.hash);
        setCachedSubmissionHash(application.hash);
      }
    } catch (err: any) {
      const message = parseErrorMessage(err);
      console.error('Failed to update:', err, message);
      toaster.error(message);
    } finally {
      setTimeout(() => setSubmittingState(false), 800);
    }
  };

  const handleSubmitApplication = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (hash) {
      await handleUpdateApplication(hash);
    } else {
      await handleCreateApplication();
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Demo</title>
        <meta name="description" content="Demo project page" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8">
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <FadeIn>
            <div className="my-4">
              <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
              />
              {isSubmitted ? (
                <FadeIn direction="left">
                  <Alert
                    className="mb-6"
                    type="success"
                    title="Your application has been submitted!"
                    description="You can still make updates to your information below."
                  />
                </FadeIn>
              ) : (
                <div className="h-20" />
              )}
              <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl">
                {isSubmitted
                  ? 'Review your application'
                  : 'Submit your application'}
              </h1>
              <form
                className="mb-16 flex flex-col gap-4"
                onSubmit={handleSubmitApplication}
              >
                <div>
                  <Label className="mb-1" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane.obrien@gmail.com"
                    disabled={isSubmitted}
                    value={email}
                    onChange={(e) =>
                      setFormState((prev) => ({...prev, email: e.target.value}))
                    }
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="mb-1" htmlFor="discord_username">
                      Discord username
                    </Label>
                    <Input
                      id="discord_username"
                      name="discord_username"
                      required
                      placeholder="jane123"
                      value={discord_username}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          discord_username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="mb-1" htmlFor="github_username">
                      GitHub username
                    </Label>
                    <Input
                      id="github_username"
                      name="github_username"
                      placeholder="jane321"
                      value={github_username}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          github_username: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <hr className="border border-gray-700" />
                <div>
                  <Label className="mb-1" htmlFor="homework_staging_url">
                    Homework Demo URL
                  </Label>
                  <Input
                    id="homework_staging_url"
                    name="homework_staging_url"
                    placeholder="https://homework.vercel.app"
                    required
                    value={homework_staging_url}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        homework_staging_url: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="homework_github_url">
                    Homework GitHub URL
                  </Label>
                  <Input
                    id="homework_github_url"
                    name="homework_github_url"
                    placeholder="https://github.com/janeo/homework"
                    required
                    value={homework_github_url}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        homework_github_url: e.target.value,
                      }))
                    }
                  />
                </div>
                <hr className="border border-gray-700" />
                <div>
                  <Label className="mb-1" htmlFor="project_proposal">
                    Project proposal
                  </Label>
                  <TextArea
                    id="project_proposal"
                    name="project_proposal"
                    required
                    rows={8}
                    value={project_proposal}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        project_proposal: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Button
                    className="w-full rounded-md"
                    size="lg"
                    variant="secondary"
                    disabled={!isSubmissionEnabled(form)}
                    pending={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : isSubmitted
                      ? 'Update application'
                      : 'Submit application'}
                  </Button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
