if (process.env.REACT_APP_BUILD_DATE === undefined) {
  throw new Error('process.env.REACT_APP_BUILD_DATE is not defined');
}

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_DATA_DONATION_FLUSH_INTERVAL: process.env.REACT_APP_DATA_DONATION_FLUSH_INTERVAL,
  REACT_APP_LOGGER: process.env.REACT_APP_LOGGER,
  REACT_APP_WEB_URL: process.env.REACT_APP_WEB_URL,
  REACT_APP_BUILD_DATE: process.env.REACT_APP_BUILD_DATE,
  REACT_APP_VERSION: process.env.REACT_APP_VERSION,
};