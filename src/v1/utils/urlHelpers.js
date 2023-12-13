const getSubdomain = () => {
  if (typeof window !== 'undefined') {
    const subdomains = window.location.hostname.split('.');

    if (subdomains.length <= process.env.TLD_LENGTH) {
      return null;
    }

    return subdomains[0];
  }

  return null;
};

export const baseBackEndUrlWithSubdomain = () => {
  const subdomain = getSubdomain();

  if (subdomain !== null) {
    const { protocol, host } = new URL(baseBackendURL);
    return `${protocol}//${subdomain}.${host}`;
  }

  return baseBackendURL;
};

export const baseBackendURL = process.env.BASE_URL;

export const baseBackEndApiURL = `${baseBackendURL}/api`;
