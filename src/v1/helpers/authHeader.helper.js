import Cookie from 'js-cookie';

export function authHeader(overrides = {}) {
  const accessToken = Cookie.get('access_token');
  const defaultHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  let authorization = {};

  if (accessToken) {
    authorization = { 'Authorization': `Bearer ${accessToken}` };
  }

  return { ...defaultHeaders, ...authorization, ...overrides };
}
