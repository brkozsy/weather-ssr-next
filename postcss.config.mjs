/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // v4 için 'tailwindcss' yerine bu paket kullanılır:
    '@tailwindcss/postcss': {},
  },
};

export default config;