const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
module.exports = {
    entry: {
        chromeContent: './src/chrome/content.ts',
        chromeBackground: './src/chrome/background.ts',
        firefoxContent: './src/firefox/content.ts',
        firefoxBackground: './src/firefox/background.ts'
    },
    output: {
        filename: (pathData) => {
            const name = pathData.chunk.name;
            if (name.startsWith('chrome')) {
                return `chrome/${name.replace('chrome', '').toLowerCase()}.js`;
            } else if (name.startsWith('firefox')) {
                return `firefox/${name.replace('firefox', '').toLowerCase()}.js`;
            }
        },
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
                { from: 'src/chrome/manifest.json', to: 'chrome' },
                { from: 'src/firefox/manifest.json', to: 'firefox' },
                { from: 'src/assets', to: 'chrome/assets' },
                { from: 'src/assets', to: 'firefox/assets' }
            ]
        }),
        new DotenvPlugin(),
    ],
    devtool: 'source-map', // Enable source maps for better readability
};