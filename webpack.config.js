const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: path.resolve(__dirname, "src", "index.js"),
    output: {
        filename: "uja",
        path: path.resolve(__dirname, "build")
    },
    target: "node",
    plugins: [
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true
        })
    ]
}
