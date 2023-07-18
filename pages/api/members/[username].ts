import type {NextApiRequest, NextApiResponse} from 'next';

import {getSupabaseUser, supabase} from '@/utils/supabase/admin';
import {parseErrorMessage, parseErrorStatus} from '@/utils/index';

type Data = any;

async function get(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const user = await getSupabaseUser(req, res);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized.',
      });
    }

    const githubUsername = req.query.username;
    const {data, error} = await supabase
      .from('members')
      .select()
      .eq('github_username', githubUsername)
      .single();

    if (error) {
      console.warn('Supabase error:', error);
    }

    return res.status(200).json({member: data});
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
    default:
      return res
        .status(404)
        .json({status: 404, error: `Unsupported method ${req.method}`});
  }
}
