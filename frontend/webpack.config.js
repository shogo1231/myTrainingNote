const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/training',
    filename: 'bundle.js',
    // assetModuleFilename: 'assets/[hash][ext][query]'
  },
  // favicon用に追加検証
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      // filename: path.join(__dirname, "dist", "index.html"),
      // ビルドしたjsファイルを読み込む場所。デフォルトはhead
      inject: "body",
      // alwaysWriteToDisk: true,
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, "src/favicon.ico"),
      mode: "webapp",
      devMode: "webapp",
      prefix: "./",
      inject: true,
      // 媒体ごとに調整できるよう将来的に設定したい。
      // 現状はwindowsのwebブラウザ（chrome,edge)でOK
      // favicons: {
      //   icons: {
      //     android: [
      //       "android-chrome-192x192.png",
      //       "android-chrome-512x512.png",
      //     ],
      //     appleIcon: [
      //       "apple-touch-icon-180x180.png",
      //     ],
      //     appleStartup: false,
      //     favicons: [
      //       "favicon-16x16.png",
      //       "favicon-32x32.png",
      //       "favicon-48x48.png",
      //       "favicon.ico",
      //     ],
      //     windows: [
      //       "mstile-150x150.png",
      //     ],
      //     yandex: false,
      //   }
      // },
    }),
  ],
  // ここまで

  module: {
    rules: [
      /* TypeScriptのモジュール */
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env', '@babel/react'] },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ]
      },
      /* CSSのモジュール */
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ]
      },
      /* png,jpg,gif,svgのモジュール */
      {
        test: /\.(png|jpg|gif|svg|ico)/,
        //ローダの処理対象となるディレクトリ
        include: path.resolve(__dirname, 'src/images'),
        //利用するローダー
        type: 'asset/inline',
    }
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
      publicPath: '/',
    },
    // react-router-domで画面遷移する際の404エラー対策
    // この設定について詳細確認が必要
    historyApiFallback: true,
    port: 3000,
    // 「ドメイン名/api」のパスをバックエンドサーバーへ転送する設定
    proxy: {
      '/api': {
        target: 'http://localhost:8001'
      }
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  target: 'web',
};