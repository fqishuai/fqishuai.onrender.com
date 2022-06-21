module.exports = function (context, options) {
  return {
    name: 'postcss-tailwind',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(
        require('tailwindcss'),
        require('postcss-nested'),
        require('autoprefixer')
      );
      return postcssOptions;
    },
  }
}