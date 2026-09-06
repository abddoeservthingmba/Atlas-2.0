/**
 * Site content, typed. Copy lives here rather than inline in templates so the
 * same programme or plan can appear on a listing page and a detail page
 * without drifting.
 *
 * Everything is taken from the current atlasfitnesselite.com — see
 * docs/content-inventory.md. Nothing here is invented: no member counts, no
 * testimonials, no awards. Where a claim would need the client to confirm it,
 * it is absent rather than plausible.
 */

export interface Program {
  slug: string;
  name: string;
  blurb: string;
}

export interface Plan {
  months: number;
  label: string;
  /** Rupees, excluding GST, as published. */
  price: number;
  featured?: boolean;
  /** What this tier adds over the one below it. */
  adds: readonly string[];
}

export interface Facility {
  name: string;
  detail: string;
}

export interface Faq {
  q: string;
  a: string;
}

/* ------------------------------------------------------------------ */

export const PROGRAMS: readonly Program[] = [
  {
    slug: 'strength-conditioning',
    name: 'Strength & Conditioning',
    blurb:
      'Build muscle, boost endurance and raise athletic performance. Programmes are tailored to your pace, from first barbell to competition prep.',
  },
  {
    slug: 'calisthenics',
    name: 'Calisthenics',
    blurb:
      'The art of movement using just your bodyweight. Beginner to advanced, working strength and mobility together at the right level.',
  },
  {
    slug: 'hyrox',
    name: 'Hyrox',
    blurb:
      'Functional strength racing. Whether you are competing or just pushing your limits, sessions build endurance in a supportive room.',
  },
  {
    slug: 'parkour',
    name: 'Parkour',
    blurb:
      'Move creatively and efficiently. Expert-led training that sharpens agility, balance and mental focus.',
  },
  {
    slug: 'ocr',
    name: 'Obstacle Course Racing',
    blurb:
      'Endurance obstacle training combining strength, stamina and technique for tough courses.',
  },
  {
    slug: 'flexibility',
    name: 'Flexibility',
    blurb:
      'Move better, feel better. Stretching and mobility work that improves range of motion and lowers injury risk.',
  },
  {
    slug: 'inversions',
    name: 'Inversions',
    blurb:
      'Serious core strength and balance, upside down. For anyone ready to move into advanced calisthenics.',
  },
  {
    slug: 'tumbling',
    name: 'Tumbling',
    blurb:
      'Acrobatic fitness and gymnastics training. Coordination, balance and body awareness, for all ages.',
  },
  {
    slug: 'kids-parkour',
    name: 'Kids Parkour',
    blurb:
      'Movement for children of all fitness levels — motor skills, confidence and agility in a safe environment.',
  },
];

/* ------------------------------------------------------------------ */

export const PLANS: readonly Plan[] = [
  {
    months: 1,
    label: '1 month',
    price: 2999,
    adds: [
      'Access to all equipment',
      'Group classes included',
      'Locker facilities',
      'Free fitness assessment',
    ],
  },
  { months: 2, label: '2 months', price: 5499, adds: ['Priority class booking'] },
  {
    months: 3,
    label: '3 months',
    price: 8599,
    adds: ['1 personal training session', 'Nutrition guidance basics', 'Body composition analysis'],
  },
  {
    months: 4,
    label: '4 months',
    price: 9999,
    adds: ['2 personal training sessions', 'Detailed meal plans', 'Guest pass (1 entry)'],
  },
  {
    months: 5,
    label: '5 months',
    price: 12599,
    adds: ['3 personal training sessions', 'Monthly nutrition check-ins', 'Guest pass (2 entries)'],
  },
  {
    months: 6,
    label: '6 months',
    price: 14999,
    featured: true,
    adds: [
      '4 personal training sessions',
      'Detailed meal plans',
      'Body composition analysis',
      'Guest pass (3 entries)',
    ],
  },
  {
    months: 8,
    label: '8 months',
    price: 21000,
    adds: ['5 personal training sessions', 'Guest pass (4 entries)', 'Transfer/freeze option'],
  },
  {
    months: 10,
    label: '10 months',
    price: 25599,
    adds: ['6 personal training sessions', 'Bi-weekly nutrition check-ins', 'Free merchandise'],
  },
  {
    months: 12,
    label: '12 months',
    price: 28999,
    adds: [
      '8 personal training sessions',
      'Monthly nutrition check-ins',
      'Transfer/freeze (1 month)',
      'Guest pass (6 entries)',
    ],
  },
  {
    months: 15,
    label: '15 months',
    price: 34999,
    adds: ['10 personal training sessions', 'Bi-weekly nutrition support', 'Premium merchandise'],
  },
  {
    months: 18,
    label: '18 months',
    price: 39999,
    adds: ['12 personal training sessions', 'Weekly nutrition support', 'Guest pass (10 entries)'],
  },
  {
    months: 24,
    label: '24 months',
    price: 55999,
    adds: [
      '16 personal training sessions',
      'Dedicated nutrition coach',
      'Unlimited guest passes',
      'VIP member benefits',
    ],
  },
];

/** The three put in front of a phone user; the rest sit behind a disclosure. */
export const FEATURED_PLAN_MONTHS: readonly number[] = [1, 6, 12];

export const ADD_ONS: readonly Facility[] = [
  {
    name: 'Personal training',
    detail: 'One-to-one coaching sessions to fast-track your goals.',
  },
  {
    name: 'Nutrition consult',
    detail: 'Specialist consultation and personalised meal plans. ₹3,999 per month.',
  },
  {
    name: 'Atlas Desi Fuel',
    detail:
      'Ghar ka khana, videshi macros. Subscription tiffin service — protein-rich roti, dal and masala oats built by nutritionists.',
  },
  {
    name: 'Transformation challenge',
    detail: 'An eight-week intensive with coaching and tracking.',
  },
  { name: 'Specialised classes', detail: 'Workshops, masterclasses and guest instructor sessions.' },
  { name: 'Locker rental', detail: 'A secure personal locker.' },
  { name: 'Guest access', detail: 'Bring a friend or family member to train with you.' },
  { name: 'Merchandise', detail: 'Branded apparel, shaker bottles and gym gear at reception.' },
];

/* ------------------------------------------------------------------ */

export const EQUIPMENT: readonly Facility[] = [
  { name: 'Free weights & dumbbells', detail: 'A complete range, 5 lb to 100 lb.' },
  { name: 'Olympic barbells & plates', detail: 'Professional-grade bars and bumper plates.' },
  { name: 'Power racks & squat cages', detail: 'Heavy-duty stations with safety features.' },
  { name: 'Cable machines', detail: 'Multi-functional pulley systems for versatile training.' },
  { name: 'Benches & lifting platforms', detail: 'Adjustable benches and rubber platforms.' },
  { name: 'Leg press & lower body', detail: 'Specialised machines for leg development.' },
  { name: 'Treadmills', detail: 'Cardio machines with digital tracking.' },
  { name: 'Rowing ergs', detail: 'Full-body cardio and conditioning.' },
  { name: 'Battle ropes', detail: 'Dynamic tools for functional conditioning.' },
  { name: 'Bands & mobility tools', detail: 'Recovery and flexibility equipment.' },
];

export const AMENITIES: readonly Facility[] = [
  { name: 'Premium locker rooms', detail: 'Secure lockers, hot showers and grooming stations.' },
  { name: 'Climate controlled', detail: 'HVAC holding temperature year-round.' },
  { name: 'Recovery zone', detail: 'Foam rollers, massage guns and stretching space.' },
  { name: 'Hydration stations', detail: 'Filtered water and refill points throughout.' },
  { name: 'Wi-Fi & charging', detail: 'High-speed internet and charging points.' },
  { name: 'Sound system', detail: 'Premium audio throughout the floor.' },
  { name: 'Achievement wall', detail: 'Member milestones and personal records.' },
  { name: 'Valet parking', detail: 'Complimentary valet for premium members.' },
];

/* ------------------------------------------------------------------ */

export const VALUES: readonly Facility[] = [
  {
    name: 'Excellence',
    detail: 'In every part of the room — from the equipment to the coaching standard.',
  },
  { name: 'Community', detail: 'A floor where members push each other rather than compete.' },
  { name: 'Results', detail: 'A measured approach, tracked and reviewed.' },
  { name: 'Innovation', detail: 'Training methods and programmes that keep evolving.' },
];

export const PROMISE: readonly Facility[] = [
  {
    name: 'Certified trainers',
    detail: 'Every coach holds national or international certification.',
  },
  { name: 'Premium equipment', detail: 'Olympic barbells through to modern cardio.' },
  { name: 'Clean and safe', detail: 'Sanitised multiple times daily, CCTV throughout.' },
  { name: 'Flexible membership', detail: 'Terms from one month to two years. No hidden fees.' },
  { name: 'Personal attention', detail: 'Tailored guidance in group classes and one-to-one.' },
  { name: 'Community events', detail: 'Regular challenges, workshops and socials.' },
];

/* ------------------------------------------------------------------ */

export const FAQS: readonly Faq[] = [
  {
    q: 'Do I need prior fitness experience to join?',
    a: 'No. Members range from complete beginners to advanced athletes. Trainers build a plan that matches your current level and progresses safely.',
  },
  {
    q: 'Can I try a class before committing?',
    a: 'Yes. There is a free trial class, so you can see the floor, meet the trainers and decide whether it suits you.',
  },
  {
    q: 'What should I bring to a first session?',
    a: 'Comfortable clothes, athletic shoes, a water bottle and a towel. Lockers are provided. Bring your own gloves or belt if you prefer them.',
  },
  {
    q: 'Are your trainers certified?',
    a: 'Yes. All trainers hold national and international certifications in personal training, nutrition and specialised disciplines. Several compete professionally.',
  },
  {
    q: 'Is personal training included in the membership?',
    a: 'Group classes are included in every plan. Longer terms include a set number of one-to-one sessions, and further sessions are available as an add-on.',
  },
  {
    q: 'Do you provide diet and nutrition guidance?',
    a: 'Every membership includes a basic nutrition consultation. Customised meal plans and ongoing dietary support are available.',
  },
  {
    q: 'What are the membership cancellation terms?',
    a: 'Monthly memberships can be cancelled with 15 days’ notice. Terms of six months and longer may differ — the team will confirm the detail before you sign.',
  },
  {
    q: 'Is parking available?',
    a: 'Yes. There is free parking outside the facility, including covered parking for two-wheelers.',
  },
  {
    q: 'What safety measures are in place?',
    a: 'Equipment is sanitised regularly, first-aid trained staff are on site, classes are supervised by certified trainers, and CCTV covers the facility.',
  },
];

/* ------------------------------------------------------------------ */

/** ₹28,999 — grouped in the Indian numbering system. */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
