import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'node:fs';

export default defineConfig({
    plugins: [
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            protocolImports: true,
        }),
        {
            name: 'inline-wasm',
            load(id) {
                if (id.endsWith('.wasm')) {
                    const wasm = fs.readFileSync(id);
                    const base64 = wasm.toString('base64');
                    return `export default "data:application/wasm;base64,${base64}"`;
                }
            }
        }
    ],
    define: {
        'global': 'globalThis',
        'process.env.NODE_DEBUG': 'false',
    },
    build: {
        assetsInlineLimit: 1000000,
        lib: {
            entry: './webp.js',
            name: 'webpmux',
            fileName: 'webpmux',
            formats: ['es', 'umd'],
        },
    },
})