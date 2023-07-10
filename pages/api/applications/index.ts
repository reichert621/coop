import type {NextApiRequest, NextApiResponse} from 'next';

import {supabase} from '@/utils/supabase/admin';
import {
  encodeSubmissionHash,
  isNonEmptyString,
  isValidEmail,
  isValidGithubUrl,
  isValidVercelUrl,
} from '@/utils/server';
import {parseErrorMessage, parseErrorStatus} from '@/utils/index';

type Data = any;

// Admin only endpoint
async function get(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(401).json({error: 'Access denied.'});
  }

  const {data, error} = await supabase
    .from('applications')
    .select()
    .order('created_at');
  console.log('[GET /api/applications] Supabase response:', {data, error});

  if (error) {
    return res.status(422).json({
      error: `Database error: ${error.message}`,
      metadata: error,
    });
  }

  const applications = data.map((record) => {
    return {...record, hash: encodeSubmissionHash(record)};
  });

  return res.status(200).json({applications});
}

async function post(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const params = {...req.query, ...req.body};
    const {
      email,
      discord_username,
      github_username,
      homework_staging_url,
      homework_github_url,
      project_proposal,
    } = params;

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({field: 'email', error: 'Invalid or missing email.'});
    } else if (!isNonEmptyString(discord_username)) {
      return res.status(400).json({
        field: 'discord_username',
        error: 'A Discord username is required.',
      });
    } else if (!isValidVercelUrl(homework_staging_url)) {
      return res.status(400).json({
        field: 'homework_staging_url',
        error: 'Invalid or missing homework URL.',
      });
    } else if (!isValidGithubUrl(homework_github_url)) {
      return res.status(400).json({
        field: 'homework_github_url',
        error: 'Invalid or missing homework Github URL.',
      });
    } else if (!isNonEmptyString(project_proposal)) {
      return res.status(400).json({
        field: 'project_proposal',
        error: 'A project proposal is required.',
      });
    }

    const {data, error} = await supabase
      .from('applications')
      .insert({
        email,
        discord_username,
        github_username,
        homework_staging_url,
        homework_github_url,
        project_proposal,
      })
      .select();

    console.log('[POST /api/applications] Supabase response:', {data, error});

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
    case 'POST':
      return post(req, res);
    default:
      return res
        .status(404)
        .json({status: 404, error: `Unsupported method ${req.method}`});
  }
}
