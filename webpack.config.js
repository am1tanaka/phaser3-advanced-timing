'use strict';

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

    entry: {
        app: './src/index.js',
        'AdvancedTiming': './vendors/AdvancedTiming.js',
        'AdvancedTiming.min': './vendors/AdvancedTiming.js',
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: '[name].js',
        library: 'AdvancedTiming',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
          {
            test: [ /\.vert$/, /\.frag$/ ],
            use: 'raw-loader'
          }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        }),
        new UglifyJSPlugin({
            include: /\.min\.js$/,
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
                compress: true,
                ie8: false,
                ecma: 5,
                output: {
                    comments: false
                },
                warnings: false
            },
            warningsFilter: (src) => false
        })    ],

    devServer: {
        port: 8000
    }
};
