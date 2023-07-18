import {NextPage} from 'next';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import {useSupabaseClient, useUser} from '@supabase/auth-helpers-react';

import {Button} from '@/components/Button';
import FadeIn from '@/components/FadeIn';

const RegisterPage: NextPage = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isSigningIn, setSigningInState] = React.useState(false);
  const [error, setErrorMessage] = React.useState<string | null>(null);

  const logInWithGithub = async () => {
    try {
      setSigningInState(true);

      const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {redirectTo: `${window.location.origin}/profile`},
      });

      console.log('Logging in:', data);
      console.log('Redirecting to:', `${window.location.origin}/profile`);

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err: any) {
      console.error('Failed to register with github:', err);
      setErrorMessage(err.message || String(err) || 'Something went wrong!');
    } finally {
      setSigningInState(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>The Hacker Co-op - Log in</title>
      </Head>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8">
        <div className="mb-24 mt-8 w-full">
          {!!error && (
            <div className="font-medum mb-2 rounded border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-500">
              {error}
            </div>
          )}

          <FadeIn>
            <>
              <div className="w-full rounded border-t-2 border-indigo-500 bg-gray-800 px-4 pb-4 pt-6 shadow-lg">
                <div className="mb-4 border-b border-gray-700 pb-4">
                  <h1 className="mb-1 text-4xl font-semibold text-white">
                    Welcome back!
                  </h1>
                  <p className="text-sm text-gray-400">
                    Sign in to your account below.
                  </p>
                </div>

                <Button
                  className={'w-full rounded'}
                  variant="secondary"
                  disabled={isSigningIn}
                  onClick={logInWithGithub}
                >
                  <img
                    className="mr-2 h-4"
                    alt="GitHub logo"
                    src="/github-logo.svg"
                  />
                  <span>Sign in with GitHub</span>
                </Button>
              </div>
              <div className="mt-4 text-center">
                <Link
                  className="text-base text-gray-500 underline hover:text-gray-300"
                  href="/"
                >
                  Back to home page
                </Link>
              </div>
            </>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
