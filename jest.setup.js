// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// mock google font
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({ style: { fontFamily: 'Inter Mock' } })),
  Noto_Sans: jest.fn(() => ({ style: { fontFamily: 'Noto Sans Mock' } }))
}));
