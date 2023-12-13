/**@type {import('prettier').Config} */
module.exports = {
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'none',
  jsxSingleQuote: true,
  bracketSpacing: true,
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '^@emotion/(.*)$',
    '^@mui/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@/types/(.*)$',
    '^@core/(.*)$',
    '^@/styles/(.*)$',
    '',
    '^[./]'
  ],
  plugins: ['@ianvs/prettier-plugin-sort-imports']
};
