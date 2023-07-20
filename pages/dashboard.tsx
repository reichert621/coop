import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import axios from 'axios';
import {
  useSupabaseClient,
  useSessionContext,
  Session,
} from '@supabase/auth-helpers-react';
import {
  UserIcon,
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

import {parseErrorMessage} from '@/utils';
import toaster from '@/utils/toaster';
import FadeIn from '@/components/FadeIn';
import {Button, Link} from '@/components/Button';
import Spinner from '@/components/Spinner';
import {DiscordIcon, GithubIcon} from '@/components/Icons';
import Alert from '@/components/Alert';

const isActiveMember = (member: any) => {
  return !!(member && member.bio && member.project_github_url);
};

const MemberCard = ({
  member,
  isCurrentUser,
}: {
  member: any;
  isCurrentUser?: boolean;
}) => {
  const {
    display_name: displayName,
    github_username: githubUsername,
    discord_username: discordUsername,
  } = member;
  const hasIncompleteProfile = !isActiveMember(member);

  return (
    <div
      className={`${hasIncompleteProfile ? 'opacity-60' : 'opacity-100'} ${
        isCurrentUser
          ? 'border-indigo-500 hover:border-indigo-400'
          : 'border-gray-700 hover:border-gray-600'
      } rounded-r border-l-2 bg-gray-800 px-4 py-3 transition-colors`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <NextLink
            className="text-lg font-bold text-gray-100 hover:text-white"
            href={isCurrentUser ? '/profile' : `/members/${githubUsername}`}
          >
            {displayName || githubUsername}
          </NextLink>
          <div className="flex items-center gap-2">
            <a
              className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm hover:bg-gray-600"
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="mr-2 h-4 w-4" />
              {githubUsername}
            </a>
            {!!discordUsername && (
              <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-sm">
                <DiscordIcon className="mr-2 h-4 w-4" />
                {discordUsername}
              </span>
            )}
          </div>
        </div>

        <Link
          className="group rounded-full p-1"
          href={isCurrentUser ? '/profile' : `/members/${githubUsername}`}
          size="icon"
          variant={isCurrentUser ? 'primary' : 'discord'}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const Dashboard = ({session}: {session: Session}) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isLoading, setLoadingState] = React.useState(true);
  const [members, setMembers] = React.useState<any[]>([]);
  const [error, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        const {
          data: {members = []},
        } = await axios.get(`/api/members`);
        setMembers(members);
      } catch (err) {
        const message = parseErrorMessage(err);
        console.error('Failed to fetch profile:', message);
        toaster.error(message);
      } finally {
        setLoadingState(false);
      }
    };

    init();
  }, [session.user.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await router.push('/login');
  };

  if (isLoading || !!error) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-gray-900 p-8 text-gray-300">
        <FadeIn delay={400}>
          <Spinner className="h-8 w-8" />
        </FadeIn>
      </div>
    );
  }

  const me = members.find((m) => m.user_id === session.user.id);
  const others = members.filter((m) => m.user_id !== session.user.id);
  const active = others.filter((m) => isActiveMember(m));
  const pending = members.filter((m) => !isActiveMember(m));
  const isMissingProfile = !me || !me.bio || !me.project_github_url;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
      <div className="flex items-center justify-end px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md"
            href="/profile"
            variant="secondary"
            size="sm"
            icon={<UserIcon className="mr-2 h-4 w-4" />}
          >
            View Profile
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
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        <div className="mb-4 mt-8 sm:mb-8 sm:mt-16">
          {isMissingProfile && (
            <FadeIn direction="left">
              <Alert
                className="mb-6"
                type="success"
                icon={<InformationCircleIcon className="mr-3 h-6 w-6" />}
                title="Finish setting up your profile"
                description="Your profile is still missing some important information."
                cta={
                  <Link
                    className="rounded-md"
                    size="sm"
                    variant="secondary"
                    href="/profile"
                  >
                    View profile
                  </Link>
                }
              />
            </FadeIn>
          )}

          <FadeIn>
            <div>
              <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl">
                Cohort #1
              </h1>

              <section className="mb-8">
                <h2 className="mb-4 mt-8 border-b border-gray-700 pb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                  You
                </h2>
                <div>
                  <MemberCard member={me} isCurrentUser />
                </div>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 mt-8 border-b border-gray-700 pb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                  Active ({active.length})
                </h2>
                <div className="space-y-3">
                  {active.map((member: any) => {
                    return <MemberCard key={member.id} member={member} />;
                  })}
                </div>
              </section>
              <section className="mb-8">
                <h2 className="mb-4 mt-8 border-b border-gray-700 pb-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                  Pending ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map((member: any) => {
                    return <MemberCard key={member.id} member={member} />;
                  })}
                </div>
              </section>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
};

export default function DashboardPage() {
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
        <title>The Hacker Co-op | Dashboard</title>
        <meta name="description" content="Hacker Co-op dashboard" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Dashboard session={session} />
    </div>
  );
}
