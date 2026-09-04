// Single source of truth. Every fact here was taken from atcfootball.com/atcsports.
// Nothing is invented. If ATC can't deliver it, it isn't on this page.

export const org = {
  name: 'ATC Sports',
  tagline: 'Built To Compete',
  kicker: 'Flag Football · 7v7 · Training',
  city: 'Roseville, California',
  phone: '(209) 986-0460',
  phoneHref: 'tel:+12099860460',
  president: 'AJ Barnett',
  registerUrl: 'https://app.teamlinkt.com/register/find/atcsports',
  socials: [
    { name: 'Instagram', handle: '@atcsports.roseville', url: 'https://instagram.com/atcsports.roseville' },
    { name: 'Facebook', handle: 'ATCsportsRoseville', url: 'https://www.facebook.com/ATCsportsRoseville/' },
  ],
  live: {
    schedule: 'https://atcfootball.com/atcsports/Schedule',
    scores: 'https://atcfootball.com/atcsports/Scores',
    standings: 'https://atcfootball.com/atcsports/Standings',
    photos: 'https://atcfootball.com/leagues/AllAlbums/36743',
  },
}

export const venues = [
  {
    name: 'Whitney High School',
    detail: 'Fields 1 to 4',
    address: '701 Wildcat Boulevard, Rocklin, CA',
    map: 'https://maps.google.com/maps?q=38.8358740,-121.2867880',
  },
  {
    name: 'Mahany Park',
    detail: 'Football Field',
    address: 'Roseville, CA',
    map: 'https://maps.google.com/maps?q=Mahany+Park+Football+Field+Roseville+CA',
  },
]

// Answers the four questions every parent asks before they'll sign up.
export const parentPromises = [
  {
    title: 'One Saturday, done',
    body: 'Practice runs the hour before your kid’s game, on the same field, same morning. No weeknight driving, no second trip across town.',
  },
  {
    title: 'Real fields, real officials',
    body: 'Games are played at Whitney High School and Mahany Park with quality officials on every game. It looks and feels like the real thing.',
  },
  {
    title: 'Ten players. Everybody plays.',
    body: 'Rosters are capped at 10 so your child touches the ball and gets real reps, not a season on the sideline.',
  },
  {
    title: 'Keep their friends',
    body: 'Friend and coach requests are honored whenever possible, first come, first served. Sign up early and they stay with their crew.',
  },
]

export const programs = [
  {
    slug: 'flag-football',
    href: '/flag-football',
    name: 'Flag Football',
    ages: 'Pre-K to 8th Grade · Co-Ed & Girls',
    blurb:
      'A nine-week Saturday league where practice and game happen back to back. Built for first-timers and seasoned athletes alike.',
    image: '/img/hero-action.jpg',
    alt: 'ATC Sports player in a black and gold jersey breaking free down the sideline',
    stats: [
      ['9', 'Saturdays'],
      ['10', 'Players max'],
      ['9', 'Divisions'],
    ],
  },
  {
    slug: '7v7',
    href: '/7v7',
    name: '7-on-7',
    ages: 'Teams, coaches & programs',
    blurb:
      'Off-season passing league. No linemen, no tackling. Pure quarterback play, route running, coverage and football IQ.',
    image: '/img/qb-drop.jpg',
    alt: 'Young quarterback dropping back to pass while a coach looks on',
    stats: [
      ['5', 'Week season'],
      ['2', 'Games a day'],
      ['21', 'Min running clock'],
    ],
  },
  {
    slug: 'camps',
    href: '/camps',
    name: 'Camps & Clinics',
    ages: 'All levels',
    blurb:
      'High-intensity skills camps built around speed, agility, football IQ and position-specific technique with expert coaching.',
    image: '/img/action-3.jpg',
    alt: 'An ATC Sports athlete running the ball during a skills session',
    stats: [
      ['2', 'Hour sessions'],
      ['3', 'Coaching partners'],
      ['4', 'Skill pillars'],
    ],
  },
]

export const flagFootball = {
  season: 'Winter 2026',
  window: 'Saturdays · November 14, 2026 to January 9, 2027',
  locations: 'Whitney High School or Mahany Park Football Field',
  weather:
    'Games are played rain or shine unless extreme weather or unforeseen circumstances require cancellation or postponement.',
  scheduleNote:
    'Final schedules are confirmed in late October and emailed to every registered participant.',
  weeks: [
    ['Week 1', 'Saturday, November 14'],
    ['Week 2', 'Saturday, November 21'],
    ['Week 3', 'November 28 (Thanksgiving Weekend)'],
    ['Week 4', 'Saturday, December 5'],
    ['Week 5', 'Saturday, December 12'],
    ['Week 6', 'Saturday, December 19'],
    ['Week 7', 'Bye week (Christmas)'],
    ['Week 8', 'Saturday, January 2'],
    ['Week 9', 'Saturday, January 9 (Championship)'],
  ],
  times: [
    ['Kindergarten', '9:00 AM', '10:00 AM'],
    ['1st / 2nd Grade', '10:00 AM', '11:00 AM'],
    ['3rd / 4th Grade', '11:00 AM', '12:00 PM'],
    ['5th / 6th Grade', '12:00 PM', '1:00 PM'],
    ['7th / 8th Grade', '1:00 PM', '2:00 PM'],
  ],
  pricing: [
    { label: 'Early Bird', price: '$220', note: 'Ends June 14', best: true },
    { label: 'Regular', price: '$240', note: 'Ends October 2', best: false },
    { label: 'Late', price: '$265', note: 'Ends October 24', best: false },
  ],
  feeNote:
    'Full-season registration is $240. First season includes a custom uniform that can be worn in future seasons, a $45 saving.',
  uniformNote:
    'Uniforms are a separate one-time purchase and include a lightweight premium reversible jersey with customizable name and number. Jerseys can be reused in future seasons, which keeps league costs down while still giving athletes a custom uniform they are proud to wear.',
  refunds: [
    ['4+ weeks before the first scheduled event', '100% refund'],
    ['Before the 2nd game of the season', '50% refund'],
    ['After the 2nd game of the season', 'No refund'],
  ],
  refundNote:
    'All refund requests must be submitted in writing to the League Operator. Uniform purchases are non-refundable. If the season is canceled after the 4th game due to unforeseen circumstances, no refunds will be issued.',
}

export const divisions = {
  coed: ['Pre-K / Kindergarten', '1st / 2nd Grade', '3rd / 4th Grade', '5th / 6th Grade', '7th / 8th Grade'],
  girls: ['1st / 2nd Grade', '3rd / 4th Grade', '5th / 6th Grade', '7th / 8th Grade'],
}

export const sevens = {
  intro:
    'ATC Sports 7-on-7 Football is designed to develop and refine the passing game on both sides of the ball. This fast-paced format focuses on quarterback play, route running, timing, defensive coverage, communication, and overall football IQ in a competitive off-season environment.',
  who:
    'Our league is primarily designed for local football programs, coaches, and athletes looking to gain valuable off-season development and team chemistry before the fall season. Teams are encouraged to have multiple coaches who can effectively implement offensive play calling and defensive coverage schemes throughout the season.',
  field:
    'Games are played on a 40-yard field divided into zones, with all possessions beginning at the 40-yard line. Teams earn a first down at the 25-yard line and another first down at the 10-yard line.',
  rules: [
    'No tackling',
    'No offensive or defensive linemen',
    'No blocking permitted',
    'Quarterbacks are strictly passers and may not run the ball',
    'Quarterbacks have 4.0 seconds to release the football',
    'Failure to throw in time is a dead play and loss of down',
    'Players are ruled down by a one-hand touch below the neck',
  ],
  scoring: [
    ['Touchdown', '6 pts'],
    ['PAT from the 5-yard line', '1 pt'],
    ['PAT from the 10-yard line', '2 pts'],
    ['Defensive interception', '2 pts'],
  ],
  structure: ['5-week season', '2 games per team each game day', '21-minute running clock games', 'Competitive off-season development environment'],
}

export const camp = {
  name: 'Elite Youth Football Skills Camp',
  blurb:
    'A high-intensity skills camp designed to help athletes of all levels improve their speed, agility, football IQ and position-specific technique through expert coaching and competitive drills.',
  dates: 'June 20 and June 27',
  time: '9:00 AM to 11:00 AM',
  location: 'Mahany Football Fields',
  partners: ['ATC Sports', 'Football Phenoms', 'Dynamic Training'],
  pillars: [
    'Speed & Explosiveness',
    'Agility & Footwork',
    'Position-Specific Drills',
    'Compete. Improve. Win.',
  ],
}

// Game day photos only. The camp flyer is a promo graphic, not a game day photo, so
// it does not belong in this set.
export const gallery = [
  { src: '/img/hero-action.jpg', alt: 'An ATC Sports player breaking away down the sideline as a defender dives for the flag' },
  { src: '/img/catch.jpg', alt: 'A young receiver securing a catch on the Whitney Wildcats field' },
  { src: '/img/flag-pull.jpg', alt: 'A defender reaching for the flag as a ball carrier cuts into the end zone' },
  { src: '/img/qb-drop.jpg', alt: 'A quarterback setting his feet to throw while his coach watches' },
  { src: '/img/action-3.jpg', alt: 'An ATC Sports player running the ball back up the sideline during a Saturday game' },
  { src: '/img/action-5.jpg', alt: 'A young athlete releasing a pass as a coach looks on from the sideline' },
  // Tall frame, subject high in it: without this the crop cuts his face off.
  { src: '/img/champion.jpg', alt: 'An ATC Sports player in a white and gold jersey flexing on the field', pos: 'object-[center_15%]' },
]

// Top-level navigation. The league tools group under one item so the bar stays a
// single row; every destination is still reachable in one hover or one tap.
export const nav = [
  { label: 'Flag Football', href: '/flag-football' },
  { label: '7-on-7', href: '/7v7' },
  { label: 'Camps', href: '/camps' },
  {
    label: 'League',
    href: '/schedule',
    children: [
      { label: 'Schedule', href: '/schedule', note: 'Nine Saturdays, week by week' },
      { label: 'Divisions', href: '/divisions', note: 'Co-ed and girls, Pre-K to 8th' },
      { label: 'Standings', href: '/standings', note: 'Records by division' },
      { label: 'Locations', href: '/locations', note: 'Whitney High and Mahany Park' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

// Flattened, for the mobile menu and the footer, where there is room for all of it.
export const navFlat = nav.flatMap((item) => (item.children ? item.children : [item]))

// Uniform sizing, transcribed from the chart ATC publishes on its Flag Football page.
// Chest and waist are body measurements of the wearer, in inches.
export const sizing = {
  intro:
    'Chest and waist refer to the body measurements of the wearer, in inches. For a measurement between two sizes, choose the larger size for a looser fit.',
  howTo: [
    ['Chest', 'Measure around the fullest part of the chest.'],
    ['Waist', 'Measure around the natural waist.'],
  ],
  notes: [
    'Larger and smaller sizes are available on request, in 10% sizing increments.',
    'Tall sizes are available on request.',
  ],
  groups: [
    {
      id: 'youth-boys',
      label: 'Youth Boys',
      sub: 'US size',
      sizes: [
        { code: 'YXS', us: '6' },
        { code: 'YS', us: '7-8' },
        { code: 'YM', us: '10-12' },
        { code: 'YL', us: '14' },
        { code: 'YXL', us: '16' },
      ],
      rows: {
        Chest: ['24 - 26', '26 - 28', '28 - 30', '30 - 32', '33 - 34'],
        Waist: ['20 - 22', '22 - 24', '24 - 26', '26 - 28', '29 - 31'],
      },
    },
    {
      id: 'youth-girls',
      label: 'Youth Girls',
      sub: 'US size',
      sizes: [
        { code: 'YXS', us: '6' },
        { code: 'YS', us: '7-8' },
        { code: 'YM', us: '10-12' },
        { code: 'YL', us: '14' },
        { code: 'YXL', us: '16' },
      ],
      rows: {
        Chest: ['24 - 26', '26 - 28', '28 - 30', '30 - 32', '33 - 34'],
        Waist: ['20 - 22', '22 - 24', '24 - 26', '26 - 28', '29 - 31'],
      },
    },
    {
      id: 'men',
      label: 'Men',
      sub: 'Unisex',
      sizes: [
        { code: 'XS' }, { code: 'S' }, { code: 'M' }, { code: 'L' },
        { code: 'XL' }, { code: '2XL' }, { code: '3XL' },
      ],
      rows: {
        Chest: ['30 - 32', '34 - 36', '38 - 40', '42 - 44', '46 - 48', '50 - 52', '54 - 56'],
        Waist: ['24 - 26', '28 - 30', '32 - 34', '36 - 38', '40 - 42', '44 - 46', '48 - 50'],
      },
    },
    {
      id: 'women',
      label: 'Women',
      sizes: [
        { code: 'WXS' }, { code: 'WS' }, { code: 'WM' },
        { code: 'WL' }, { code: 'WXL' }, { code: 'W2XL' },
      ],
      rows: {
        Chest: ['32 - 33', '34 - 35', '36 - 37', '38.5 - 39.5', '41.5 - 42.5', '44.5 - 45.5'],
        Waist: ['24 - 26', '26 - 28', '28 - 30', '30.5 - 32.5', '33.5 - 35.5', '36.5 - 38.5'],
      },
    },
  ],
}

// The Winter 2026 roster exactly as the league has it entered. Numbered teams are
// placeholders the league names later; the rest are named after their coach.
export const teams = [
  { division: 'Co-Ed', grade: 'Pre-K / Kindergarten', list: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  { division: 'Co-Ed', grade: '1st / 2nd Grade', list: ['2', '3', '4', '5', '6', 'Competente', 'Johnson', 'Ramsey'] },
  { division: 'Co-Ed', grade: '3rd / 4th Grade', list: ['1', '2', '4', 'Casey', 'Jaime', 'Rapp', 'Van Tassel'] },
  { division: 'Co-Ed', grade: '5th / 6th Grade', list: ['2', '3', '4', '5', '6', '7', '8', 'Casey'] },
  { division: 'Co-Ed', grade: '7th / 8th Grade', list: ['1', '2', '3', '4', '5', '6', '7', 'Johnson'] },
  { division: 'Girls', grade: '1st / 2nd Grade', list: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  { division: 'Girls', grade: '3rd / 4th Grade', list: ['1', '2', '3', '4', '5', '6', '7', 'Texon'] },
  { division: 'Girls', grade: '5th / 6th Grade', list: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  { division: 'Girls', grade: '7th / 8th Grade', list: ['1', '2', '3', '4', '5', '6', '7', '8'] },
]

// Columns the league keeps for standings, in TeamLinkt's order.
export const standingsColumns = [
  ['GP', 'Games played'],
  ['W', 'Won'],
  ['L', 'Lost'],
  ['T', 'Tied'],
  ['PTS', 'Points'],
  ['F', 'Points for'],
  ['A', 'Points against'],
]
