import * as PIXI from "pixi.js";
import { Graphics } from "@pixi/react";
import { Polygon } from "../types";
import { useCallback } from "react";

interface PolygonWrapperProps {
  polygon: Polygon;
  updatePolygon?: (newPolygon: Polygon) => void;
}
function PolygonWrapper({ polygon }: PolygonWrapperProps) {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill("#ffffff");
      g.moveTo(polygon.points[0].x, polygon.points[1].y);
      for (const { x, y } of polygon.points) {
        g.lineTo(x, y);
      }
      g.lineTo(polygon.points[0].x, polygon.points[1].y);
    },
    [polygon],
  );
  return <Graphics draw={draw} />;
}

export default PolygonWrapper;
