import axios from 'axios';
import Cookie from 'js-cookie';
import { shareConstants } from '../constants';
import { authHeader } from '../helpers';
import { baseBackEndApiURL, baseBackendURL } from './urlHelpers';

const shouldIntercept = (error) => {
  try {
    return error.response.status === 401;
  } catch (e) {
    return false;
  }
};

const setTokenData = (tokenData = {}, _axiosClient) => {
  // Back-end already sets the Cookies for 'smata.com' when user successfully logged in
  // However the following part is useful to debug Staging
  if (process && process.env.NODE_ENV === shareConstants.DEVELOPMENT_ENV_NAME) {
    Cookie.set('access_token', tokenData.access_token);
    Cookie.set('refresh_token', tokenData.refresh_token);
    Cookie.set('expires_at', tokenData.created_at + tokenData.expires_in);
  } else {
    Cookie.set('access_token', tokenData.access_token, { domain: shareConstants.DOMAIN });
    Cookie.set('refresh_token', tokenData.refresh_token, { domain: shareConstants.DOMAIN });
    Cookie.set('expires_at', tokenData.created_at + tokenData.expires_in, {
      domain: shareConstants.DOMAIN
    });
  }
};

const handleTokenRefresh = () => {
  const refreshToken = Cookie.get('refresh_token');
  return new Promise((resolve, reject) => {
    axios
      .post(`${baseBackendURL}/oauth/token`, {
        grant_type: 'refresh_token',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refreshToken
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          window.location.href = `${baseBackendURL}/logout`;
        }
        reject(err);
      });
  });
};

const attachTokenToRequest = (request, token) => {
  request.headers['Authorization'] = `Bearer ${token}`;
  // If there is an edge case where access token is also set in request query, this is also a nice place to add it
  // Example: /orders?token=xyz-old-token
};

const applyAppTokenRefreshInterceptor = (axiosClient, customOptions = {}) => {
  let isRefreshing = false;
  let failedQueue = [];

  const options = {
    attachTokenToRequest,
    handleTokenRefresh,
    setTokenData,
    shouldIntercept,
    ...customOptions
  };

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const interceptor = (error) => {
    if (!options.shouldIntercept(error)) {
      return Promise.reject(error);
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest._queued = true;
          options.attachTokenToRequest(originalRequest, token);
          return axiosClient(originalRequest);
        })
        .catch(
          (_err) => Promise.reject(error) // Ignore refresh token request's "err" and return actual "error" for the original request
        );
    }

    originalRequest._retry = true;
    isRefreshing = true;
    return new Promise((resolve, reject) => {
      options.handleTokenRefresh
        .call(options.handleTokenRefresh)
        .then((tokenData) => {
          options.setTokenData(tokenData, axiosClient);
          options.attachTokenToRequest(originalRequest, tokenData.accessToken);
          processQueue(null, tokenData.accessToken);
          resolve(axiosClient(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  };

  axiosClient.interceptors.response.use(null, interceptor);
};

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = baseBackEndApiURL;
    config.headers = authHeader();
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

applyAppTokenRefreshInterceptor(axiosInstance);

// CREDIT: https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f
// Intercept and refresh expired tokens for multiple requests (same implementation but with some abstractions)
//
// HOW TO USE:
// import applyAppTokenRefreshInterceptor from 'axios.refresh_token.2.js';
// import axios from 'axios';
// ...
// applyAppTokenRefreshInterceptor(axios); // register the interceptor with all axios instance
// ...
// - Alternatively:
// const apiClient = axios.create({baseUrl: 'example.com/api'});
// applyAppTokenRefreshInterceptor(apiClient); // register the interceptor with one specific axios instance
// ...
// - With custom options:
// applyAppTokenRefreshInterceptor(apiClient, {
//      shouldIntercept: (error) => {
//          return error.response.data.errorCode === 'EXPIRED_ACCESS_TOKEN';
//      }
// ); // register the interceptor with one specific axios instance
