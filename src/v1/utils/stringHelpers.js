/**
 * Removes dollar and whitespace characters of the input param
 */
export const stripInput = (value) => {
  if (value || typeof value === 'number') {
    return value.toString().replace(/[$,\s]/g, '');
  }
};

export const humanize = (str) => {
  if (!str) return '';

  let i;
  const frags = str.split('_');

  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
};

export const currencyFormat = (val, currency = 'USD') => {
  const input = isNaN(val) ? 0 : val;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(input);
};

export const getFileExtension = (filename) =>
  filename?.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
export const filenameWithoutExtension = (filename) =>
  filename?.substring(0, filename.lastIndexOf('.') - 1) || filename;

/**
 * Credit: https://stackoverflow.com/a/14919494/6894749
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const humanizeFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return `${bytes.toFixed(dp)} ${units[u]}`;
};

// Credit: https://stackoverflow.com/a/31615643/6894749
export const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = parseInt(n, 10) % 100;

  return s[(v - 20) % 10] || s[v] || s[0];
};
