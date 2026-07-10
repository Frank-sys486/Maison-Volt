import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import path from 'path';
import type { IncomingMessage } from 'node:http';
import conciergeHandler from '../../api/concierge';

const rawPort = process.env.PORT ?? '5173';

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

function readBody(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/concierge', async (req, res) => {
        try {
          const body = req.method === 'POST' ? await readBody(req) : undefined;
          await conciergeHandler(
            { method: req.method, body },
            {
              setHeader: res.setHeader.bind(res),
              status(code: number) {
                res.statusCode = code;
                return this;
              },
              json(payload: unknown) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(payload));
                return this;
              },
            },
          );
        } catch {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Local API request failed' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, path.resolve(import.meta.dirname, '..', '..'), ''));
  Object.assign(process.env, loadEnv(mode, import.meta.dirname, ''));

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      localApiPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
