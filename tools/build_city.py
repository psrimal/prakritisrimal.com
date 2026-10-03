"""
Build street-network + administrative-boundary layers for one city.

Example:

    python tools/build_city.py \
        --pbf data/bengaluru-roads/southern-zone-latest.osm.pbf \
        --id bengaluru \
        --bbox 77.25,12.65,77.95,13.30 \
        --boundary data/bengaluru-district/district.shp \
        --local

Output:

    src/assets/data/city-bengaluru.json

The output contains:

    layers.major
    layers.minor
    layers.local      (when --local is supplied)
    layers.boundary

No water layer is generated.
"""

import argparse
import json
import os
import sys

import geopandas as gpd
from shapely.geometry import (
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
    box,
)
from shapely.ops import linemerge, unary_union


# ---------------------------------------------------------------------
# Road classes
# ---------------------------------------------------------------------

MAJOR = {
    "motorway",
    "motorway_link",
    "trunk",
    "trunk_link",
    "primary",
    "primary_link",
}

MINOR = {
    "secondary",
    "secondary_link",
    "tertiary",
    "tertiary_link",
}

LOCAL = {
    "residential",
    "unclassified",
    "living_street",
}


# Coordinates stored as integer deltas.
# 0.00001 degrees is roughly ~1 metre.
UNIT = 1e-5

# Maximum number of encoded points across road layers.
# Boundary is intentionally not counted against the road budget.
DEFAULT_BUDGET = 180_000


# ---------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------

def lines_of(geom):
    """
    Convert supported geometry types into LineStrings.
    Polygon boundaries become exterior/interior LineStrings.
    """

    if geom is None or geom.is_empty:
        return []

    if isinstance(geom, LineString):
        return [geom]

    if isinstance(geom, MultiLineString):
        return list(geom.geoms)

    if isinstance(geom, Polygon):
        lines = [LineString(geom.exterior.coords)]

        for ring in geom.interiors:
            lines.append(LineString(ring.coords))

        return lines

    if isinstance(geom, MultiPolygon):
        out = []

        for polygon in geom.geoms:
            out.extend(lines_of(polygon))

        return out

    if hasattr(geom, "geoms"):
        out = []

        for part in geom.geoms:
            out.extend(lines_of(part))

        return out

    return []


def encode(line, ox, oy):
    """
    Delta encoded integer run:

        [x0, y0, dx1, dy1, dx2, dy2, ...]

    Coordinates are relative to the city origin.
    """

    out = []
    px = None
    py = None

    for x, y in line.coords:

        ix = round((x - ox) / UNIT)
        iy = round((y - oy) / UNIT)

        if px is None:
            out.extend([ix, iy])

        else:
            dx = ix - px
            dy = iy - py

            if dx == 0 and dy == 0:
                continue

            out.extend([dx, dy])

        px = ix
        py = iy

    return out if len(out) >= 4 else None


def merged(gdf):
    """
    Join contiguous road edges.

    PBF readers usually return many small node-to-node road segments.
    Joining them reduces JSON size substantially.
    """

    lines = []

    for geom in gdf.geometry:
        lines.extend(lines_of(geom))

    if not lines:
        return []

    merged_geom = linemerge(unary_union(lines))

    return lines_of(merged_geom)


def layer(gdf, tol, ox, oy, merge=False):
    """
    Simplify and encode one GeoDataFrame as JSON runs.
    """

    runs = []
    points = 0

    geoms = merged(gdf) if merge else list(gdf.geometry)

    for geom in geoms:

        if geom is None or geom.is_empty:
            continue

        if tol:
            geom = geom.simplify(
                tol,
                preserve_topology=False,
            )

        for line in lines_of(geom):

            encoded = encode(line, ox, oy)

            if encoded:
                runs.append(encoded)
                points += len(encoded) // 2

    return runs, points


# ---------------------------------------------------------------------
# Main build
# ---------------------------------------------------------------------

def main():

    parser = argparse.ArgumentParser(
        description=(
            "Build compressed street-network and administrative-boundary "
            "data for one city."
        )
    )

    parser.add_argument(
        "--pbf",
        required=True,
        help="Path to the OSM .pbf containing the city's road network",
    )

    parser.add_argument(
        "--id",
        required=True,
        help="City ID, e.g. bengaluru, london, singapore",
    )

    parser.add_argument(
        "--bbox",
        required=True,
        help="minlon,minlat,maxlon,maxlat",
    )

    parser.add_argument(
        "--boundary",
        help="Path to administrative boundary shapefile or GeoJSON. "
             "When given, streets outside it are emitted as <cls>_out "
             "so the site can draw them faint.",
    )

    parser.add_argument(
        "--out-share",
        type=float,
        default=0.35,
        help="Fraction of the point budget spent on outside-boundary "
             "streets (0 to 1). Lower means more detail kept inside.",
    )

    parser.add_argument(
        "--local",
        action="store_true",
        help="Also include residential/local streets",
    )

    parser.add_argument(
        "--budget",
        type=int,
        default=DEFAULT_BUDGET,
        help="Maximum road-network point count",
    )

    parser.add_argument(
        "--out",
        help=(
            "Optional output path. Default: "
            "src/assets/data/city-<id>.json"
        ),
    )

    args = parser.parse_args()


    # -----------------------------------------------------------------
    # Parse bbox
    # -----------------------------------------------------------------

    try:
        minx, miny, maxx, maxy = [
            float(value)
            for value in args.bbox.split(",")
        ]

    except ValueError:
        sys.exit(
            "--bbox must be: minlon,minlat,maxlon,maxlat"
        )

    if minx >= maxx or miny >= maxy:
        sys.exit(
            "invalid bbox: expected minlon,minlat,maxlon,maxlat"
        )


    # City origin shared by ALL layers.
    ox = (minx + maxx) / 2
    oy = (miny + maxy) / 2

    clip = box(
        minx,
        miny,
        maxx,
        maxy,
    )

    output_path = args.out or os.path.join(
        "src",
        "assets",
        "data",
        f"city-{args.id}.json",
    )


    # -----------------------------------------------------------------
    # Validate inputs
    # -----------------------------------------------------------------

    if not os.path.exists(args.pbf):
        sys.exit(
            f"PBF not found: {args.pbf}"
        )

    if args.boundary and not os.path.exists(args.boundary):
        sys.exit(
            f"Boundary file not found: {args.boundary}"
        )


    # -----------------------------------------------------------------
    # Read road network
    # -----------------------------------------------------------------

    print()
    print(f"CITY       {args.id}")
    print(f"PBF        {args.pbf}")
    print(f"BOUNDARY   {args.boundary}")
    print(f"BBOX       {args.bbox}")
    print()

    print("Reading road network...")

    roads = gpd.read_file(
        args.pbf,
        layer="lines",
        bbox=(minx, miny, maxx, maxy),
        engine="pyogrio",
    )

    if roads is None or roads.empty:
        sys.exit(
            "No roads found in that box. "
            "Check bbox order: minlon,minlat,maxlon,maxlat"
        )

    if "highway" not in roads.columns:
        sys.exit(
            "The PBF line layer does not contain a 'highway' field."
        )


    # Ensure WGS84.
    if roads.crs is not None and roads.crs.to_epsg() != 4326:
        roads = roads.to_crs(4326)


    # -----------------------------------------------------------------
    # Filter road classes
    # -----------------------------------------------------------------

    highway = roads["highway"].astype(str)

    keep = MAJOR | MINOR

    if args.local:
        keep |= LOCAL

    roads = roads[
        highway.isin(keep)
    ].copy()

    if roads.empty:
        sys.exit(
            "Roads were found, but none matched the configured "
            "MAJOR/MINOR/LOCAL highway classes."
        )


    def road_class(value):
        value = str(value)

        if value in MAJOR:
            return "major"

        if value in MINOR:
            return "minor"

        return "local"


    roads["cls"] = roads["highway"].map(
        road_class
    )


    # Clip geometries precisely to requested bbox.
    roads = roads.set_geometry(
        roads.geometry.intersection(clip)
    )

    roads = roads[
        ~roads.geometry.is_empty
    ].copy()


    # Simplification tolerance scales with bbox size.
    span = max(
        maxx - minx,
        maxy - miny,
    )

    road_tol = span * 0.00012


    # -----------------------------------------------------------------
    # Read administrative boundary early, so roads can be split by it.
    # When no boundary is given, boundary_geom stays None and every
    # street is emitted at full strength.
    # -----------------------------------------------------------------

    boundary_geom = None

    if args.boundary:

        print()
        print("Reading administrative boundary...")

        boundary = gpd.read_file(args.boundary)

        if boundary is None or boundary.empty:
            sys.exit(f"No geometry found in boundary file: {args.boundary}")

        if boundary.crs is None:
            print("WARNING: boundary has no CRS metadata. Assuming EPSG:4326.")
            boundary = boundary.set_crs(4326, allow_override=True)
        elif boundary.crs.to_epsg() != 4326:
            print(f"  converting boundary CRS {boundary.crs} -> EPSG:4326")
            boundary = boundary.to_crs(4326)

        boundary = boundary[boundary.geometry.notna()].copy()
        boundary = boundary[~boundary.geometry.is_empty].copy()

        if boundary.empty:
            sys.exit("Boundary contains no usable geometry.")

        boundary_geom = unary_union(boundary.geometry).intersection(clip)

        if boundary_geom.is_empty:
            sys.exit(
                "Boundary does not intersect the requested bbox. "
                "Check that --bbox and --boundary refer to the same city."
            )


    # -----------------------------------------------------------------
    # Output document
    # -----------------------------------------------------------------

    doc = {
        "id": args.id,

        "origin": [
            ox,
            oy,
        ],

        "unit": UNIT,

        "bbox": [
            minx,
            miny,
            maxx,
            maxy,
        ],

        "source": (
            "OpenStreetMap contributors; "
            f"roads: {os.path.basename(args.pbf)}"
            + (f"; boundary: {os.path.basename(args.boundary)}"
               if args.boundary else "")
        ),

        "layers": {},
    }


    # -----------------------------------------------------------------
    # Encode roads
    # -----------------------------------------------------------------

    total_road_points = 0

    def emit(name, subset, cap):
        """Simplify, encode and budget-trim one subset, longest runs first."""
        nonlocal total_road_points

        if subset is None or subset.empty:
            return

        runs, points = layer(subset, road_tol, ox, oy, merge=True)

        if points > cap:
            runs.sort(key=len, reverse=True)
            kept, used = [], 0
            for run in runs:
                n = len(run) // 2
                if used + n > cap:
                    break
                kept.append(run)
                used += n
            print(f"  {name:10s} trimmed {points:,} -> {used:,} points")
            runs, points = kept, used

        doc["layers"][name] = runs
        total_road_points += points
        print(f"  {name:10s} {len(runs):6,d} lines {points:8,d} points")


    # Budget shares. With a boundary, most of the budget goes to the
    # inside network and the rest to faint context outside. Without one,
    # each class simply gets its full share.
    IN_SHARE  = {"major": 0.34, "minor": 0.30, "local": 0.22}
    OUT_SHARE = {"major": 0.16, "minor": 0.12, "local": 0.06}
    ALL_SHARE = {"major": 0.42, "minor": 0.34, "local": 0.24}

    for cls in ["major", "minor", "local"]:

        subset = roads[roads["cls"] == cls]

        if subset.empty:
            continue

        if boundary_geom is not None:

            inside = subset.set_geometry(
                subset.geometry.intersection(boundary_geom)
            )
            inside = inside[~inside.geometry.is_empty]

            outside = subset.set_geometry(
                subset.geometry.difference(boundary_geom)
            )
            outside = outside[~outside.geometry.is_empty]

            emit(cls, inside, int(args.budget * IN_SHARE[cls]))
            emit(cls + "_out", outside,
                 int(args.budget * OUT_SHARE[cls] * (args.out_share / 0.35)))

        else:
            emit(cls, subset, int(args.budget * ALL_SHARE[cls]))


    # -----------------------------------------------------------------
    # Encode the boundary ring (geometry already loaded above)
    # -----------------------------------------------------------------

    boundary_points = 0

    if boundary_geom is not None:

        boundary_gdf = gpd.GeoDataFrame(
            geometry=[boundary_geom],
            crs="EPSG:4326",
        )

        boundary_tol = road_tol * 0.35

        boundary_runs, boundary_points = layer(
            boundary_gdf,
            boundary_tol,
            ox,
            oy,
            merge=False,
        )

        if boundary_runs:
            doc["layers"]["boundary"] = boundary_runs
            print()
            print(
                f"  boundary "
                f"{len(boundary_runs):6,d} rings "
                f"{boundary_points:8,d} points"
            )
        else:
            print()
            print("  boundary produced no drawable lines; skipped")


    # -----------------------------------------------------------------
    # Write file
    # -----------------------------------------------------------------

    output_dir = os.path.dirname(
        output_path
    )

    if output_dir:
        os.makedirs(
            output_dir,
            exist_ok=True,
        )


    with open(
        output_path,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            doc,
            file,
            separators=(",", ":"),
        )


    size_kb = (
        os.path.getsize(output_path)
        / 1024
    )

    total_points = (
        total_road_points
        + boundary_points
    )


    print()
    print("DONE")
    print(f"  output:   {output_path}")
    print(f"  size:     {size_kb:,.0f} KB")
    print(f"  roads:    {total_road_points:,} points")
    print(f"  boundary: {boundary_points:,} points")
    print(f"  total:    {total_points:,} points")
    print()


if __name__ == "__main__":
    main()