import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';
import {PencilIcon} from '@heroicons/react/24/solid';
import {
  useSessionContext,
  Session,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';

import {parseErrorMessage} from '@/utils';
import toaster from '@/utils/toaster';
import FadeIn from '@/components/FadeIn';
import {A, Button, Link} from '@/components/Button';
import {
  DiscordIcon,
  GithubIcon,
  TwitterIcon,
  VercelIcon,
} from '@/components/Icons';
import {Label} from '@/components/Input';

const parseTwitterHandle = (twitter: string) => {
  if (twitter.includes('twitter.com')) {
    const chunks = twitter.split('/');

    return chunks[chunks.length - 1];
  } else {
    return twitter;
  }
};

const Profile = ({session}: {session: Session}) => {
  const {user} = session;
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isLoading, setLoadingState] = React.useState(true);
  const [profile, setUserProfile] = React.useState<Record<any, any>>({});
  const [error, setErrorMessage] = React.useState<string | null>(null);
  const debug = !!Number(router.query.debug);

  React.useEffect(() => {
    const init = async () => {
      try {
        const {
          data: {user},
        } = await axios.get(`/api/me`);
        setUserProfile(user);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await router.push('/login');
  };

  if (isLoading || !profile || !!error) {
    return null;
  }

  const {
    id,
    email,
    bio,
    goals,
    display_name: displayName,
    github_username: githubUsername,
    discord_username: discordUsername,
    linkedin_url: linkedinUrl,
    portfolio_url: portfolioUrl,
    project_demo_url: projectDemoUrl,
    project_github_url: projectGithubUrl,
    twitter_url: twitterUrl,
  } = profile;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
      <div className="flex items-center justify-end px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md"
            href="/profile/edit"
            variant="secondary"
            size="sm"
            icon={<PencilIcon className="mr-2 h-4 w-4" />}
          >
            Edit Profile
          </Link>
          <Button
            className="rounded-md"
            variant="discord"
            size="sm"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>
      <FadeIn>
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <div className="mb-4 mt-8 sm:mb-8 sm:mt-16">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              {displayName || githubUsername}
            </h1>

            <div className="mb-2 mt-1">
              <a className="text-lg text-gray-300">{email}</a>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <a
                className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm hover:bg-gray-600"
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                {githubUsername}
              </a>
              {discordUsername && (
                <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm">
                  <DiscordIcon className="mr-2 h-4 w-4" />
                  {discordUsername}
                </span>
              )}
              {!!twitterUrl && (
                <a
                  className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm hover:bg-gray-600"
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon className="mr-2 h-4 w-4" />
                  {parseTwitterHandle(twitterUrl)}
                </a>
              )}
            </div>

            <div className="rounded border border-gray-700 bg-gray-800 p-4">
              <div className="">
                <Label className="mb-2 text-gray-400">About me</Label>
                {bio ? (
                  <p className="whitespace-break-spaces text-base text-gray-300">
                    {bio}
                  </p>
                ) : (
                  <p className="text-base text-gray-500">Nothing here yet</p>
                )}
              </div>
              <hr className="my-6 border-t border-gray-700" />
              <div className="">
                <Label className="mb-2 text-gray-400">Current project</Label>
                <div className="flex items-center gap-2">
                  {!!projectDemoUrl && (
                    <A
                      href={projectDemoUrl}
                      className="rounded-md"
                      variant="discord"
                      size="sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<VercelIcon className="mr-2 h-4 w-4" />}
                    >
                      Demo
                    </A>
                  )}
                  {!!projectGithubUrl && (
                    <A
                      href={projectGithubUrl}
                      className="rounded-md"
                      variant="discord"
                      size="sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<GithubIcon className="mr-2 h-4 w-4" />}
                    >
                      GitHub Repository
                    </A>
                  )}
                  {!projectDemoUrl && !projectGithubUrl && (
                    <p className="text-base text-gray-500">No project found</p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Label className="mb-2 text-gray-400">Goals</Label>
                {goals ? (
                  <p className="whitespace-break-spaces text-base text-gray-300">
                    {goals}
                  </p>
                ) : (
                  <p className="text-base text-gray-500">No goals listed yet</p>
                )}
              </div>
              {(!!portfolioUrl || !!linkedinUrl) && (
                <hr className="my-6 border-t border-gray-700" />
              )}
              {!!portfolioUrl && (
                <div className="">
                  <Label className="mb-2 text-gray-400">Portfolio</Label>
                  <a
                    href={portfolioUrl}
                    className="text-gray-300 underline hover:text-gray-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {portfolioUrl}
                  </a>
                </div>
              )}
              {!!linkedinUrl && (
                <div className="mt-6">
                  <Label className="mb-2 text-gray-400">LinkedIn</Label>
                  <a
                    href={linkedinUrl}
                    className="text-gray-300 underline hover:text-gray-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkedinUrl}
                  </a>
                </div>
              )}
            </div>

            {!bio && !projectGithubUrl && (
              <div className="mt-8">
                <Link
                  className="w-full rounded-md"
                  href="/profile/edit"
                  size="lg"
                  variant="secondary"
                >
                  Set up profile
                </Link>
              </div>
            )}
          </div>

          {!!debug && (
            <pre className="my-16 overflow-scroll rounded border border-gray-700 bg-black px-3 py-3 text-sm">
              <code className="whitespace-pre">
                {JSON.stringify(profile, null, 2)}
              </code>
            </pre>
          )}
        </div>
      </FadeIn>
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
        <title>The Hacker Co-op | Profile</title>
        <meta name="description" content="Hacker Co-op profile" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Profile session={session} />
    </div>
  );
}
