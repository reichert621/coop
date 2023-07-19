import dayjs from 'dayjs';

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const parseErrorStatus = (err: any) => {
  return (
    err.status || err.response?.status || err.response?.data?.status || 500
  );
};

export const parseErrorMessage = (err: any) => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.response?.data?.error_description ||
    err.message ||
    String(err) ||
    err
  );
};

export const formatTimeAgo = (timestamp: any) => {
  const now = dayjs();
  const seconds = now.diff(dayjs(timestamp), 'seconds');
  const minutes = now.diff(dayjs(timestamp), 'minutes');
  const hours = now.diff(dayjs(timestamp), 'hours');
  // Round up for days
  const days = Math.round(now.diff(dayjs(timestamp), 'days', true));

  if (seconds < 10) {
    return 'a few seconds ago';
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return dayjs(timestamp).format('MMMM D [at] h:mm A');
  }
};
