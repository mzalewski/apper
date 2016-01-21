var webpack = require("webpack");
module.exports = {
    entry: "./sample.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
node: {
  fs: "empty"
},
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ] 
};