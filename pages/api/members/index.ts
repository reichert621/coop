import type {NextApiRequest, NextApiResponse} from 'next';

import {
  findOrCreateMemberByUser,
  getSupabaseUser,
  supabase,
} from '@/utils/supabase/admin';
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

    const {data, error} = await supabase.from('members').select();

    if (error) {
      console.warn('Supabase error:', error);
    }

    return res.status(200).json({members: data});
  } catch (err) {
    const status = parseErrorStatus(err);
    const message = parseErrorMessage(err);

    return res.status(status).json({status, message});
  }
}

async function sync(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const user = await getSupabaseUser(req, res);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized.',
      });
    }

    const {data, error} = await supabase.auth.admin.listUsers();
    const {users = []} = data;
    const members = await Promise.all(
      users.map((u) => findOrCreateMemberByUser(u))
    );

    return res.status(200).json({members});
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
