const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: ["./src/index.ts"],
  target: "web",
  output: {
    filename: '[name].js',
    sourceMapFilename: "[file].map",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
         //拷贝public/office下面import方式使用的所有资源,后续的asset/resource将不会执行
         test: /\.(png|svg|json|tmx|vue|js|css|tsj)$/i,
         type: "asset/resource",
         include: [
          // will include any paths relative to the current directory starting with `app/styles`
          // e.g. `app/styles.css`, `app/styles/styles.css`, `app/stylesheet.css`
          path.resolve(__dirname, 'public/office/'),
        ],
        //exclude: /node_modules/,
        generator: {
          filename: '[name][ext]'
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        exclude: [path.resolve(__dirname, "node_modules/excalibur")],
        enforce: "pre",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
     new CleanWebpackPlugin(),
     new HtmlWebPackPlugin({
      title: "scene-editor",
    }),
  ],
  devServer : {
    port: 8081,
    // proxy: {
    //   '/api':{
    //     target: 'http://10.10.22.9:8888/',
    //     pathRewrite: { '^/api': ''}
    //   },
    //   '/buss': {
    //     target: 'http://localhost:8080/',
    //     pathRewrite: { '^/buss': ''}
    //   }
    // }
  }
};
