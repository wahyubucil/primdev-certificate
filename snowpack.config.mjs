/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    ['@snowpack/plugin-typescript', { args: '--project ./src/tsconfig.json' }],
    '@snowpack/plugin-sass',
    [
      '@canarise/snowpack-eslint-plugin',
      {
        globs: ['src/**/*.tsx', 'src/**/*.ts'],
        options: {
          cache: true,
          cacheStrategy: 'content',
          fix: false,
          cacheLocation: './node_modules/.cache/.eslintcache',
        },
      },
    ],
  ],
  alias: {
    '~/contract-types': './contract-types',
    '@': './src',
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
