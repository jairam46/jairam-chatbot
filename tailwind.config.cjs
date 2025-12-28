module.exports = {
  // Scan the whole project for class usage (covers Nuxt's `app/` structure)
  content: [
    './**/*.{vue,js,ts,jsx,tsx}',
    './server/**/*.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
