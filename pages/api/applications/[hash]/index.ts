import type {NextApiRequest, NextApiResponse} from 'next';

import {supabase} from '@/utils/supabase/admin';
import {encodeSubmissionHash, decodeSubmissionHash} from '@/utils/server';
import {parseErrorMessage, parseErrorStatus} from '@/utils/index';

type Data = any;

async function get(req: NextApiRequest, res: NextApiResponse<Data>) {
  const hash = (req.query.hash || req.query.h) as string;
  const filter = hash ? decodeSubmissionHash(hash) : null;

  if (!filter) {
    return res.status(401).json({error: 'Access denied.'});
  }

  const {id, email, updated_at} = filter;
  const {data, error} = await supabase
    .from('applications')
    .select()
    .eq('id', id)
    .eq('email', email)
    .eq('updated_at', updated_at);

  console.log('[GET /api/applications/:hash] Supabase response:', {
    data,
    error,
  });

  if (error) {
    return res.status(422).json({
      error: `Database error: ${error.message}`,
      metadata: error,
    });
  }

  const [record = null] = data;

  return res.status(200).json({application: record});
}

async function put(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const params = {...req.query, ...req.body};
    const {
      hash,
      discord_username,
      github_username,
      homework_staging_url,
      homework_github_url,
      project_proposal,
    } = params;
    const filter = hash ? decodeSubmissionHash(hash) : null;

    if (!filter) {
      return res.status(401).json({error: 'Access denied.'});
    }

    const {id, email, updated_at} = filter;
    console.log('[PUT /api/applications/:hash] Updating:', {
      filter,
      discord_username,
      github_username,
      homework_staging_url,
      homework_github_url,
      project_proposal,
    });
    const {data, error} = await supabase
      .from('applications')
      .update({
        discord_username,
        github_username,
        homework_staging_url,
        homework_github_url,
        project_proposal,
        updated_at: new Date(),
      })
      .eq('id', id)
      .eq('email', email)
      .eq('updated_at', updated_at)
      .select();

    console.log('[PUT /api/applications/:hash] Supabase response:', {
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
    case 'GET':
      return get(req, res);
    case 'PUT':
      return put(req, res);
    default:
      return res
        .status(404)
        .json({status: 404, error: `Unsupported method ${req.method}`});
  }
}
