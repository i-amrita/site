import { abs, SITE_NAME, SITE_URL, type SingletonEntry } from './content';

/** schema.org Person built from the `about` content entry. */
export function personJsonLd(about?: SingletonEntry, sameAs: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL,
    description: about?.data.description,
    affiliation: { '@type': 'CollegeOrUniversity', name: 'UC Berkeley School of Information' },
    knowsAbout: ['Artificial intelligence', 'Community building', 'Human-centered design'],
    mainEntityOfPage: abs('/about'),
    sameAs,
  };
}
