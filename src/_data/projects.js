/* Single source of truth. The atlas cards, the globe, the search index and the
   investigation panels all read from here. Nothing carries a number unless the
   number exists in the linked page. */

export default [
  {
    id: 'isochronic',
    num: '01',
    domain: 'ACCESS',
    color: 'network',
    place: 'LONDON',
    year: '2023',
    maturity: 'AWARDED',
    title: 'IsoChronic City',
    question: 'How far can you actually get?',
    note: 'A radius is not a journey. Reach follows the graph people can actually walk.',
    blurb: 'MArch thesis at the Bartlett. Machine learning and space syntax applied to the fifteen minute neighbourhood in London.',
    href: '/work/isochronic-city/',
    credit: 'Team of four: Prakriti Srimal, Sonali Bordia, Shuyao Li, Siyang Zheng. Bartlett B-Pro, RC14 Machine Thinking Urbanism.',
    views: [
      { id: 'story', label: 'STORY', blocks: [
        { type: 'prose', kicker: 'ISOCHRONIC CITY / LONDON / 2023',
          h: 'A radius is not a journey.',
          p: [
            'The fifteen minute neighbourhood is usually drawn as a circle. A circle assumes you can walk through buildings, railways and rivers. Two addresses the same straight line distance from a station can be five minutes and twenty five minutes away from it.',
            'The thesis takes that gap seriously. Spatial signatures built from density, land use, deprivation, accessibility and connectivity pick out a dense residential fabric in London. Layered datasets from 2010, 2015 and 2019 identify where that fabric is decaying. A grading model scores amenity access at varying radii, angular step depth segments the network, and a multi objective optimisation selects the four worst performing street segments as the sites of intervention.',
            'What comes out is a generative loop rather than a masterplan: void segments, mobile segments positioned by footfall, and elevated segments that shorten travel while lifting pedestrians clear of traffic.'
          ] },
        { type: 'note', label: 'CREDIT', text: 'A team project. Prakriti Srimal, Sonali Bordia, Shuyao Li and Siyang Zheng, supervised under RC14, Machine Thinking Urbanism.' }
      ]},
      { id: 'demo', label: 'DEMO', blocks: [
        { type: 'graph' }
      ]},
      { id: 'method', label: 'METHOD', blocks: [
        { type: 'prose', kicker: 'METHOD', h: 'Nine steps from signature to intervention.', p: [
          'The pipeline below is the one described on the project page. It mixes conventional spatial analysis with machine learning rather than treating either as the whole answer.'
        ]},
        { type: 'steps', items: [
          ['Spatial signature', 'Density, land use, accessibility, deprivation and connectivity, reduced with PCA and clustered with K-Means'],
          ['Urban decay', 'Layers from 2010, 2015 and 2019 overlaid to find where reurbanisation has failed'],
          ['Grading the city', 'Amenity count and distance scored at varying radii and modes'],
          ['Angular step depth', 'Space syntax segmentation of how the fifteen minute definition shifts along the street'],
          ['Optimisation', 'Multi objective selection of the four weakest segments'],
          ['Generative loop', 'Twenty derived segments fed back through the loop with CNN outputs']
        ]}
      ]},
      { id: 'awards', label: 'AWARDS', blocks: [
        { type: 'list', kicker: 'RECOGNITION', h: 'Where it has been published.', items: [
          ['Gold medal', 'World Architecture Student Awards, World League Series, November 2022'],
          ['Student Award', 'Media Architecture Biennale 2023, Equitable and Sustainable Media Architecture, June 2023'],
          ['Inspireli Awards', 'Presented at the Media Architecture Biennale'],
          ['ArchDaily', 'Featured as part of the MAB23 award, November 2023'],
          ['Arch Hive and ArchiDiaries', 'Published'],
          ['UCL Bartlett', 'Covered by the Faculty of the Built Environment, April 2023'],
          ['B-Pro Show 2022', 'Exhibited under RC14, Machine Thinking Urbanism']
        ]}
      ]}
    ]
  },

  {
    id: 'geometry',
    num: '02',
    domain: 'FORM',
    color: 'form',
    place: 'FIVE INDIAN CITIES',
    year: '2026',
    maturity: 'MEASURED',
    title: 'The Social Geometry of Indian Cities',
    question: 'What is a city made of?',
    note: 'What five street networks can, and cannot, tell us about the way cities shape everyday encounters.',
    blurb: 'Grain, block scale, connectivity, dead ends and orientation measured across Delhi, Mumbai, Kolkata, Chennai and Bengaluru.',
    href: '/work/social-geometry/',
    views: [
      { id: 'story', label: 'STORY', blocks: [
        { type: 'prose', kicker: 'SOCIAL GEOMETRY / FIVE CITIES / 10 KM',
          h: 'The streets did not explain the people.',
          p: [
            'It started as a question about whether the shape of a city explains the temperament of the people in it. My professor once said that cities design encounters. Hillier says something more careful: the arrangement of streets is the single most powerful factor determining where movement concentrates, and repeated movement makes repeated chances to meet.',
            'Five cities, cut not by municipal boundary and not by a circle, but by a ten kilometre network distance ball from each historic core. The Pete in Bengaluru, the Red Fort in Delhi, the Fort in Mumbai, BBD Bagh in Kolkata, Fort St George in Chennai.',
            'The ranking is not stable below six kilometres. At three kilometres the orderings scramble and one inverts completely, because Chennai\u2019s three kilometre ball contains 156 junctions and half of it is sea. Everything reported here is drawn at ten kilometres and holds at fifteen.'
          ]},
        { type: 'note', label: 'THE PART THAT SURPRISED ME', text: 'I expected Kolkata to be the most continuous network of the five, because the usual account of adda culture rests on exactly that. It is the least connected: the most dead ends, the fewest four way junctions, the highest circuity. Delhi, normally cast as the car dominated opposite, has the most permeable network in the set. The morphological explanation for Kolkata\u2019s street life is, at this scale and on this network, close to backwards.' }
      ]},
      { id: 'metrics', label: 'METRICS', blocks: [
        { type: 'table', kicker: 'MEASURED / 10 KM NETWORK BALL / OSM DRIVE NETWORK',
          h: 'Five ways of asking how a city is cut up.',
          head: ['City', 'Int / km²', 'Segment m', 'Streets / node', 'Dead ends', '4-way+', 'Circuity', 'Phi', 'Gini'],
          rows: [
            ['Delhi', '74.2', '65.4', '2.94', '12.0%', '18.1%', '1.034', '0.044', '0.756'],
            ['Mumbai', '57.9', '84.3', '2.86', '15.3%', '17.0%', '1.049', '0.061', '0.654'],
            ['Kolkata', '81.8', '70.8', '2.66', '21.5%', '8.7%', '1.054', '0.177', '0.748'],
            ['Chennai', '90.4', '71.8', '2.79', '17.4%', '13.4%', '1.038', '0.333', '0.709'],
            ['Bengaluru', '135.6', '59.2', '2.81', '17.9%', '17.2%', '1.023', '0.255', '0.740']
          ],
          foot: 'All values at a ten kilometre network distance ball from the historic core. Drive network, OpenStreetMap. Densities normalised by a concave hull of the node cloud so coastal cities are not penalised for water.' },
        { type: 'findings', items: [
          ['Bengaluru is the finest grained', '136 intersections per square kilometre against Delhi\u2019s 74 and Mumbai\u2019s 58. Shortest streets at 59 metres, and the most direct routes.'],
          ['Mumbai is constrained, not hierarchical', 'The coarsest grain and the longest streets, with 21 percent of network length in segments over 300 metres against Bengaluru\u2019s 5 percent. Yet the least concentrated through movement of the five, Gini 0.654.'],
          ['Delhi has the strongest hierarchy', 'Gini 0.756, top decile of streets carrying 61 percent of through movement, against Mumbai\u2019s 47 percent. Constraint and hierarchy turn out to be different things.'],
          ['Chennai is the most directionally ordered', 'Phi 0.33, its grid pinned to a coastline running north to south. Delhi scores lowest at 0.04, which means not aligned to a single axis rather than unplanned.']
        ]}
      ]},
      { id: 'method', label: 'METHOD', blocks: [
        { type: 'steps', items: [
          ['Extract', 'Drive network pulled from an OpenStreetMap PBF extract with pyrosm'],
          ['Cut', 'Ten kilometre network distance ball from each historic core, not a municipal boundary and not a Euclidean buffer'],
          ['Measure', 'Grain, segment length, streets per node, dead end share and circuity with OSMnx, GeoPandas and NetworkX'],
          ['Orient', 'Bearings binned into 36 ten degree bins, length weighted, Shannon entropy rescaled to an order parameter following Boeing'],
          ['Load', 'Metric betweenness centrality as an approximation of foreground and background network'],
          ['Stabilise', 'Every metric run at 3, 6, 10 and 15 km. Rankings only lock from 6 km outward, so 10 km is reported']
        ]}
      ]},
      { id: 'limits', label: 'LIMITS', blocks: [
        { type: 'prose', kicker: 'WHAT THIS CANNOT SAY', h: 'A smaller conclusion I trust more.',
          p: [
            'The street network cannot tell us why people living in a city have the personality they have. Those are claims about people. What it can tell us is where movement concentrates, how permeable a fabric is, how often routes intersect and how much local circulation detours.'
          ]},
        { type: 'list', items: [
          ['Drive network only', 'Kolkata\u2019s galis, where a great deal of its street life actually happens, are largely excluded by that filter. Its pedestrian network may tell the opposite story, and that discrepancy would itself be the finding.'],
          ['Metric, not angular', 'Betweenness on shortest metric paths shows where routes would concentrate if everyone minimised distance. Space syntax uses angular cost and validates against counted pedestrians. Neither was done here.'],
          ['Self selection', 'People choose where they live.'],
          ['Composition', 'History and migration plausibly explain more about behaviour than geometry alone.'],
          ['Mapping bias', 'OpenStreetMap is not equally complete everywhere.']
        ]}
      ]}
    ]
  },

  {
    id: 'sensing',
    num: '03',
    domain: 'SENSING',
    color: 'sensing',
    place: 'BENGALURU',
    year: 'ONGOING',
    maturity: 'IN BUILD',
    title: 'Real Time Sensing',
    question: 'What does the city sound like?',
    note: 'An edge instrument that listens, watches and breathes with the street, tied to one coordinate and one clock.',
    blurb: 'Six inputs into one edge device. Sound, temperature, humidity, air quality and video, synchronised on a single timestamp.',
    href: '/work/real-time-sensing/',
    views: [
      { id: 'story', label: 'STORY', blocks: [
        { type: 'prose', kicker: 'REAL TIME SENSING / BENGALURU / DAR SEED INNOVATION',
          h: 'Some data has to be collected, not downloaded.',
          p: [
            'Urban designers are trained to read the city through what can be seen: form, density, movement, light. What rarely gets captured is what a street sounds, feels and breathes like while it is happening. Maps, simulations and averaged datasets do not tell you whether a specific street is too loud, too hot, or why people avoid it.',
            'The device puts five sensors on one GPS coordinate and one timestamp. Not five streams, one synchronised observation of a place at a moment. Sound and video are not independent readings here, they contextualise everything else: high particulate matter means something different on a street choked with traffic than on one that looks empty.',
            'The use case is diagnosis before design. I had never built hardware before this, and building the instrument that makes the dataset turns out to be a completely different discipline from analysing one.'
          ]},
        { type: 'note', label: 'RECOGNITION', text: 'Selected for the incubation stage of Dar\u2019s SEED Innovation programme, and later awarded the SEED Chairman Award for Sounds of the City.' }
      ]},
      { id: 'system', label: 'SYSTEM', blocks: [
        { type: 'list', kicker: 'HARDWARE', h: 'Six inputs, one edge device.', items: [
          ['Platform', 'NVIDIA Jetson Orin Nano Super, edge inference on device'],
          ['Audio', 'MEMS microphone'],
          ['Air', 'PM2.5 and PM10'],
          ['Environment', 'Temperature and humidity'],
          ['Vision', 'IMX477 camera'],
          ['Position and time', 'GPS, with everything written timestamped to an SD card so the readings stay tied to each other']
        ]}
      ]},
      { id: 'status', label: 'STATUS', blocks: [
        { type: 'prose', kicker: 'BUILD LOG', h: 'Documented as it goes, including the walls.',
          p: ['Five build updates published so far. Site selection is under way. The build log records the failures as well as the working sensors, because the argument is that people who understand cities can also build the tools to listen to them.']},
        { type: 'note', label: 'WHAT IS NOT HERE YET', text: 'No deployment findings, no calibration record and no classification accuracy. Those arrive when sites are fixed and the instrument has run long enough to say something.' }
      ]}
    ]
  },

  {
    id: 'speed',
    num: '04',
    domain: 'PACE',
    color: 'active',
    place: 'LONDON AND DUBAI',
    year: '2026',
    maturity: 'WRITING',
    title: 'The Speed of a City',
    question: 'Why did London feel warmer than Dubai?',
    note: 'An essay, not an analysis. An impression about pace and encounter, set down honestly as an impression.',
    blurb: 'Why one city felt warmer than another, and why it might have less to do with people than with speed.',
    href: '/work/speed-of-a-city/',
    views: [
      { id: 'story', label: 'STORY', blocks: [
        { type: 'prose', kicker: 'WRITING / LONDON AND DUBAI',
          h: 'Maybe warmth is a characteristic of streets.',
          p: [
            'Two cities back to back. London felt warmer, not in temperature but in the way strangers behave. A nod on the pavement, a word to the bus driver, a barista who talks to you. My first instinct was culture. I think it is speed.',
            'Dubai moves at sixty kilometres an hour between air conditioned boxes. London moves at walking pace, sharing pavements, waiting at crossings, standing on platforms together. At five kilometres an hour you have time to notice the person holding the door.',
            'We measure cities by travel time, congestion, density and accessibility. None of those capture the likelihood of a human encounter. A wider pavement is not only pedestrian capacity and a slower street is not only road safety. They are invitations to linger.'
          ]},
        { type: 'note', label: 'WHAT THIS IS AND IS NOT', text: 'This is a piece of writing built on an impression and on Jan Gehl\u2019s Life Between Buildings, which makes the same argument with counts rather than anecdote. Nothing here is measured. It sits in the atlas because the question is worth asking, not because it has been answered.' }
      ]}
    ]
  },

  {
    id: 'scenario',
    num: '05',
    domain: 'SCENARIO',
    color: 'water',
    place: 'BENGALURU',
    year: '2026',
    maturity: 'NOMINATED',
    title: 'Scenario Simulator',
    question: 'What changes if the network changes?',
    note: 'Editing a city network and recomputing what it does, instead of arguing about what it might do.',
    blurb: 'Nominated for the Sidara Endeavour Program, 2026. A tool for testing spatial interventions against a recomputed network.',
    href: null,
    views: [
      { id: 'story', label: 'STORY', blocks: [
        { type: 'prose', kicker: 'SCENARIO SIMULATOR / NOMINATED 2026',
          h: 'An intervention is a change to a graph.',
          p: [
            'Most proposals for a street, a crossing or a link are argued rather than tested. A scenario simulator treats the intervention as an edit to the network and recomputes what the network then does: what becomes reachable, where movement would concentrate, what stops being a detour.',
            'The demo under the access investigation shows the principle at its smallest, one crossing added to a generated graph. The real thing works on a measured network with real travel costs.'
          ]},
        { type: 'note', label: 'RECOGNITION', text: 'Nominated for the Sidara Endeavour Program, 2026. A nomination, not an award, and nothing here is built yet beyond the principle.' }
      ]},
      { id: 'status', label: 'STATUS', blocks: [
        { type: 'pending', items: [
          ['Scope', 'Which network, which city, which class of intervention'],
          ['Cost model', 'Travel impedance, and whether it varies by ability and time of day'],
          ['Evaluation', 'What a candidate edit is scored against beyond reachability'],
          ['Constraints', 'Cost, safety and feasibility, so the output is a question rather than a recommendation']
        ]}
      ]}
    ]
  },

  {
    id: 'water',
    num: '06',
    domain: 'WATER',
    color: 'water',
    place: 'BENGALURU',
    year: null,
    maturity: 'CONCEPT',
    title: 'Where did the water go?',
    question: 'Where did the water go?',
    note: 'The lake chain and the surface that used to drain into it. A question with no work behind it yet.',
    blurb: 'Concept. No source data attached, no method and no finding.',
    href: null,
    views: [
      { id: 'story', label: 'STORY', blocks: [
        { type: 'prose', kicker: 'CONCEPT / SOURCE PENDING', h: 'Nothing is measured here yet.',
          p: ['This signal stays on the map because the question is real and the work has not started. It carries no data, no method and no finding, and it will not carry a number until a source is attached to it.']},
        { type: 'pending', items: [
          ['Lake chain', 'Source and vintage for the tank network, historic and current'],
          ['Surface', 'Land cover or impervious surface source'],
          ['Claim', 'The specific thing worth testing, rather than the general lament']
        ]}
      ]}
    ]
  }
];
