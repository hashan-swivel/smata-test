export const autoDownloadLink = (file, filename) => {
  const url = URL.createObjectURL(new Blob([file]));
  const fakeLink = document.createElement('a');
  fakeLink.href = url;
  fakeLink.download = filename;
  // Download the file automatically
  fakeLink.click();
  URL.revokeObjectURL(url);
};
