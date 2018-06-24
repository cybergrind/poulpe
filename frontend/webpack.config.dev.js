const baseConfig = require('./webpack.config.base')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const childProcess = require('child_process')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const plugins = []

const API_SERVER = 'http://localhost:8999'
const { INSIDE_DOCKER } = process.env


if (!INSIDE_DOCKER) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}


const createEntryPoint = (app) => {
  const entryPoint = INSIDE_DOCKER ? [] : ['react-hot-loader/patch']
  return entryPoint.concat([
    'babel-polyfill',
    path.join(__dirname, 'src', 'index.js')]
  )
}
const entry = ['poulpe'].reduce((memo, app) => ({ ...memo, [app]: createEntryPoint(app) }), {})

module.exports = (env, argv) => merge.smart(baseConfig(env, argv), {
  entry,
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      chunks: ['poulpe'],
      template: path.resolve(__dirname, 'src', 'index.html'),
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ].concat(plugins),
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    clientLogLevel: 'info',
    hot: !INSIDE_DOCKER,
    hotOnly: !INSIDE_DOCKER,
    disableHostCheck: !!INSIDE_DOCKER,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/v001/**': {
        target: API_SERVER,
        changeOrigin: true,
        secure: true,
      },
    },
    historyApiFallback: true,
  },
})
