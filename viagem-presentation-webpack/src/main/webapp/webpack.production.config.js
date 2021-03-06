var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'app', 'app'),
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: 'dist/',
        filename: 'app.min.js'
    },
    plugins: [
        new UglifyJSPlugin({
            include: /\.min\.js$/,
            beautify: true,
            comments: false,
            minimize: true,
            mangle: false,
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin({
            filename: "app.min.css",
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/i,
                use: "file-loader?name=public/icons/[name].[ext]"
            }
        ]
    }
};
