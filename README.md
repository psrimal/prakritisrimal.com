# Prakriti / Spatial Intelligence

Eleventy site. The atlas homepage is generated from one data file. The four written
project pages ship as they already are, with their own design intact.

## Run it

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # writes _site
```

## Deploy to Vercel

The repo already carries `vercel.json`, so there is nothing to configure in the
dashboard beyond connecting the repository.

```bash
npm i -g vercel
vercel            # first run, links the project
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard and push to `main`. Vercel reads
`buildCommand: npm run build` and `outputDirectory: _site` from `vercel.json`.
`cleanUrls` is on, so `/work/social-geometry` resolves without the `.html`.

For the custom domain, point `prakritisrimal.com` at Vercel in Namecheap:

- `A` record on `@` to `76.76.21.21`
- `CNAME` on `www` to `cname.vercel-dns.com`

Then add both hostnames under Project Settings, Domains. Remove the old GitHub
Pages records first or the domain will keep resolving to the old site.

## Assets you still need to add

Run this any time, it tells you exactly what is missing and where it goes:

```bash
npm run check-assets
```

It scans the four project pages for every `src`, `href`, `data-src`, `data-logo`
and `data-poster` that points at `/assets/`, then checks the file exists. 52 files
are referenced in total:

```
src/assets/isochroniccity/            14  hero.jpg, 01 to 11 mp4 and jpg
src/assets/isochroniccity/logos/       8  award and publication logos
src/assets/isochroniccity/posters/    10  video poster frames, one per mp4
src/assets/sensing/                    5  breadboard, rig, seed-award,
                                          system-diagram, street-detection.mp4
src/assets/sensing/posters/            1  03-street-detection.jpg
src/assets/socialgeometry/            12  01_footprints.png to 12_lorenz
src/assets/speed/                      2  dubai-street.jpg, london-street.jpg
```

Filenames are case sensitive once deployed to Vercel, even though Windows will
let you get away with the wrong case locally. Match them exactly.

The posters are optional in practice: a missing poster means the video shows a
black frame until it plays, rather than breaking. The logos are not optional,
they are the only images in the awards section.

## Structure

```
src/
  _data/projects.js      every investigation, one array. the single source
  _includes/base.njk     html shell
  index.njk              the atlas homepage
  assets/css/atlas.css   whole site stylesheet
  assets/js/atlas.js     globe, descent, atlas map, panels, search, demo
  work/<slug>/index.html the four standalone pages, passed through untouched
```

`src/_data/projects.js` drives the atlas cards, the globe tiers, the layer filters,
the command search and the investigation panels. Change it in one place and
everything downstream follows.

## Adding a new investigation

Append an object to `src/_data/projects.js`:

```js
{
  id: 'noise',                    // unique, used for the marker position key
  num: '07',
  domain: 'SOUND',                // becomes a filter chip and a map treatment
  color: 'sensing',               // active | water | form | sensing | network
  place: 'BENGALURU',
  year: '2026',
  maturity: 'IN BUILD',           // shows as the status chip on the card
  title: 'Full project title',
  question: 'The headline question',
  note: 'One line under the headline',
  blurb: 'Two lines on the atlas card',
  href: '/work/noise/',           // or null if there is no page yet
  views: [
    { id: 'story', label: 'STORY', blocks: [ /* see below */ ] }
  ]
}
```

Then add a marker position in `MARKER_POS` in `src/assets/js/atlas.js`, as
fractions of the map width and height: `noise: [0.4, 0.5]`.

### Block types

Each view is a list of blocks. The renderer supports:

| type | fields | use |
|---|---|---|
| `prose` | `kicker`, `h`, `p[]` | normal writing |
| `note` | `label`, `text` | a caveat or a credit, green rule on the left |
| `steps` | `items[[title, detail]]` | a numbered pipeline |
| `list` | `kicker`, `h`, `items[[term, detail]]` | definitions, awards, hardware |
| `table` | `kicker`, `h`, `head[]`, `rows[][]`, `foot` | measured values only |
| `findings` | `items[[claim, evidence]]` | two column result statements |
| `pending` | `items[[thing, what is needed]]` | honest gaps, renders orange |
| `graph` | none | the interactive reachability demo |

`table` and `findings` are the only blocks that should ever carry numbers. If a
number is not in a linked source, it belongs in a `pending` block instead.

## Adding a new written page

Create `src/work/<slug>/index.html` as a complete standalone HTML file. Eleventy
copies it verbatim rather than templating it, so it can carry its own CSS and
fonts. Link it from the project object with `href: '/work/<slug>/'`.

## Rules the site is built on

1. A value appears only if a linked source has it. Everything else is `pending`.
2. Schematic geometry says it is schematic in the viewport, not in a footnote.
3. Writing is labelled writing. The Speed of a City is an essay and says so.
4. City markers are tiered: study, research, comparison, writing. A city does not
   get a full marker for being mentioned.
