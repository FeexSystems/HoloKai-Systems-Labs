export default [
  {
    ignores: ['.next/**', 'dist/**', 'node_modules/**', '**/*.d.ts', 'build-output.log', '*.log'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
