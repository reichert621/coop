import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

const parseErrorStatus = (err: any) => {
  return (
    err.status || err.response?.status || err.response?.data?.status || 500
  );
};

const parseErrorMessage = (err: any) => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.response?.data?.error_description ||
    err.message ||
    String(err) ||
    err
  );
};

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const params = {...req.query, ...req.body};
    const {content} = params;

    if (!content) {
      return res.status(400).json({error: 'Missing `content` field.'});
    }

    const response = await axios.post(DISCORD_WEBHOOK_URL, {content});

    return res.status(200).json({status: response.status, message: content});
  } catch (err) {
    const status = parseErrorStatus(err);
    const message = parseErrorMessage(err);

    return res.status(status).json({status, message});
  }
}
