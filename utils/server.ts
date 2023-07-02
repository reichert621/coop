export const isNonEmptyString = (str?: string): str is string => {
  if (!str) {
    return false;
  }

  return str.trim().length > 0;
};

export const isValidEmail = (email?: string) => {
  if (!isNonEmptyString(email)) {
    return false;
  }
  // Simple email regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

export const isValidGithubUrl = (url?: string) => {
  try {
    if (!url) {
      return false;
    }

    const formatted = url.startsWith('http') ? url : `https://${url}`;
    const {hostname} = new URL(formatted);

    return hostname === 'github.com' || hostname.includes('.github.com');
  } catch (e) {
    return false;
  }
};

export const isValidVercelUrl = (url?: string) => {
  try {
    if (!url) {
      return false;
    }

    const formatted = url.startsWith('http') ? url : `https://${url}`;
    const {hostname} = new URL(formatted);

    return hostname.includes('.vercel.app');
  } catch (e) {
    return false;
  }
};

export const encodeSubmissionHash = (submission: any) => {
  const {id, email, updated_at} = submission;
  const str = JSON.stringify({id, email, updated_at});
  const buffer = Buffer.from(str);
  const data = buffer.toString('base64');

  return data;
};

export const decodeSubmissionHash = (str: string) => {
  try {
    const buffer = Buffer.from(str, 'base64');
    const data = buffer.toString('ascii');

    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};
