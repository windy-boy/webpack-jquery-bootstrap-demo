const baseWebpackConfig = require('./webpack.base.config');
const webpack = require('webpack');
const path = require('path');
const WebpackMerge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

if (process.env.NODE_ENV === 'prod') {
    module.exports = WebpackMerge.merge(baseWebpackConfig, {
        mode: 'production',
        optimization: {
            minimize: true,
            splitChunks: {
                minSize: 0,
                minChunks: 1,
                maxAsyncRequests: 50,
                maxInitialRequests: 30,
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -1,
                        chunks: 'all',
                        name: 'vendors'
                    },
                    assets: {
                        test: path.resolve(__dirname, './src/assets'),
                        priority: -10,
                        chunks: 'all',
                        name: 'assets'
                    }
                }
            }
        },
        plugins: [
            new CleanWebpackPlugin(),
            new OptimizeCssAssetsPlugin(),
            new webpack.BannerPlugin('版权所有，盗版必究！')
        ]
    });
} else if (process.env.NODE_ENV === 'dev') {
    module.exports = WebpackMerge.merge(baseWebpackConfig, {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            inline: true,
            contentBase: path.join(__dirname, 'dist'),
            publicPath: '',
            compress: true,
            host: 'localhost',
            port: 9000,
            overlay: {
              warnings: false,
              errors: true
            }
        }
    });
}
