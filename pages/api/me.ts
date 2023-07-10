import {createPagesServerClient} from '@supabase/auth-helpers-nextjs';
import type {NextApiRequest, NextApiResponse} from 'next';

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabaseServerClient = createPagesServerClient({
    req,
    res,
  });
  const {
    data: {user},
  } = await supabaseServerClient.auth.getUser();

  return res.status(200).json({user});
}
