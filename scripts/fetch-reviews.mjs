#!/usr/bin/env node
/**
 * Pull Google reviews into src/data/reviews.generated.json.
 *
 *   GOOGLE_PLACES_API_KEY=... GOOGLE_PLACE_ID=... pnpm reviews:fetch
 *
 * Without GOOGLE_PLACE_ID the script finds the place by name and address from
 * src/config/site.ts and prints the id for you to pin in your environment —
 * pinning it means a future rename or a similarly named gym can never silently
 * swap which business the site quotes.
 *
 * Why a script and not a runtime fetch: the site is static, so this runs at
 * build time and the reviews are baked into the HTML. No API key reaches the
 * browser, no request cost per visitor, and no layout shift while a widget
 * loads. The trade-off is that reviews only refresh when the site is rebuilt,
 * which is what the scheduled-rebuild note in the README covers.
 *
 * The Places API returns at most five reviews. That is Google's limit, not a
 * choice made here.
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'src', 'data', 'reviews.generated.json');

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

/** Write the empty shape so the build always has a valid file to import. */
function writeEmpty(reason) {
  const payload = { reviews: [], summary: null, fetchedAt: null, note: reason };
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`No reviews written: ${reason}`);
  console.log(`Wrote empty ${OUT} so the build still succeeds.`);
}

if (!KEY) {
  writeEmpty('GOOGLE_PLACES_API_KEY is not set');
  process.exit(0);
}

/** Pull name/address out of site.ts without importing TypeScript. */
function siteDetails() {
  const src = readFileSync(join(here, '..', 'src', 'config', 'site.ts'), 'utf8');
  const pick = (k) => src.match(new RegExp(`${k}:\\s*'([^']+)'`))?.[1] ?? '';
  return {
    name: pick('name'),
    street: pick('streetAddress'),
    locality: pick('addressLocality'),
  };
}

async function findPlaceId() {
  const { name, street, locality } = siteDetails();
  const query = `${name}, ${street}, ${locality}`;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 3 }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? `searchText failed (${res.status})`);
  const hits = json.places ?? [];
  if (!hits.length) throw new Error(`No place matched "${query}"`);

  console.log('Matches:');
  for (const p of hits) {
    console.log(`  ${p.id}  ${p.displayName?.text} — ${p.formattedAddress}`);
  }
  console.log(`\nUsing the first. Pin it: GOOGLE_PLACE_ID=${hits[0].id}\n`);
  return hits[0].id;
}

async function main() {
  const id = PLACE_ID || (await findPlaceId());

  const res = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
    headers: {
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask':
        'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? `place details failed (${res.status})`);

  const listing = json.googleMapsUri ?? '';

  const reviews = (json.reviews ?? [])
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? 'Google reviewer',
      rating: r.rating ?? 0,
      // originalText is the reviewer's own words; `text` may be translated.
      text: (r.originalText?.text ?? r.text?.text ?? '').trim(),
      when: r.relativePublishTimeDescription ?? '',
      url: r.googleMapsUri ?? listing,
    }))
    // A star rating with no words is not a testimonial.
    .filter((r) => r.text.length > 0);

  const payload = {
    reviews,
    summary: json.rating
      ? { rating: json.rating, count: json.userRatingCount ?? 0, url: listing }
      : null,
    fetchedAt: new Date().toISOString(),
    placeId: json.id,
    placeName: json.displayName?.text ?? '',
  };

  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${reviews.length} review(s) for "${payload.placeName}".`);
  if (payload.summary) {
    console.log(`Rating ${payload.summary.rating} from ${payload.summary.count} ratings.`);
  }
  if (reviews.length === 0) {
    console.log('Note: the API returned no reviews with text.');
  }
}

main().catch((err) => {
  // A failed fetch must never take the build down or, worse, silently ship
  // stale reviews as if they were current.
  writeEmpty(err.message);
  process.exitCode = 0;
});
