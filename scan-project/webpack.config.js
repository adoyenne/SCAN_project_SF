const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Обрабатываем все CSS файлы
        use: ['style-loader', 'css-loader'], // Загружаем стили в DOM
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Регулярное выражение для поиска изображений
        use: [
          {
            loader: 'file-loader', // Обрабатываем изображения с помощью file-loader
            options: {
              name: '[name].[hash].[ext]', // Формат имени файлов (с хэшем для уникальности)
              outputPath: 'images/', // Папка для изображений в выходной директории
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'], // Добавляем .css сюда, чтобы Webpack знал об этом расширении
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
};