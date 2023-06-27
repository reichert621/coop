import type {NextApiRequest, NextApiResponse} from 'next';

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(200).json({message: 'Pong!'});
}
