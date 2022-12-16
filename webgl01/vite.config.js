import {defineConfig} from 'vite'
const rawPlugin = require('vite-raw-plugin')
export default defineConfig({
    // base: './',
    // build: {
        // assetsDir: '.'
    // },
    define: {
        gl: 'window.gl'
    },
    plugins: [
        rawPlugin({
            fileRegex: /\.fs\.html/
        }),
        rawPlugin({
            fileRegex: /\.vs\.html/
        })
    ]
})
