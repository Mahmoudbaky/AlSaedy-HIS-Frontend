import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import { readFileSync } from 'fs';
import svgr from '@svgr/rollup';

const SETTINGS_FILE = 'C:\\settings\\AlSaedy-HIS-settings.txt';

function parseNetworkFromContent(content: string): string | undefined {
    const line = content.split(/\r?\n/).find((l: string) => l.trim().toLowerCase().startsWith('ip='));
    if (!line) return undefined;
    const value = line.split('=')[1]?.trim();
    if (!value) return undefined;
    const octets = value.split('.');
    return octets.length === 4 ? octets[2] : value;
}

function settingsPlugin() {
    return {
        name: 'settings-endpoint',
        configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
            server.middlewares.use((req: any, res: any, next: () => void) => {
                if (req.url === '/api/settings' && req.method === 'GET') {
                    try {
                        const content = readFileSync(SETTINGS_FILE, 'utf8');
                        const network = parseNetworkFromContent(content);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ network: network ?? null }));
                    } catch {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ network: null }));
                    }
                } else {
                    next();
                }
            });
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, 'src'),
        },
    },
    esbuild: {
        loader: 'tsx',
        include: /src\/.*\.tsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                {
                    name: 'load-js-files-as-tsx',
                    setup(build: any) {
                        build.onLoad(
                            { filter: /src\\.*\.js$/ },
                            async (args: { path: string }) => ({
                                loader: 'tsx',
                                contents: await fs.readFile(args.path, 'utf8'),
                            })
                        );
                    },
                },
            ],
        },
    },
    build: {
        outDir: 'dist', // ✅ this is required for Netlify
    },
    plugins: [settingsPlugin(), svgr(), react()],
});
