const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
module.exports = {
    entry: {
        content: './src/content/content.ts',
        background: './src/background.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: '' },
                { from: 'src/assets', to: 'assets' }
            ]
        }),
        new DotenvPlugin(),
    ],
    devtool: 'source-map', // Enable source maps for better readability
};