import { create } from "zustand";
import { combine } from "zustand/middleware";
import {
  Building,
  Polygon,
  TEST_BUILDING,
  createBuilding,
  createLayer,
  createPoint,
  createRoom,
  rect,
} from "../types";

// i don't think this is right...

export const useEditorState = create(
  combine(
    {
      buildings: [TEST_BUILDING],
    },
    (set) => ({
      addBuilding: (buildingName: string, x: number, y: number) =>
        set((state) => ({
          ...state,
          buildings: [...state.buildings, createBuilding(buildingName, x, y)],
        })),
      addLayer: (buildingName: string) =>
        set((state) => ({
          ...state,
          buildings: state.buildings.map((building) =>
            building.name === buildingName
              ? {
                  ...building,
                  layers: [
                    ...building.layers,
                    createLayer(building.layers.length + "F"),
                  ],
                }
              : building,
          ),
        })),
      setLayerPolygon: (
        buildingName: string,
        layerName: string,
        floor: Polygon,
      ) =>
        set((state) => ({
          ...state,
          buildings: state.buildings.map((building) =>
            building.name !== buildingName
              ? building
              : {
                  ...building,
                  layers: building.layers.map((layer) =>
                    layer.name !== layerName
                      ? layer
                      : {
                          ...layer,
                          floor,
                        },
                  ),
                },
          ),
        })),
      addRoom: (
        buildingName: string,
        layerName: string,
        x: number,
        y: number,
      ) =>
        set((state) => ({
          ...state,
          buildings: state.buildings.map((building) =>
            building.name === buildingName
              ? {
                  ...building,
                  layers: building.layers.map((layer) =>
                    layer.name === layerName
                      ? {
                          ...layer,
                          rooms: [
                            ...layer.rooms,
                            createRoom("Room" + layer.rooms.length, x, y),
                          ],
                        }
                      : layer,
                  ),
                }
              : building,
          ),
        })),
      setRoomPolygon: (
        buildingName: string,
        layerName: string,
        roomName: string,
        polygon: Polygon,
      ) =>
        set((state) => ({
          ...state,
          buildings: state.buildings.map((building) =>
            building.name !== buildingName
              ? building
              : {
                  ...building,
                  layers: building.layers.map((layer) =>
                    layer.name !== layerName
                      ? layer
                      : {
                          ...layer,
                          rooms: layer.rooms.map((room) =>
                            room.name !== roomName
                              ? room
                              : {
                                  ...room,
                                  polygon,
                                },
                          ),
                        },
                  ),
                },
          ),
        })),
    }),
  ),
);
