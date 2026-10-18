import { pngResponse, renderOg } from '@/lib/og';

export async function GET() {
  return pngResponse(
    await renderOg({
      title: 'Amrita Nambiar',
      subtitle: 'AI × community × human-centered design',
      eyebrow: 'Portfolio',
    }),
  );
}
