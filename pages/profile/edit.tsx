import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';
import dayjs from 'dayjs';
import {ArrowLeftIcon, CheckIcon} from '@heroicons/react/24/solid';
import {useSessionContext, Session} from '@supabase/auth-helpers-react';

import {parseErrorMessage} from '@/utils';
import toaster from '@/utils/toaster';
import FadeIn from '@/components/FadeIn';
import {A, Button, Link} from '@/components/Button';
import {Input, Label, TextArea} from '@/components/Input';

const EditProfile = ({session}: {session: Session}) => {
  const {user} = session;
  const router = useRouter();
  const [isLoading, setLoadingState] = React.useState(true);
  const [isUpdating, setUpdatingState] = React.useState(false);
  const [profile, setUserProfile] = React.useState<Record<any, any>>({});
  const [form, setFormState] = React.useState<Record<string, any>>({
    email: '',
    bio: '',
    goals: '',
    display_name: '',
    github_username: '',
    discord_username: '',
    linkedin_url: '',
    portfolio_url: '',
    project_demo_url: '',
    project_github_url: '',
    twitter_url: '',
  });
  const [error, setErrorMessage] = React.useState<string | null>(null);
  const debug = !!Number(router.query.debug);

  React.useEffect(() => {
    const init = async () => {
      try {
        const {
          data: {user},
        } = await axios.get(`/api/me`);
        setUserProfile(user);
        setFormState({
          email: user.email ?? '',
          bio: user.bio ?? '',
          goals: user.goals ?? '',
          display_name: user.display_name ?? '',
          github_username: user.github_username ?? '',
          discord_username: user.discord_username ?? '',
          linkedin_url: user.linkedin_url ?? '',
          portfolio_url: user.portfolio_url ?? '',
          project_demo_url: user.project_demo_url ?? '',
          project_github_url: user.project_github_url ?? '',
          twitter_url: user.twitter_url ?? '',
        });
      } catch (err) {
        const message = parseErrorMessage(err);
        console.error('Failed to fetch profile:', message);
        toaster.error(message);
      } finally {
        setLoadingState(false);
      }
    };

    init();
  }, [user.id]);

  const handleUpdateProfile = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    try {
      setUpdatingState(true);
      const {
        data: {user},
      } = await axios.post(`/api/me`, form);
      setUserProfile(user);
    } catch (err) {
      const message = parseErrorMessage(err);
      console.error('Failed to update profile:', message);
      toaster.error(message);
    } finally {
      setTimeout(() => setUpdatingState(false), 800);
    }
  };

  if (isLoading || !!error) {
    return null;
  }

  const {
    email,
    bio,
    goals,
    display_name,
    github_username,
    discord_username,
    linkedin_url,
    portfolio_url,
    project_demo_url,
    project_github_url,
    twitter_url,
  } = form;
  const lastSavedAt = dayjs(profile.updated_at).isSame(dayjs(), 'day')
    ? dayjs(profile.updated_at).format('[at] h:mm a')
    : dayjs(profile.updated_at).format('MMM D, h:mm a');

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
      <div className="flex items-center justify-between px-4 sm:px-8">
        <Link
          className="rounded-md"
          href="/profile"
          variant="discord"
          size="sm"
          icon={<ArrowLeftIcon className="mr-2 h-4 w-4" />}
        >
          Back
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last saved {lastSavedAt}
          </span>
          <Button
            className="rounded-md"
            variant="secondary"
            size="sm"
            pending={isUpdating}
            icon={<CheckIcon className="mr-2 h-4 w-4" />}
            onClick={() => handleUpdateProfile()}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        <FadeIn>
          <div className="mb-4 mt-8 sm:mb-8 sm:mt-16">
            <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl">
              Edit Profile
            </h1>

            <form
              className="mb-16 flex flex-col gap-6"
              onSubmit={handleUpdateProfile}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="mb-1" htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    required
                    value={email}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <Label className="mb-1" htmlFor="github_username">
                    GitHub username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="github_username"
                    name="github_username"
                    disabled
                    value={github_username}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="mb-1" htmlFor="display_name">
                    Display name
                  </Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    placeholder="Jane O'Brien"
                    value={display_name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        display_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="mb-1" htmlFor="discord_username">
                    Discord username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="discord_username"
                    name="discord_username"
                    placeholder="jane123"
                    required
                    value={discord_username}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        discord_username: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1" htmlFor="bio">
                  About me <span className="text-red-500">*</span>
                </Label>
                <TextArea
                  id="bio"
                  name="bio"
                  required
                  rows={12}
                  placeholder="Tell us a bit about yourself..."
                  value={bio}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                />
              </div>
              <hr className="border border-gray-700" />
              <div>
                <Label className="mb-1" htmlFor="project_demo_url">
                  Project Demo URL
                </Label>
                <Input
                  id="project_demo_url"
                  name="project_demo_url"
                  placeholder="https://project.vercel.app"
                  value={project_demo_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      project_demo_url: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="mb-1" htmlFor="project_github_url">
                  Project GitHub URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="project_github_url"
                  name="project_github_url"
                  required
                  placeholder="https://github.com/janeo/project"
                  value={project_github_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      project_github_url: e.target.value,
                    }))
                  }
                />
              </div>
              <hr className="border border-gray-700" />
              <div>
                <Label className="mb-1" htmlFor="goals">
                  Goals
                </Label>
                <TextArea
                  id="goals"
                  name="goals"
                  rows={4}
                  placeholder="I want to get a job as a full-stack software engineer in X months..."
                  value={goals}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      goals: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="mb-1" htmlFor="portfolio_url">
                  Portfolio
                </Label>
                <Input
                  id="portfolio_url"
                  name="portfolio_url"
                  placeholder="https://www.janeo.me"
                  value={portfolio_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      portfolio_url: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="mb-1" htmlFor="twitter_url">
                  Twitter
                </Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  placeholder="https://twitter.com/janeo"
                  value={twitter_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      twitter_url: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="mb-1" htmlFor="linkedin_url">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/janeo"
                  value={linkedin_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      linkedin_url: e.target.value,
                    }))
                  }
                />
              </div>
              <hr className="border border-gray-700" />
              <div>
                <Button
                  className="w-full rounded-md"
                  size="lg"
                  variant="secondary"
                  pending={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update profile'}
                </Button>
              </div>
            </form>
          </div>
        </FadeIn>

        {!!debug && (
          <pre className="my-16 overflow-scroll rounded border border-gray-700 bg-black px-3 py-3 text-sm">
            <code className="whitespace-pre">
              {JSON.stringify(profile, null, 2)}
            </code>
          </pre>
        )}
      </div>

      <div className="flex items-center justify-between px-4 sm:px-8">
        <Link
          className="rounded-md"
          href="/profile"
          variant="discord"
          size="sm"
          icon={<ArrowLeftIcon className="mr-2 h-4 w-4" />}
        >
          Back
        </Link>

        <span className="text-sm text-gray-500">Last saved {lastSavedAt}</span>
      </div>
    </main>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const {isLoading, session, error} = useSessionContext();
  console.log('Authorization:', {isLoading, session, error});

  React.useEffect(() => {
    if (error) {
      console.error('Something went wrong:', error);
    }

    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [isLoading, session, error]);

  if (isLoading || !session || !!error) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Edit Profile</title>
        <meta name="description" content="Hacker Co-op edit profile" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <EditProfile session={session} />
    </div>
  );
}
