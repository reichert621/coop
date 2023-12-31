import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import axios from 'axios';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import {
  useSessionContext,
  Session,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';

import {formatTimeAgo, parseErrorMessage} from '@/utils';
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
import Spinner from '@/components/Spinner';

const parseTwitterHandle = (twitter: string) => {
  if (twitter.includes('twitter.com')) {
    const chunks = twitter.split('/');

    return chunks[chunks.length - 1];
  } else {
    return twitter;
  }
};

const parseGithubRepoUrl = (url: string, username: string) => {
  const chunks: string[] = url.split('/');
  const index = chunks.findIndex(
    (str) => str.toLowerCase() === username.toLowerCase()
  );

  if (index === -1) {
    return {owner: null, repo: null};
  }

  const owner = chunks[index];
  const repo = chunks[index + 1];

  return {owner, repo};
};

const tryFetchGithubRepoCommits = async (owner: string, repo: string) => {
  try {
    console.debug('Fetching commits for', `${owner}/${repo}`);
    const {data: commits} = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`
    );
    console.debug('Project commits:', commits);
    return commits;
  } catch (e) {
    console.error('Failed to fetch commits:', e);
    return [];
  }
};

const MemberProfile = ({
  session,
  username,
}: {
  session: Session;
  username: string;
}) => {
  const {user} = session;
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isLoading, setLoadingState] = React.useState(true);
  const [profile, setMemberProfile] = React.useState<Record<any, any>>({});
  const [projectCommits, setProjectCommits] = React.useState<any[]>([]);
  const [error, setErrorMessage] = React.useState<string | null>(null);
  const debug = !!Number(router.query.debug);

  React.useEffect(() => {
    const init = async () => {
      try {
        const {
          data: {member},
        } = await axios.get(`/api/members/${username}`);
        setMemberProfile(member);
        const {
          github_username: githubUsername,
          project_github_url: projectGithubUrl,
        } = member;

        if (!githubUsername || !projectGithubUrl) {
          return;
        }

        const {owner, repo} = parseGithubRepoUrl(
          projectGithubUrl,
          githubUsername
        );

        if (!owner || !repo) {
          return;
        }

        const commits = await tryFetchGithubRepoCommits(owner, repo);
        setProjectCommits(commits);
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
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-gray-900 p-8 text-gray-300">
        <FadeIn delay={400}>
          <Spinner className="h-8 w-8" />
        </FadeIn>
      </div>
    );
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
    has_public_email: hasPublicEmail,
  } = profile;
  // Commits are already sorted by most recent
  const [latest] = projectCommits.filter((commit) => {
    const username = commit?.author?.login;

    if (!username) {
      return true; // Allow null authors
    }

    return username.toLowerCase() === githubUsername.toLowerCase();
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          className="rounded-md"
          href="/dashboard"
          variant="secondary"
          size="sm"
          icon={<ArrowLeftIcon className="mr-2 h-4 w-4" />}
        >
          Back
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
      <FadeIn>
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <div className="mb-4 mt-8 sm:mb-8 sm:mt-16">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              {displayName || githubUsername}
            </h1>

            {hasPublicEmail && email && (
              <div className="mt-1">
                <a className="text-lg text-gray-300">{email}</a>
              </div>
            )}

            <div className="mb-6 mt-2 flex items-center gap-2">
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
                {!!latest?.commit?.author?.date && (
                  <div className="mt-1 text-sm text-gray-400">
                    Last commit:{' '}
                    <span className="font-medium text-gray-300">
                      {formatTimeAgo(latest.commit.author.date)}
                    </span>
                  </div>
                )}
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
  const username = router.query.username as string;

  React.useEffect(() => {
    if (error) {
      console.error('Something went wrong:', error);
    }

    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [isLoading, session, error]);

  if (isLoading || !username || !session || !!error) {
    return (
      <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-gray-900 p-8 text-gray-300">
        <FadeIn delay={400}>
          <Spinner className="h-8 w-8" />
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | {username}</title>
        <meta name="description" content="Hacker Co-op profile" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <MemberProfile session={session} username={username} />
    </div>
  );
}
