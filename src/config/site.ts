/**
 * Site-wide constants: NAP (name / address / phone), branding strings and
 * social handles. Meta tags and JSON-LD both read from here, so the business
 * details exist in exactly one place.
 *
 * Everything marked TODO is a placeholder awaiting real client data.
 */

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHours {
  /** schema.org day names, e.g. ['Monday', 'Tuesday'] */
  days: readonly string[];
  /** 24h 'HH:MM' */
  opens: string;
  closes: string;
}

export const SITE = {
  /** Canonical production origin, no trailing slash. */
  url: 'https://www.atlasfitnesselite.com',

  name: 'Atlas Fitness Elite',
  legalName: 'Atlas Fitness Elite', // TODO: confirm registered legal entity name
  shortName: 'Atlas',

  /** Used as the default <title> and og:site_name. */
  title: 'Atlas Fitness Elite',
  titleTemplate: '%s | Atlas Fitness Elite',

  tagline: 'Transform Your Body, Transform Your Life', // TODO: confirm with client

  description:
    'Atlas Fitness Elite is a strength and conditioning gym offering coached ' +
    'training, modern equipment and flexible membership options.', // TODO: replace with client copy

  locale: 'en_US', // TODO: confirm locale/region
  lang: 'en',

  /** Default social share image, 1200x630, served from /public. */
  ogImage: '/og-default.png', // TODO: replace with real brand share image
  ogImageAlt: 'Atlas Fitness Elite', // TODO: describe the real image

  themeColor: '#0e1013', // TODO: replace with client hex (matches --color-surround)

  /* ---- NAP ---------------------------------------------------------- */
  telephone: '+1-000-000-0000', // TODO: replace with client phone
  email: 'hello@atlasfitnesselite.com', // TODO: replace with client email

  address: {
    streetAddress: '000 Placeholder Street', // TODO: replace with client address
    addressLocality: 'City', // TODO
    addressRegion: 'ST', // TODO
    postalCode: '00000', // TODO
    addressCountry: 'US', // TODO
  } satisfies PostalAddress,

  /** TODO: replace with the real coordinates of the gym. */
  geo: {
    latitude: 0,
    longitude: 0,
  },

  /** TODO: replace with real staffed hours. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '05:00', closes: '22:00' },
    { days: ['Saturday', 'Sunday'], opens: '07:00', closes: '20:00' },
  ] satisfies readonly OpeningHours[],

  priceRange: '$$', // TODO: confirm

  /** TODO: replace with real profile URLs. Empty entries are omitted from JSON-LD. */
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
  },

  twitterHandle: '', // TODO: e.g. '@atlasfitness' — omitted from meta when blank

  /* ---- Primary conversion ------------------------------------------- */
  cta: {
    label: 'Start free trial', // TODO: confirm the real primary CTA
    href: '#join', // TODO: point at the real signup destination
    secondaryLabel: 'Call',
    secondaryHref: 'tel:+10000000000', // TODO: keep in sync with SITE.telephone
  },
} as const;

/** Absolute URL helper for canonical/OG tags. */
export function absoluteUrl(path: string, base: string = SITE.url): string {
  return new URL(path, base).href;
}

/** schema.org HealthClub node. Placeholder values flow through from SITE. */
export function healthClubSchema(canonical: string): Record<string, unknown> {
  const sameAs = Object.values(SITE.social).filter((url) => url.length > 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    '@id': `${SITE.url}/#healthclub`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    slogan: SITE.tagline,
    url: SITE.url,
    telephone: SITE.telephone,
    email: SITE.email,
    priceRange: SITE.priceRange,
    image: absoluteUrl(SITE.ogImage),
    logo: absoluteUrl(SITE.ogImage), // TODO: replace with a dedicated logo asset
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: SITE.openingHours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    mainEntityOfPage: canonical,
  };
}
