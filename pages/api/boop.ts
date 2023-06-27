import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import Cors from 'cors';

import {parseErrorMessage, parseErrorStatus} from '@/utils/index';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
async function middleware(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse<any>,
    cb: (data: any) => any
  ) => any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await middleware(req, res, cors);

    const params = {...req.query, ...req.body};
    const {content} = params;

    if (!content) {
      return res.status(400).json({error: 'Missing `content` field.'});
    }

    const response = await axios.post(DISCORD_WEBHOOK_URL, {content});

    return res.status(200).json({
      status: response.status,
      message: content,
      channel:
        'https://discord.com/channels/1122935602271223838/1123062270998630440',
    });
  } catch (err) {
    const status = parseErrorStatus(err);
    const message = parseErrorMessage(err);

    return res.status(status).json({status, message});
  }
}
