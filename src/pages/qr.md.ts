import type { APIRoute } from 'astro';

import { abs, markdownResponse, SITE_NAME } from '@/lib/content';

export const GET: APIRoute = () =>
  markdownResponse(`# ${SITE_NAME}\n\nScan the QR code at ${abs('/qr')} to open ${abs('/')}`);
