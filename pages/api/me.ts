import type {NextApiRequest, NextApiResponse} from 'next';

import {
  findOrCreateMemberByUser,
  getSupabaseUser,
  updateMemberById,
} from '@/utils/supabase/admin';
import {parseErrorMessage, parseErrorStatus} from '@/utils';

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
