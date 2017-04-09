var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: path.join(__dirname, 'js/index.js'),
    output: {
        path: path.join(__dirname, '../public'),
        publicPath: '../../public',
        filename: 'js/index.js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','postcss-loader', 'less-loader']
                })
            },{
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=imgs/[name].[ext]', // 相对于源文件的目标路径
                // loader: 'url-loader?limit=8192?name=[name].[ext]&publicPath=../../public&outputPath=imgs/',
                query: {
                    useRelativePath: process.env.NODE_ENV === "production"
                }
            }
        ]
        // loaders: [
        //     { test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less-loader' },
        //     { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
        //     {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        // ]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, './js/jquery-1.12.4.min.js'),
            less: path.join(__dirname, 'less')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new ExtractTextPlugin('css/index.css'),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        })
    ]
};