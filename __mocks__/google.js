// <rootDir>/__mocks__/google.js
module.exports = {
  Inter: jest.fn(() => ({ style: { fontFamily: 'Inter Mock' } })),
  Noto_Sans: jest.fn(() => ({ style: { fontFamily: 'Noto Sans Mock' } }))
};
