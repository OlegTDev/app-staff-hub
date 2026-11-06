import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        {
            name: 'copy-cmaps',
            apply: 'build',
            closeBundle() {
                const src = path.resolve('node_modules/pdfjs-dist/cmaps');
                const dest = path.resolve('public/build/cmaps');
                if (fs.existsSync(src)) {
                    fs.cpSync(src, dest, { recursive: true });
                }
            },
        },
    ],
    build: {
        target: [
            'es2020',
            'edge88',
            'chrome87',
            'firefox78',
            'safari14',
        ],
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
