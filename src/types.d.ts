/**
 * Point container
 */
export interface Point {
  x: number;
  y: number;
}
export function createPoint(x: number, y: number) {
  return { x, y } as Point;
}

/**
 * Polygon container, consists of points
 */
export interface Polygon {
  /**
   * Polygon shape specified by points in counter clockwise order.
   */
  points: Point[];
}

/**
 * Container that consists boundary polygon and a name.
 */
export interface Room {
  name: string;
  polygon: Polygon;
}
export function createRoom(name: string, x: number, y: number) {
  return {
    name: name,
    polygon: rect(x, y, 10, 10),
  } as Room;
}

/**
 * Container that consists of a floor boundary and many rooms.
 */
export interface Layer {
  name: string;
  rooms: Room[];
  floor: Polygon;
}
export function createLayer(name: string) {
  return {
    name: name,
    rooms: [],
    floor: rect(0, 0, 100, 100),
  } as Layer;
}

/**
 * Container that consists of multiple building layers.
 */
export interface Building {
  name: string;

  /**
   * positional offset relative to other buildings
   */
  offset: Point;
  layers: Layer[];
}
// export function createBuilding() {}

/**
 * Utility function that generates a rectangular Polygon
 */
export function rect(x: number, y: number, w: number, h: number) {
  return {
    points: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ].map(([kx, ky]) => ({
      x: x + kx * w,
      y: y + ky * h,
    })),
  } as Polygon;
}

/**
 * Simple building stub
 */
export const TEST_BUILDING: Building = {
  name: "test",
  offset: { x: 0, y: 0 },
  layers: [
    {
      name: "1F",
      rooms: [
        {
          name: "kitchen",
          polygon: rect(10, 10, 40, 40),
        },
        {
          name: "room",
          polygon: rect(50, 50, 40, 40),
        },
      ],
      floor: rect(0, 0, 100, 100),
    },
    {
      name: "2F",
      rooms: [
        {
          name: "room2",
          polygon: rect(50, 50, 40, 40),
        },
      ],
      floor: rect(0, 0, 100, 100),
    },
  ],
};
