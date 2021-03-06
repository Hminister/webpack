//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


module.exports = {
    mode:isDev ? 'development' : 'production',
    devServer: {
        port: '3000', //默认是8080
        quiet: false, //默认不启用
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用
        clientLogLevel: "silent", //日志等级
        compress: true //是否启用 gzip 压缩
    },
    entry:'./src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.[hash:6].js',
        publicPath: '/' //通常是CDN地址
    },
    devtool: 'cheap-module-eval-source-map', //开发环境下使用
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                exclude:/node_modules/
            },
            // {
            //     test: /.html$/,
            //     use: 'html-withimg-loader'
            // },
            {
                test:/\.(le|c)ss$/,
                use:["style-loader","css-loader",{
                  loader:"postcss-loader",
                  options:{
                      plugins: function(){
                          return [
                              require('autoprefixer')({
                                "overrideBrowserslist": [
                                    ">0.25%",
                                    "not dead"
                                ]
                              })
                          ]
                      }
                  }
                },'less-loader'],
                exclude:/node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false,
                            name: '[name]hw_[hash:6].[ext]',
                            outputPath: 'images', // 将文件打包到哪里
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            config: config.template,
            minify:{
                removeAttributeQuotes:false,
                collapseWhitespace: false, 
            }
        }),
        new CleanWebpackPlugin()
    ]
}