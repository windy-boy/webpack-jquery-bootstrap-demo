const dirJSON = require('./src/pages/pages.json');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HashOutput = require('webpack-plugin-hash-output');
const isProd = (process.env.NODE_ENV === 'prod');

let entry = {};
let plugins = [];
plugins.push(new HashOutput())
dirJSON.forEach(page => {
    entry[page.name] = path.resolve(__dirname, `./src/pages/${page.name}/index.js`);
    let chunks = [page.name];
    if (isProd) {
      chunks.splice(0, 0, 'assets');
      chunks.splice(0, 0, 'vendors');
    }
    plugins.push(
      new HtmlPlugin({
        favicon: path.resolve(__dirname, `./src/assets/img/favicon.ico`),
        filename: path.resolve(__dirname, `./dist/${page.name}.html`),
        template: 'html-withimg-loader!'+ path.resolve(__dirname, `./src/pages/${page.name}/index.html`),
        chunks: chunks,
        chunksSortMode: 'manual',
        minify: isProd ? {
          collapseWhitespace: true,
          removeComments: true
        } : false
      })
  );
});

plugins.push(
  new MiniCssExtractPlugin({
    filename: 'css/' + (isProd ? '[name].[contenthash:8].min.css' : '[name].css'),
    chunkFilename: 'css/' + (isProd ? '[name].chunk.[contenthash:8].min.css' : '[name].chunk.css'),
  })
);

plugins.push(
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: "jquery",
    'window.jQuery': 'jquery'
  }),
)

module.exports = {
  entry: entry,
  output: {
    publicPath: isProd ? './' : '',
    path: path.resolve(__dirname, './dist'),
    filename: 'js/' + (isProd ? '[name].[chunkhash:8].min.js' : '[name].js'),
    chunkFilename: 'js/' + (isProd ? '[name].chunk.[chunkhash:8].min.js' : '[name].chunk.js'),
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(html|htm)$/,
        use: ['html-withimg-loader']
      },
      {
        test: /\.(png|jpg|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 4096,
              outputPath: 'img',
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'img'
            }
          }
        ]
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot)(\?.*$|$)/,
        loader: 'file-loader?name=font/[name].[hash:8].[ext]'
      },
      {
        test: /\.(sa|sc|c|le)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/pages'), path.resolve(__dirname, 'assets/js')],
        loader: 'eslint-loader'
      },
    ]
  },
  plugins: [
    ...plugins
  ]
};
