import * as React from "react";
import { ReactP5Wrapper, P5CanvasInstance } from "@p5-wrapper/react";
import map1 from "/map1.png";
import P5 from "p5";
import { Layer, Point, Polygon } from "../types";

function sketch(p5: P5CanvasInstance) {
  let MAP: P5.Image;
  p5.preload = () => {
    MAP = p5.loadImage(map1);
  };
  p5.setup = () => {
    p5.createCanvas(800, 800, p5.P2D);
  };

  let polygons: [number, number][][] = [[]];
  let names: string[] = [];
  polygons = [[[171,539],[434,531],[432,485],[448,481],[448,489],[485,492],[527,484],[530,460],[568,457],[615,427],[637,377],[635,299],[593,303],[596,285],[545,286],[545,147],[580,145],[580,126],[531,125],[531,84],[492,81],[490,62],[428,61],[428,40],[323,46],[320,21],[155,23],[152,13],[70,12],[71,17],[16,18],[17,37],[71,38],[80,42],[90,157],[126,158],[136,297],[89,295],[90,320],[141,317],[149,443],[149,443],[105,444],[107,465],[162,465]],[[172,481],[252,481],[257,525],[235,525],[237,533],[173,536]],[[256,460.0399932861328],[259,523.0399932861328],[309,521.0399932861328],[307,456.0399932861328]],[[309,458.0399932861328],[313,521.0399932861328],[352,519.0399932861328],[352,457.0399932861328]],[[356,457.0399932861328],[359,517.0399932861328],[398,514.0399932861328],[397,457.0399932861328]],[[322,312.95999908447266],[322,370.95999908447266],[395,367.95999908447266],[394,312.95999908447266]],[[245,315.95999908447266],[246,374.95999908447266],[320,371.95999908447266],[318,313.95999908447266]],[[275,228.95999908447266],[277,292.95999908447266],[335,291.95999908447266],[334,286.95999908447266],[354,287.95999908447266],[352,224.95999908447266]],[[354,224.95999908447266],[356,287.95999908447266],[368,285.95999908447266],[368,289.95999908447266],[406,289.95999908447266],[406,284.95999908447266],[430,284.95999908447266],[428,227.95999908447266]],[[447,305.8800001144409],[528,305.8800001144409],[526,372.8800001144409],[449,371.8800001144409]],[[398,368.8800001144409],[398,368.8800001144409],[399,390.8800001144409],[428,390.8800001144409],[428,366.8800001144409]],[[431,402.8800001144409],[413,401.8800001144409],[413,394.8800001144409],[428,392.8800001144409]],[[413,417.8800001144409],[414,404.8800001144409],[427,404.8800001144409],[430,414.8800001144409]],[[400,421.8800001144409],[432,420.8800001144409],[432,431.8800001144409],[399,438.8800001144409]],[[450,375.8800001144409],[524,373.8800001144409],[524,432.8800001144409],[448,431.8800001144409]],[[325,378.8800001144409],[326,436.8800001144409],[396,433.8800001144409],[394,380.8800001144409]],[[248,380.8800001144409],[322,380.8800001144409],[323,437.8800001144409],[254,439.8800001144409]],[[233,454.8800001144409],[166,459.8800001144409],[169,473.8800001144409],[227,472.8800001144409]],[[230,438.8800001144409],[225,380.8800001144409],[151,379.8800001144409],[154,439.8800001144409]],[[146,316.8800001144409],[221,313.8800001144409],[226,374.8800001144409],[152,376.8800001144409]],[[240,295.8800001144409],[197,156.88000011444092],[138,156.88000011444092],[149,267.8800001144409],[215,271.8800001144409],[217,294.8800001144409]],[[218,227.88000011444092],[213,184.88000011444092],[225,158.88000011444092],[280,154.88000011444092],[282,223.88000011444092]],[[284,152.88000011444092],[352,154.88000011444092],[353,195.88000011444092],[284,197.88000011444092]],[[304,94.88000011444092],[303,70.88000011444092],[226,72.88000011444092],[224,25.880000114440918],[319,26.880000114440918],[323,80.88000011444092],[314,85.88000011444092],[317,94.88000011444092]],[[304,131.88000011444092],[297,73.88000011444092],[229,78.88000011444092],[229,134.88000011444092]],[[317,131.88000011444092],[318,115.88000011444092],[340,111.88000011444092],[341,131.88000011444092]],[[320,88.88000011444092],[320,107.88000011444092],[344,107.88000011444092],[339,90.88000011444092]],[[353,155.88000011444092],[358,218.88000011444092],[428,216.88000011444092],[429,152.88000011444092]],[[409,95.88000011444092],[407,83.88000011444092],[327,82.88000011444092],[323,53.88000011444092],[334,53.88000011444092],[333,49.88000011444092],[423,46.88000011444092],[426,65.88000011444092],[417,65.88000011444092],[419,89.88000011444092]],[[421,102.88000011444092],[419,70.88000011444092],[440,65.88000011444092],[480,62.88000011444092],[483,101.88000011444092],[467,101.88000011444092],[465,108.88000011444092],[446,110.88000011444092],[445,104.88000011444092]],[[487,86.88000011444092],[487,125.88000011444092],[523,124.88000011444092],[527,86.88000011444092]],[[442,108.88000011444092],[423,110.88000011444092],[423,123.88000011444092],[425,129.88000011444092],[444,129.88000011444092]],[[405,113.88000011444092],[405,87.88000011444092],[389,86.88000011444092],[390,108.88000011444092]],[[384,118.88000011444092],[384,87.88000011444092],[368,88.88000011444092],[369,118.88000011444092]],[[367,118.88000011444092],[366,86.88000011444092],[346,88.88000011444092],[346,117.88000011444092]],[[452,153.88000011444092],[448,286.8800001144409],[515,288.8800001144409],[516,194.88000011444092],[537,200.88000011444092],[539,146.88000011444092]],[[758,344]]];
  names = polygons.map(() => "?");
  let curr = 0;
  p5.keyPressed = () => {
    switch (p5.keyCode) {
      case 220: // \ -- new polygon
        const res = prompt("name? (\\)");
        names[polygons.length - 1] = res || `#${names.length}`;
        polygons.push([]);
        break;
      case 46: // del -- pop polygon
        if (polygons.length > 1) {
          polygons.pop();
        }
        break;
      case 74: // j -- prev
        curr = (curr - 1 + names.length) % names.length;
        break;
      case 75: // k -- next
        curr = (curr + 1 + names.length) % names.length;
        break;
      case 84: // t -- set text
        const namecurr = prompt("name? (T)");
        names[curr] = namecurr || `#${names.length}`;
        break;
      case 85: // u -- pop point
        if (polygons[polygons.length - 1].length) {
          polygons[polygons.length - 1].pop();
        }
        break;
      case 32: // space -- export
        console.log(JSON.stringify(polygons));
        console.log(JSON.stringify(names));
        function toPolygon(pts: [number, number][]) {
          return {
            points: pts.map(([x, y]) => ({ x, y }) as Point),
          } as Polygon;
        }
        const layer: Layer = {
          name: names[0],
          floor: toPolygon(polygons[0]),
          rooms: [...new Array(names.length - 1)]
            .map((_, i) => i + 1)
            .map((i) => ({
              name: names[i],
              polygon: toPolygon(polygons[i]),
            })),
        };
        console.log(JSON.stringify(layer));
        break;
    }
  };
  p5.mousePressed = () => {
    const { mouseX, mouseY } = p5;
    polygons[polygons.length - 1].push([mouseX, mouseY]);
  };

  p5.draw = () => {
    p5.background(250);
    p5.image(MAP, 0, 0);

    for (let i = 0; i < polygons.length; ++i) {
      const polygon = polygons[i];
      p5.stroke(255);
      p5.fill(255, 255, 255, 30);
      const selected = polygon === polygons[curr];
      if (selected) {
        p5.fill(255, 0, 0, 30);
      }
      p5.beginShape();
      for (const [x, y] of polygon) {
        p5.vertex(x, y);
      }
      p5.endShape(polygon === polygons[polygons.length-1] ? undefined : p5.CLOSE); // prettier-ignore
      p5.fill(0);
      if (polygon.length) {
        if (selected) p5.fill(100, 0, 0);
        else p5.noStroke();
        p5.text(names[i], polygon[0][0], polygon[0][1]);
      }
    }
  };
}

export function P5Editor() {
  return <ReactP5Wrapper sketch={sketch} />;
}
