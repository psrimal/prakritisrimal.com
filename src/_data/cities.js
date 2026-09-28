/* The city tour. Each stop is a camera position plus the work that lives there.
   status: 'live' links out and renders at full strength. Anything else renders
   dimmed with its status label and no link.

   camera.km is roughly how much ground should fill the shorter side of the
   screen when the camera arrives. The map data for each city is loaded from
   /assets/data/city-<id>.json if it exists, written by tools/build_city.py. */

export default [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    kicker: 'STUDY CITY',
    lat: 12.9716, lon: 77.5946,
    camera: { km: 70 },
    hero: {
      q: 'What does the city sound like?',
      title: 'Real Time Sensing',
      status: 'live',
      label: 'IN BUILD',
      text: 'An edge instrument on a Jetson Orin Nano that records sound, air quality, temperature, humidity and video against one GPS coordinate and one clock. Diagnosis before design. SEED Chairman Award.',
      href: '/work/real-time-sensing/'
    },
    analyses: [
      { q: 'What can you reach in fifteen minutes?', status: 'planned', label: 'NOT YET',
        text: 'Walking reach on the real network, merged with transit access, and where new transit would close the largest gaps.' },
      { q: 'Where did the water go?', status: 'planned', label: 'NOT YET',
        text: 'Surface water change across the lake chain, and flooding read against the water bodies that were lost.' },
      { q: 'Which way is the city growing?', status: 'planned', label: 'NOT YET',
        text: 'Land cover change over time, sliced into growth direction and loss of green.' },
      { q: 'What changes if the network changes?', status: 'planned', label: 'NOMINATED',
        text: 'Scenario Simulator. Nominated for the Sidara Endeavour Program, 2026.' }
    ]
  },
  {
    id: 'london',
    name: 'London',
    kicker: 'RESEARCH',
    lat: 51.5074, lon: -0.1278,
    camera: { km: 55 },
    hero: {
      q: 'What does urbanisation look like in the post covid era?',
      title: 'IsoChronic City',
      status: 'live',
      label: 'AWARDED',
      text: 'MArch thesis at the Bartlett. Spatial signatures, urban decay across 2010, 2015 and 2019, amenity grading and angular step depth, feeding a generative loop that proposes void, mobile and elevated street segments. Team of four.',
      href: '/work/isochronic-city/'
    },
    analyses: []
  },
  {
    id: 'india',
    name: 'Five Indian cities',
    kicker: 'COMPARISON',
    lat: 21.0, lon: 79.5,
    camera: { km: 3400 },
    hero: {
      q: 'How do cities shape encounters?',
      title: 'The Social Geometry of Indian Cities',
      status: 'live',
      label: 'MEASURED',
      text: 'Delhi, Mumbai, Kolkata, Chennai and Bengaluru, each cut by a ten kilometre network distance ball from its historic core and measured the same way. Kolkata comes out least connected, which is close to the opposite of the usual story.',
      href: '/work/social-geometry/'
    },
    analyses: [
      { q: 'How fine is the grain?', status: 'live', label: 'MEASURED',
        text: 'Bengaluru has 136 intersections per square kilometre, Mumbai 58.', href: '/work/social-geometry/#findings' },
      { q: 'What shape is a junction?', status: 'live', label: 'MEASURED',
        text: 'Kolkata has the most dead ends and the fewest four way junctions of the five.', href: '/work/social-geometry/#junction' },
      { q: 'Which way do the streets point?', status: 'live', label: 'MEASURED',
        text: 'Chennai is the most directionally ordered, pinned to its coastline.', href: '/work/social-geometry/#direction' },
      { q: 'Which streets carry the load?', status: 'live', label: 'MEASURED',
        text: 'Delhi has the strongest hierarchy. Mumbai the least concentrated through movement.', href: '/work/social-geometry/#load' }
    ]
  },
  {
    id: 'singapore',
    name: 'Singapore',
    kicker: 'NEXT',
    lat: 1.3521, lon: 103.8198,
    camera: { km: 45 },
    hero: {
      q: 'What is a planned city made of?',
      title: 'Urban morphology',
      status: 'planned',
      label: 'NOT YET',
      text: 'Block, street and building pattern for a city planned end to end, as a counterpoint to five that mostly were not.'
    },
    analyses: [
      { q: 'Where does movement concentrate?', status: 'planned', label: 'NOT YET',
        text: 'Space syntax on the full network, validated against observed movement where it exists.' }
    ]
  }
];
