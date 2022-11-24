const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

module.exports = (_env, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development'

  return {
    mode,

    // This is necessary because Figma's 'eval' works differently than normal eval
    devtool: argv.mode === 'production' ? false : 'inline-source-map',

    entry: {
      ui: './src/ui.ts', // The entry point for your UI code
      code: './src/code.ts', // The entry point for your plugin code
    },

    module: {
      rules: [
        // Converts TypeScript code to JavaScript
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },

        // Enables including CSS by doing "import './file.css'" in your TypeScript code
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },

    // Webpack tries these extensions for you if you omit the extension like "import './file'"
    resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
    },

    // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/ui.html',
        filename: 'ui.html',
        inlineSource: '.(js)$',
        chunks: ['ui'],
        inject: 'body',
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
    ],

    optimization: {
      minimize: mode === 'production' ? true : false,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
  }
}
