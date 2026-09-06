# Content inventory — current atlasfitnesselite.com

Extracted from the live site's own JS bundle and a full set of mobile
screenshots. This is the source material for the rebuild: real copy, real
pricing, real structure. Build pages from this rather than placeholder text.

Nothing here is a design decision — it is a record of what exists today and
what must survive the redesign.

## Routes

| current | purpose |
| --- | --- |
| `/` | Home |
| `/about` | About Us — mission, core values, promise |
| `/programs` | Fitness classes |
| `/facilities` | Equipment + amenities |
| `/membership` | Plans, add-ons |
| `/contact` | "Join Us" — contact details, enquiry form, FAQ |

Nav order: Home · About Us · Programs · Facilities · Membership · Join Us,
plus a persistent **JOIN NOW** button and a floating WhatsApp bubble.

## Programs (9)

Calisthenics · Parkour · Hyrox · Strength & Conditioning ·
OCR (Obstacle Course Racing) · Flexibility · Inversions · Tumbling ·
Kids Parkour

Each has a paragraph of copy and a "Know More" link on the current site.

## Membership plans

Twelve durations, all **+ GST**. 6 Months is flagged "Most popular".

| term | price | term | price |
| --- | --- | --- | --- |
| 1 month | ₹2,999 | 8 months | ₹21,000 |
| 2 months | ₹5,499 | 10 months | ₹25,599 |
| 3 months | ₹8,599 | 12 months | ₹28,999 |
| 4 months | ₹9,999 | 15 months | ₹34,999 |
| 5 months | ₹12,599 | 18 months | ₹39,999 |
| **6 months** | **₹14,999** | 24 months | ₹55,999 |

Benefits accumulate ("Everything in X months" + PT sessions, nutrition
check-ins, merchandise, transfer/freeze, guest passes).

**Twelve plans on one page is a lot of choice to put in front of a phone
user.** Worth discussing whether the rebuild surfaces three or four and puts
the rest behind a "see all terms" disclosure.

## Add-ons

Nutrition Consult (₹3,999/month) · Merchandise · Locker Rental ·
Specialized Classes · Transformation Challenge · **Atlas Desi Fuel**
(subscription tiffin service — "Ghar ka Khana, Videshi Macros") ·
Personal Training 1-on-1 · Guest Access

## Facilities

**Equipment**, each with benefits and a "Perfect For" note: Free Weights &
Dumbbells · Cardio Zone / Treadmills · Cable Machines & Functional Trainers ·
Power Racks & Squat Cages · Rowing Machines (Ergs) · Leg Press & Lower Body ·
Olympic Barbells & Plates · Battle Ropes & Functional Equipment ·
Benches & Lifting Platforms · Resistance Bands & Mobility Tools

**Amenities**: Premium Locker Rooms · Climate Controlled · Hydration
Stations · Motivational Sound System · Wi-Fi & Charging · Achievement Wall ·
Recovery Zone · Valet Parking

## About

Mission: "Empowering Transformations Through Expert Guidance & Community
Spirit."

Core values: Excellence · Community · Results · Innovation

Promise (6): Expert Trainers · Premium Equipment · Clean & Safe Environment ·
Flexible Membership · Personalized Attention · Community Events

## Contact / FAQ

Contact block, enquiry form (name, email, phone, interest, message), and 9
FAQs covering: prior experience, what to bring, parking, trial class,
trainer certification, cancellation terms, nutrition guidance, personal
training inclusion, safety measures.

All NAP details now live in `src/config/site.ts`.

## Observed defects in the current site

Recorded so the rebuild does not inherit them:

1. **Nav overlaps the logo.** "ATLASFITNESS" runs underneath the "Home" and
   "About Us" links on every page at mobile width. Visible in every
   screenshot — the most damaging single flaw, since it is on every page.
2. **A stray UK phone number.** The bundle contains
   `wa.me/447944295352` alongside the real `wa.me/919988229441`. Confirm
   which is intended; a wrong WhatsApp number silently loses enquiries.
3. **Inconsistent grounds.** Facilities and FAQ sections are white while the
   rest of the site is near-black, so the pages read as different products.
4. **A fourth and fifth colour.** Programs uses cyan links and a blue submit
   button; several headings use a red→orange→yellow gradient. Neither is in
   the black/red/white brand.
5. **Emoji as iconography** throughout (🥗 👕 🎒 🏆 🚿 ❄️ 💧 🎵 📱 🧘 🚗).
   Renders differently on every device and undercuts a premium positioning.
6. **Neon glow on every card and button**, so nothing is emphasised — the
   whole page shouts at one volume.

Items 3-6 are what the token system already corrects. Items 1 and 2 are
content/QA issues to confirm with the client.
