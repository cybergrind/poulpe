const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const styleLoader = (argv.mode === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader
  return {
    mode: argv.mode || 'production',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules\/(?!api|shared|tipsi-router)/,
          use: ['babel-loader'],
        },
        {
          test: /\.css/,
          exclude: /node_modules/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: 'dashes',
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          ],
        },
        {
          test: /\.css/,
          include: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.less$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: 'dashes',
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        'src',
        'node_modules',
      ],
      alias: {
        'api': path.resolve(__dirname, '../api/'),
        'assets': path.resolve(__dirname, '../assets/'),
        'shared': path.resolve(__dirname, '../shared/'),
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'lodash': path.resolve(__dirname, 'node_modules/lodash'),
        'object-assign': path.resolve(__dirname, 'node_modules/object-assign'),
        'tipsi-router': path.resolve(__dirname, 'node_modules/tipsi-router'),
      },
      symlinks: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(argv.mode || process.env.NODE_ENV || 'production'),
        },
        'WS_SERVER_DEFINE': '"ws://localhost:9011"',
      }),
      new webpack.NamedModulesPlugin(),
    ],
    target: 'web',
  }
}
