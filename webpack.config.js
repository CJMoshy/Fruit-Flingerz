const path = require('path')

module.exports = {
    mode: 'development',
    entry : './dist/main.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // {
            //     test: /\.css$/i,
            //     use: ['style-loader', 'css-loader'],
            // },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        phaser: 'Phaser',
    },
    watch: true, // Enable watch mode
    watchOptions: {
      ignored: /node_modules/, // Ignore changes in node_modules
      aggregateTimeout: 300, // Delay before rebuilding
      poll: 1000 // Check for changes every second
    }
}