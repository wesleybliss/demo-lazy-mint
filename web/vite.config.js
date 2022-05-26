import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

const aliases = [
    '',
    'styles',
    'lib',
    'store',
    'actions',
    'effects',
    'routes',
    'components',
    'constants',
    'assets',
    'workers',
    'messages',
    'contracts',
].reduce((acc, it) => ({
    ...acc,
    [`@${it}`]: path.resolve(__dirname, 'src', it),
}), {})

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgrPlugin({
            svgrOptions: {
                icon: true,
                // ...svgr options (https://react-svgr.com/docs/options/)
            },
        }),
    ],
    esbuild: {
        jsxInject: `import React from 'react'`,
    },
    resolve: {
        alias: {
            process: 'process/browser',
            stream: 'stream-browserify',
            zlib: 'browserify-zlib',
            util: 'util',
            ...aliases,
        },
    }
})
