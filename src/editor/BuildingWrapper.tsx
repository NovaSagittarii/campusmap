import * as PIXI from "pixi.js";
import { Container, Text } from "@pixi/react";
import { Building } from "../types";
import PolygonWrapper from "./PolygonWrapper";

interface BuildingWrapperProps {
  building: Building;
}
function BuildingWrapper({ building }: BuildingWrapperProps) {
  return (
    <Container {...building.offset}>
      {building.layers.map((layer, index) => (
        <Container key={index}>
          <PolygonWrapper polygon={layer.floor} />
          {layer.rooms.map((room, index) => (
            <Container key={index}>
              <PolygonWrapper polygon={room.polygon} />
            </Container>
          ))}
        </Container>
      ))}
      <Text
        text={building.name}
        style={
          {
            fill: "red",
          } as PIXI.TextStyle
        }
      />
    </Container>
  );
}

export default BuildingWrapper;
