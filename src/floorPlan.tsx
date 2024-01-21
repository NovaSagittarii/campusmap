

export class POI {
  name: string;
  location: [number, number, number];
  constructor(name: string, location: [number, number, number]) {
    this.name = name;
    this.location = location;
  }
}

// a graph of connected xyz points
export class FloorPlan {
  name: string;
  pois: POI[];
  constructor(name: string, pois: POI[]) {
    this.name = name;
    this.pois = pois;
  }

  adjPOIs: Map<POI, POI[]> = new Map();
  addPOI(poi: POI) {
    this.pois.push(poi);
  }

  addEdge(poi1: POI, poi2: POI) {
    if (!this.adjPOIs.has(poi1)) {
      this.adjPOIs.set(poi1, []);
    }
    if (!this.adjPOIs.has(poi2)) {
      this.adjPOIs.set(poi2, []);
    }
    this.adjPOIs.get(poi1)?.push(poi2);
    this.adjPOIs.get(poi2)?.push(poi1);
    console.log(this.adjPOIs);
  }

  shortestPath(poi1: POI, poi2: POI) {
    var visited = new Set<POI>();
    var queue: [POI, POI[]][] = [[poi1, []]];
    while (queue.length > 0) {
      var [curr, path] = queue.shift()!;
      if (curr === poi2) {
        return path;
      }
      if (visited.has(curr)) {
        continue;
      }
      visited.add(curr);
      for (var poi of this.adjPOIs.get(curr)!) {
        if (!visited.has(poi)) {
          queue.push([poi, [...path, poi]]);
        }
      }
    }
    return [];
  }

  nextInPath(poi1: POI, poi2: POI) {
    var path = this.shortestPath(poi1, poi2);
    if (path.length > 0) {
      return path[0];
    }
    return null;
  }

  randPOI() {
    return this.pois[Math.floor(Math.random() * this.pois.length)];
  }

  startPOI() {
    return this.pois[0];
  }

  getPOI(name: string) {
    for (var poi of this.pois) {
      if (poi.name === name) {
        return poi;
      }
    }
    return null;
  }
}