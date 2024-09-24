const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts"]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "public"),
    }
};