module.exports = {
  // Use an array of plugins so we can invoke plugin factories
  plugins: [
    require('@tailwindcss/postcss')(),
    require('autoprefixer')(),
  ],
}
