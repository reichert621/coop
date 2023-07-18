import {User, createPagesServerClient} from '@supabase/auth-helpers-nextjs';
import type {NextApiRequest, NextApiResponse} from 'next';

import {supabase} from '@/utils/supabase/admin';
import {parseErrorMessage, parseErrorStatus} from '@/utils';

const getSupabaseUser = async (
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

const findMemberByUser = async (user: User) => {
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

const findApplicationByUsername = async (username: string) => {
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

const createNewMember = async (user: User) => {
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

const findOrCreateMemberByUser = async (user: User) => {
  const member = await findMemberByUser(user);

  if (member) {
    return member;
  } else {
    return createNewMember(user);
  }
};

// TODO: test this client-side with RLS
const updateMemberById = async (
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

type Data = any;

async function get(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const user = await getSupabaseUser(req, res);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized.',
      });
    }

    const member = await findOrCreateMemberByUser(user);

    return res.status(200).json({user: member});
  } catch (err) {
    const status = parseErrorStatus(err);
    const message = parseErrorMessage(err);

    return res.status(status).json({status, message});
  }
}

async function post(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const user = await getSupabaseUser(req, res);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized.',
      });
    }

    const params = req.body;
    const {id: userId} = user;
    // const member = await findOrCreateMemberByUser(user); // FIXME
    const member = await updateMemberById(userId, params);

    return res.status(200).json({user: member});
  } catch (err) {
    const status = parseErrorStatus(err);
    const message = parseErrorMessage(err);

    return res.status(status).json({status, message});
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return get(req, res);
    case 'POST':
      return post(req, res);
    default:
      return res
        .status(404)
        .json({status: 404, error: `Unsupported method ${req.method}`});
  }
}
