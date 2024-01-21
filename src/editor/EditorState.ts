import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Building, createLayer, createPoint, createRoom, rect } from "../types";

// i don't think this is right...

export const useEditorState = create(
  combine(
    {
      buildings: [
        {
          name: "Hi",
          offset: createPoint(0, 0),
          layers: [
            {
              name: "1F",
              rooms: [],
              floor: rect(0, 0, 100, 100),
            },
          ],
        },
      ] as Building[],
    },
    (set) => ({
      // addBuilding: (buildingName: string) => set((state) => ({
      //   ...state,
      //   buildings: [...buildings, ]
      // })),
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
    }),
  ),
);
