/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseBackEndApiURL, baseBackendURL, shareConstants } from '@/constants/sharedConstants';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie';

function authHeader(overrides = {}) {
  const accessToken = Cookie.get('access_token');
  const defaultHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };
  let authorization = {};

  if (accessToken) {
    authorization = { Authorization: `Bearer ${accessToken}` };
  }

  return { ...defaultHeaders, ...authorization, ...overrides };
}

type TokenData = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  created_at: number;
  expires_in: number;
};

interface AppTokenRefreshOptions {
  attachTokenToRequest: (request: AxiosRequestConfig, token: string) => void;
  handleTokenRefresh: () => Promise<TokenData>;
  setTokenData: (tokenData: TokenData) => void;
  shouldIntercept: (error: any) => boolean;
}

const shouldIntercept = (error: any): boolean => {
  try {
    return error.response.status === 401;
  } catch (e) {
    return false;
  }
};

const setTokenData = (tokenData: TokenData): void => {
  if (process && process.env.NODE_ENV === shareConstants.DEVELOPMENT_ENV_NAME) {
    Cookie.set('access_token', tokenData.access_token);
    Cookie.set('refresh_token', tokenData.refresh_token);
    Cookie.set('expires_at', String(tokenData.created_at + tokenData.expires_in));
  } else {
    Cookie.set('access_token', tokenData.access_token, { domain: shareConstants.DOMAIN });
    Cookie.set('refresh_token', tokenData.refresh_token, { domain: shareConstants.DOMAIN });
    Cookie.set('expires_at', String(tokenData.created_at + tokenData.expires_in), {
      domain: shareConstants.DOMAIN
    });
  }
};

const handleTokenRefresh = (): Promise<TokenData> => {
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

const attachTokenToRequest = (request: AxiosRequestConfig, token: string): void => {
  request.headers['Authorization'] = `Bearer ${token}`;
};

const applyAppTokenRefreshInterceptor = (axiosClient: AxiosInstance): void => {
  let isRefreshing = false;
  let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

  const options: AppTokenRefreshOptions = {
    attachTokenToRequest,
    handleTokenRefresh,
    setTokenData,
    shouldIntercept
  };

  const processQueue = (error: any, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const interceptor = async (error: any): Promise<any> => {
    if (!options.shouldIntercept(error)) {
      return Promise.reject(error);
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as AxiosRequestConfig;

    if (isRefreshing) {
      try {
        const token = await new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        });
        // originalRequest. = true;
        options.attachTokenToRequest(originalRequest, token as string);
        return await axiosClient(originalRequest);
      } catch {
        return await Promise.reject(error); // Ignore refresh token request's "err" and return actual "error" for the original request
      }
    }

    // originalRequest._retry = true;
    isRefreshing = true;
    return new Promise((resolve, reject) => {
      options.handleTokenRefresh
        .call(options.handleTokenRefresh)
        .then((tokenData) => {
          options.setTokenData(tokenData);
          options.attachTokenToRequest(originalRequest, tokenData.access_token);
          processQueue(null, tokenData.access_token);
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

  axiosClient.interceptors.response.use(undefined, interceptor);
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
