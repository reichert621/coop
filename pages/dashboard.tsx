import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {
  useSupabaseClient,
  useUser,
  useSessionContext,
} from '@supabase/auth-helpers-react';

import FadeIn from '@/components/FadeIn';
import {Button, Link} from '@/components/Button';

export default function Dashboard() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await router.push('/login');
  };

  if (isLoading || !session || !!error) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op | Dashboard</title>
        <meta name="description" content="Hacker Co-op dashboard" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-4">
        <div className="flex items-center justify-end px-4 sm:px-8">
          <Button
            className="rounded-md"
            variant="discord"
            size="sm"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
          <div className="mb-4 mt-8 sm:mb-8 sm:mt-16">
            <h1 className="mb-8 text-center text-4xl font-extrabold text-white sm:text-5xl">
              Dashboard
            </h1>

            {user && (
              <FadeIn>
                <pre className="overflow-scroll rounded border border-gray-700 bg-black px-3 py-3 text-sm">
                  <code className="whitespace-pre">
                    {JSON.stringify(user, null, 2)}
                  </code>
                </pre>
              </FadeIn>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
