const path = require('path');
const webpack = require('webpack');
const NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isProd = ENV === 'build-js';

const config = {
    devtool: isProd ? 'source-map' : 'eval-source-map',
    entry: {
        'app.bundle': path.join(__dirname, '/public/js/index'),
        'vendor.bundle': path.join(__dirname, 'public/js/vendor/index')
    },
    output: {
        path: path.join(__dirname, '/public/build/js'),
        filename: '[name].js',
        publicPath: '/build/js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: path.join(__dirname, '/public/js'),
                exclude: [
                    path.join(__dirname, '/public/js/vendor')
                ],
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([path.join(__dirname, '/public/build/js/*')], {
            exclude: ['.gitkeep']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.bundle',
            filename: 'vendor.bundle.js'
        }),
        new NgAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};

module.exports = config;
