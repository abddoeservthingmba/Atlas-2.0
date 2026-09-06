/**
 * Google reviews.
 *
 * These are real customers' words. Nothing in this file is ever written by
 * hand as filler: an invented testimonial on a real gym is fake social proof,
 * and it is the kind of thing that is both dishonest and, once noticed,
 * far more damaging than having no reviews section at all.
 *
 * So the array below starts empty and the section renders nothing until it is
 * populated, by one of two routes:
 *
 *   1. Automatic — `pnpm reviews:fetch` calls the Google Places API and writes
 *      reviews.generated.json. Needs GOOGLE_PLACES_API_KEY and
 *      GOOGLE_PLACE_ID. See scripts/fetch-reviews.mjs.
 *
 *   2. By hand — paste real reviews into MANUAL_REVIEWS below, copied
 *      verbatim from the Google listing.
 *
 * Google's Places terms cap this at the five reviews the API returns, require
 * attribution, and require a link through to the listing. All three are
 * handled by the Reviews component.
 */

import generated from './reviews.generated.json';

export interface Review {
  /** Reviewer's display name, exactly as Google shows it. */
  author: string;
  /** 1-5. */
  rating: number;
  /** The review body, verbatim. Never edited for tone or length. */
  text: string;
  /** Google's relative time string, e.g. "2 months ago". */
  when: string;
  /** Link to the review or the listing, for attribution. */
  url?: string;
}

export interface ReviewSummary {
  rating: number;
  count: number;
  /** The public Google listing, for "read all". */
  url: string;
}

/**
 * Reviews entered by hand — the route this project uses.
 *
 * Copy real reviews from the Google listing and paste them in. Verbatim: do
 * not tidy the grammar, trim the awkward bits, or write a better version of
 * what someone meant. An edited review is no longer their words, and an
 * invented one is fake social proof on a real business.
 *
 * Three to five is the right number. More reads as a wall and nobody finishes
 * it. Delete the example below and replace it with the real thing:
 *
 *   {
 *     author: 'Full name as Google shows it',
 *     rating: 5,
 *     text: 'The review, exactly as written.',
 *     when: '2 months ago',
 *   },
 *
 * Once at least one entry exists the section appears on the home page. Until
 * then it is not rendered at all — see HAS_REVIEWS below.
 *
 * Set REVIEW_SUMMARY_MANUAL too if you want the headline score and rating
 * count shown above the cards.
 */
const MANUAL_REVIEWS: readonly Review[] = [];

/**
 * The overall score, if you want it displayed. Take both numbers straight from
 * the Google listing; a rounded or rounded-up figure here is a fabricated
 * statistic, however small.
 */
const REVIEW_SUMMARY_MANUAL: ReviewSummary | null = null;

interface GeneratedShape {
  reviews?: Review[];
  summary?: ReviewSummary | null;
  fetchedAt?: string;
}

const g = generated as GeneratedShape;

/** Generated data wins when present; hand-entered is the fallback. */
export const REVIEWS: readonly Review[] = g.reviews?.length ? g.reviews : MANUAL_REVIEWS;

export const REVIEW_SUMMARY: ReviewSummary | null = g.summary ?? REVIEW_SUMMARY_MANUAL;

/** When this is false the section is not rendered at all. */
export const HAS_REVIEWS = REVIEWS.length > 0;

/** ISO date the generated file was written, for staleness checks. */
export const REVIEWS_FETCHED_AT: string | null = g.fetchedAt ?? null;
