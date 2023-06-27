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
