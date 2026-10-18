/**
 * Embeds the build-time corpus with the same MiniLM model the browser uses (`Xenova/all-MiniLM-L6-v2`).
 * Run after `astro build` (see the `build` script). Reads `dist/search-corpus.json`, writes `dist/embeddings.json`.
 * Vectors are L2-normalised and quantised to int8 (value * 127), so cosine = dot / 127^2.
 * Model files are downloaded once into `node_modules/.cache/transformers`.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { env, pipeline } from '@huggingface/transformers';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const MODEL = 'Xenova/all-MiniLM-L6-v2';

interface Chunk {
  url: string;
  title: string;
  type: string;
  text: string;
}

env.cacheDir = join(root, 'node_modules/.cache/transformers');
await mkdir(env.cacheDir, { recursive: true });

const corpusPath = join(dist, 'search-corpus.json');
const chunks: Chunk[] = JSON.parse(await readFile(corpusPath, 'utf8'));

const started = performance.now();
const extractor = await pipeline('feature-extraction', MODEL, { dtype: 'q8' });
const out = await extractor(
  chunks.map((c) => c.text),
  { pooling: 'mean', normalize: true },
);
const dims = out.dims[1] as number;
const data = out.data as Float32Array;

const items = chunks.map((c, i) => ({
  url: c.url,
  title: c.title,
  type: c.type,
  s: c.text.slice(0, 160),
  v: Array.from(data.subarray(i * dims, (i + 1) * dims), (x) => Math.round(x * 127)),
}));

await writeFile(join(dist, 'embeddings.json'), JSON.stringify({ model: MODEL, dims, items }));
await rm(corpusPath);
console.log(
  `embeddings: ${items.length} chunks x ${dims} dims in ${Math.round(performance.now() - started)}ms`,
);
