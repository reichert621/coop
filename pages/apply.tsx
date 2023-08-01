import React, {HTMLAttributes, LabelHTMLAttributes} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';
import {CheckCircleIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useSupabaseClient} from '@supabase/auth-helpers-react';

import toaster from '@/utils/toaster';
import {getClientTimeZone, parseErrorMessage} from '@/utils/index';
import {Button} from '@/components/Button';
import {Input, Select, TextArea} from '@/components/Input';
import Confetti from '@/components/Confetti';
import Modal from '@/components/Modal';
import FadeIn from '@/components/FadeIn';

type ApplicationSubmission = {
  commitment?: string;
  created_at?: string;
  discord_username?: string;
  education?: string;
  email?: string;
  employment?: string;
  can_use_git?: boolean;
  github_username?: string;
  homework_github_url?: string;
  homework_staging_url?: string;
  id?: number;
  languages?: string;
  location?: string;
  project_proposal?: string;
  status?: string;
  timezone?: string | null;
  updated_at?: string;
};

const PrimaryLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  const {className, children, ...rest} = props;

  return (
    <label
      className={`${className} block text-base font-medium tracking-wide text-gray-300`}
      {...rest}
    >
      {children}
    </label>
  );
};

const SecondaryLabel = (props: HTMLAttributes<HTMLParagraphElement>) => {
  const {children, ...rest} = props;

  return (
    <p className="mb-2 text-sm text-gray-400" {...rest}>
      {children}
    </p>
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

export default function ApplyPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isLoading, setLoadingState] = React.useState(true);
  const [submission, setExistingSubmission] =
    React.useState<ApplicationSubmission | null>(null);
  const [form, setFormState] = React.useState<ApplicationSubmission>({
    commitment: '',
    education: '',
    employment: '',
    can_use_git: false,
    languages: '',
    location: '',
    project_proposal: '',
  });
  const [isSubmitting, setSubmittingState] = React.useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = React.useState(false);
  const [error, setErrorMessage] = React.useState<string | null>(null);
  const {
    commitment = '',
    education = '',
    employment = '',
    can_use_git = false,
    languages = '',
    location = '',
    project_proposal = '',
  } = form;
  const isSubmitted = !!submission && !!submission.id && !!submission.email;

  React.useEffect(() => {
    const init = async () => {
      try {
        //
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

  const handleSubmitApplication = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSubmittingState(true);
      const {data} = await axios.post('/api/applications', {
        commitment,
        education,
        employment,
        can_use_git,
        languages,
        location,
        project_proposal,
        timezone: getClientTimeZone(),
      });
      console.log('Created application:', data);
      const {application} = data;
      setSuccessModalOpen(true);
      setExistingSubmission(application);
    } catch (err: any) {
      const message = parseErrorMessage(err);
      console.error('Failed to submit:', err, message);
      toaster.error(message);
    } finally {
      setTimeout(() => setSubmittingState(false), 800);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Apply</title>
        <meta name="description" content="Apply to the Hacker Co-op" />
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

              <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl">
                Apply for access
              </h1>
              <form
                className="mb-16 flex flex-col gap-6"
                onSubmit={handleSubmitApplication}
              >
                <div>
                  <PrimaryLabel className="mb-1 " htmlFor="location">
                    Where are you currently located?
                  </PrimaryLabel>
                  <Input
                    id="location"
                    name="location"
                    required
                    disabled={isSubmitted}
                    value={location}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <PrimaryLabel className="mb-1 " htmlFor="employment">
                    Are you currently employed? If yes, what do you do for work?
                  </PrimaryLabel>
                  <Input
                    id="employment"
                    name="employment"
                    required
                    disabled={isSubmitted}
                    value={employment}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        employment: e.target.value,
                      }))
                    }
                  />
                </div>
                <hr className="border border-gray-700" />
                <div>
                  <PrimaryLabel className="" htmlFor="commitment">
                    How many hours a week can you dedicate to programming?
                  </PrimaryLabel>
                  <SecondaryLabel>
                    Please provide your most realistic estimate.
                  </SecondaryLabel>
                  <Select
                    id="commitment"
                    className="w-80"
                    required
                    value={commitment}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        commitment: e.target.value,
                      }))
                    }
                  >
                    {[
                      {value: '<8', text: 'Less than 8 hours'},
                      {value: '8-16', text: '8 to 16 hours'},
                      {value: '16-24', text: '16 to 24 hours'},
                      {value: '24-32', text: '24 to 32 hours'},
                      {value: '>32', text: 'More than 32 hours'},
                    ].map((item, index) => {
                      const {value, text} = item;

                      return (
                        <option key={value} id={value} value={value}>
                          {text}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <PrimaryLabel className="" htmlFor="can_use_git">
                    Do you know how to use git?
                  </PrimaryLabel>
                  <SecondaryLabel>
                    For example, do you know how to commit and push code to a
                    GitHub repository?
                  </SecondaryLabel>
                  <Select
                    id="can_use_git"
                    className="w-80"
                    value={can_use_git ? 'yes' : 'no'}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        can_use_git: e.target.value === 'yes',
                      }))
                    }
                  >
                    {[
                      {value: 'yes', text: 'Yes'},
                      {value: 'no', text: 'No'},
                    ].map((item) => {
                      const {value, text} = item;

                      return (
                        <option key={value} id={value} value={value}>
                          {text}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <PrimaryLabel className="" htmlFor="languages">
                    Which programming languages/frameworks are you using?
                  </PrimaryLabel>
                  <SecondaryLabel>
                    Please list all the language and frameworks you are
                    currently using and how long you have been using them for,
                    as well as any that you would like to learn in the near
                    future.
                  </SecondaryLabel>
                  <TextArea
                    id="languages"
                    name="languages"
                    required
                    rows={4}
                    placeholder="JavaScript for 6 months, Python for 8 months, etc."
                    value={languages}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        languages: e.target.value,
                      }))
                    }
                  />
                </div>
                <hr className="border border-gray-700" />
                <div>
                  <PrimaryLabel className="" htmlFor="project_proposal">
                    Project proposal
                  </PrimaryLabel>
                  <SecondaryLabel>
                    Describe a current project you're working on, or an idea for
                    a project you would like to build, or a particular problem
                    you would like to solve with programming.
                  </SecondaryLabel>
                  <TextArea
                    id="project_proposal"
                    name="project_proposal"
                    required
                    rows={8}
                    placeholder="Describe your project, or enter a public GitHub URL"
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
