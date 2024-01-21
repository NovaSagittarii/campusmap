import * as React from "react";
import { ReactP5Wrapper, P5CanvasInstance } from "@p5-wrapper/react";
import map1 from "/map2.jpg";
import P5 from "p5";
import { Graph, Layer, Point, Polygon } from "../types";

function sketch(p5: P5CanvasInstance) {
  let MAP: P5.Image;
  p5.preload = () => {
    MAP = p5.loadImage(map1);
  };
  p5.setup = () => {
    p5.createCanvas(800, 800, p5.P2D);
  };

  /** the ith node is located at coords[i] */
  let coords: [number, number][] = [];
  /** EDGE LIST */
  let edges: [number, number][] = [];
  /** Action history, 1 ~ coord, 2 ~ edge */
  let action: (1|2)[] = [];
  p5.keyPressed = () => {
    switch (p5.keyCode) {
      case 65: // A -- add from current to another
        const U = parseInt(prompt(`Add undirected edge from ${coords.length-1} to ??`) || "");
        if (isNaN(U)) break;
        if (U < 0 || U >= coords.length) break;
        edges.push([U, coords.length-1]);
        action.push(2);
        break;
      case 68: // D -- add from two
        const u = parseInt(prompt(`Add undirected edge from <??> to ..`) || "");
        if (isNaN(u)) break;
        if (u < 0 || u >= coords.length) break;
        const v = parseInt(prompt(`Add undirected edge from ${u} to <??>`) || "");
        if (isNaN(v)) break;
        if (v < 0 || v >= coords.length) break;
        edges.push([u, v]);
        action.push(2);
        break;
      case 85: { // U -- undo coord
        const last = action.pop();
        if (last === 1) coords.pop();
        else if (last === 2) edges.pop();
        break;
      }
      case 32: // space -- export
        console.log(JSON.stringify(coords));
        console.log(JSON.stringify(edges));
        console.log(JSON.stringify({
          positions: coords.map(([x, y]) => ({x, y})),
          edges: edges,
        } as Graph));
        break;
    }
  };
  p5.mousePressed = () => {
    const { mouseX, mouseY } = p5;
    coords.push([mouseX, mouseY]);
    action.push(1);
  };

  p5.draw = () => {
    p5.background(250);
    p5.image(MAP, 0, 0);

    p5.stroke(255);
    for (const [u, v] of edges) {
      p5.line(coords[u][0], coords[u][1], coords[v][0], coords[v][1]);
    }

    for (let i = 0; i < coords.length; ++i) {
      const [x, y] = coords[i];
      if (i == coords.length-1) {
        p5.fill(255,0,0);
      } else p5.fill(255);
      p5.ellipse(x, y, 10, 10);
      p5.fill(0);
      p5.text(i, x, y);
    }
  };
}

export function P5EditorGraph() {
  return <ReactP5Wrapper sketch={sketch} />;
}
