export const setCachedSubmissionHash = (value: string) => {
  try {
    localStorage.setItem('__hackercoop:hash', value);
  } catch (e) {
    console.error('Failed to set hash in cache:', e);
  }
};

export const getCachedSubmissionHash = () => {
  try {
    return localStorage.getItem('__hackercoop:hash');
  } catch (e) {
    return null;
  }
};

export const clearCachedSubmissionHash = () => {
  try {
    return localStorage.removeItem('__hackercoop:hash');
  } catch (e) {
    return null;
  }
};
