import type {NextApiRequest, NextApiResponse} from 'next';
import {User, createPagesServerClient} from '@supabase/auth-helpers-nextjs';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getSupabaseUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> => {
  const client = createPagesServerClient({
    req,
    res,
  });
  const {
    data: {user},
  } = await client.auth.getUser();

  return user;
};

export const findMemberByUser = async (user: User) => {
  const {error, data} = await supabase
    .from('members')
    .select()
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.warn('Supabase error:', error);
  }

  return data ?? null;
};

export const findApplicationByUsername = async (username: string) => {
  const {error, data} = await supabase
    .from('applications')
    .select()
    .eq('github_username', username)
    .single();

  if (error) {
    console.warn('Supabase error:', error);
  }

  return data ?? null;
};

export const createNewMember = async (user: User) => {
  const metadata = user.user_metadata ?? {};
  const username = metadata.user_name;

  if (!username) {
    throw new Error(`User ${user.id} is missing a github username!`);
  }

  const application = await findApplicationByUsername(username);
  const {error, data} = await supabase
    .from('members')
    .insert({
      user_id: user.id,
      email: user.email,
      display_name: metadata.name,
      github_username: username,
      discord_username: application?.discord_username,
      application_id: application?.id,
    })
    .select();

  if (error) {
    console.warn('Supabase error:', error);
  }

  return data?.[0] ?? null;
};

export const findOrCreateMemberByUser = async (user: User) => {
  const member = await findMemberByUser(user);

  if (member) {
    return member;
  } else {
    return createNewMember(user);
  }
};

// TODO: test this client-side with RLS
export const updateMemberById = async (
  userId: string,
  updates: Record<string, any> = {}
) => {
  const {
    bio,
    goals,
    display_name,
    discord_username,
    linkedin_url,
    portfolio_url,
    project_demo_url,
    project_github_url,
    twitter_url,
  } = updates;
  const {error, data} = await supabase
    .from('members')
    .update({
      bio,
      goals,
      display_name,
      discord_username,
      linkedin_url,
      portfolio_url,
      project_demo_url,
      project_github_url,
      twitter_url,
      updated_at: new Date(),
    })
    .eq('user_id', userId)
    .select();

  if (error) {
    console.warn('Supabase error:', error);
  }

  return data?.[0] ?? null;
};
