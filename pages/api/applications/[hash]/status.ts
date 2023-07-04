import type {NextApiRequest, NextApiResponse} from 'next';

import {supabase} from '@/utils/supabase';
import {encodeSubmissionHash, decodeSubmissionHash} from '@/utils/server';
import {parseErrorMessage, parseErrorStatus} from '@/utils/index';

type Data = any;

const isValidStatus = (status: string) => {
  switch (status) {
    case 'pending':
    case 'reviewing':
    case 'rejected':
    case 'accepted':
      return true;
    default:
      return false;
  }
};

async function post(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(401).json({error: 'Access denied.'});
    }

    const params = {...req.query, ...req.body};
    const {hash: id, status} = params;

    if (!id) {
      return res.status(401).json({error: 'Access denied.'});
    } else if (!status || !isValidStatus(status)) {
      return res.status(400).json({error: 'A valid status is required.'});
    }

    console.log('[PUT /api/applications/:hash/status] Updating:', {
      id,
      status,
    });
    const {data, error} = await supabase
      .from('applications')
      .update({status})
      .eq('id', id)
      .select();

    console.log('[PUT /api/applications/:hash/status] Supabase response:', {
      data,
      error,
    });

    if (error) {
      return res.status(422).json({
        error: `Database error: ${error.message}`,
        metadata: error,
      });
    }

    const [record] = data;

    return res
      .status(200)
      .json({application: {...record, hash: encodeSubmissionHash(record)}});
  } catch (err: any) {
    const status = parseErrorStatus(err);
    const message = parseErrorMessage(err);

    return res.status(status || 500).json({error: message});
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
    case 'PUT':
      return post(req, res);
    default:
      return res
        .status(404)
        .json({status: 404, error: `Unsupported method ${req.method}`});
  }
}
