import { useEffect, useMemo, useRef, useState } from "react";
import { extend, Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import { Model, aParams } from '../assets/Model'
import { randFloat, randInt } from "three/src/math/MathUtils.js";
import { Polygon, TEST_BUILDING } from "../types";
import { CHUNG } from "../data";
import { Text } from "@react-three/drei";
import { POI, FloorPlan } from "../floorPlan";

const temp = new THREE.Object3D();
const material = new THREE.MeshPhongMaterial({ color: "red" });
material.side = THREE.DoubleSide;
const geometry = new THREE.SphereGeometry(1.0);
const polygonMesh = (polygon: Polygon, name: string, height: number, color: string) => {
  var shape = new THREE.Shape(polygon.points.map((point) => new THREE.Vector2(point.x, point.y)));
  var center = shape.getPoints().reduce((acc, point) => acc.add(point), new THREE.Vector2(0, 0)).divideScalar(shape.getPoints().length);
  var geometry = new THREE.ShapeGeometry(shape);
  var material = new THREE.MeshBasicMaterial({ color: color });
  material.side = THREE.DoubleSide;
  geometry.rotateX(Math.PI / 2);

  return (
    <>
      <mesh geometry={geometry} position={[0, height, 0]} material={material} />
      <Text position={[center.x, height + 2, center.y]} fontSize={5} color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </>
  );
}
const Balls = ({ locations }: { locations: [number, number][] }) => {
  const ref = useRef<THREE.InstancedMesh>(null);

  useFrame(() => {
    if (!ref || !ref.current) return;
    let counter = 0;
    for (const [x, y] of locations) {
      const id = counter++;
      temp.position.set(x, y, 0);
      temp.rotation.set(0, 0, 0);
      temp.updateMatrix();
      ref.current.setMatrixAt(id, temp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, material, locations.length]} />
  );
};

function createAParams() {
  return new aParams();
}

var floorPlan = new FloorPlan("WCH", []);
var prevPOI: POI | null = null;
var nextPOI: POI | null = null;

for (var layer of CHUNG.layers) {
  for (var room of layer.rooms) {
    nextPOI = new POI(room.name, [room.polygon.points[0].x, (parseInt(layer.name.slice(0, -1)) - 1) * 50 + 1, room.polygon.points[0].y]);
    console.log(room.polygon.points[0].y);
    floorPlan.addPOI(nextPOI);
    if (prevPOI !== null) {
      floorPlan.addEdge(prevPOI, nextPOI);
      floorPlan.addEdge(nextPOI, prevPOI);
    }
    prevPOI = nextPOI;
  }
}

console.log(floorPlan.startPOI());

function MainPage() {
  var tests = [...new Array(100)].map((_) => {
    return useRef<aParams>(createAParams());
  });
  // for (var i = 0; i < tests.length; i++) {
  //   tests[i].current.rotationForce = [randFloat(-0.1, 0.1), randFloat(-0.1, 0.1), randFloat(-0.1, 0.1)];
  // }
  setInterval(() => {
    for (var i = 0; i < tests.length; i++) {
      // tests[i].current.rotationForce = [randFloat(-0.1, 0.1), randFloat(-0.1, 0.1), randFloat(-0.1, 0.1)];
      if (tests[i].current.status === "idle") {
        tests[i].current.status = "moveTo";
        var currPOI = tests[i].current.currPOI;
        var targetPOI = tests[i].current.targetPOI;
        if (currPOI === null) {
          currPOI = floorPlan.startPOI();
          targetPOI = floorPlan.startPOI();
          tests[i].current.currPOI = currPOI;
          tests[i].current.targetPOI = targetPOI;
          tests[i].current.destination = currPOI.location;
          tests[i].current.trueDestination = targetPOI.location;
        }
        else if (currPOI === targetPOI) {
          targetPOI = floorPlan.randPOI();
          tests[i].current.targetPOI = targetPOI;
          currPOI = floorPlan.nextInPath(currPOI, targetPOI);
          tests[i].current.currPOI = currPOI;
          tests[i].current.destination = currPOI.location;
          tests[i].current.trueDestination = targetPOI.location;
        } else {
          currPOI = floorPlan.nextInPath(currPOI, targetPOI);
          tests[i].current.currPOI = currPOI;
          tests[i].current.destination = currPOI.location;
          tests[i].current.trueDestination = targetPOI.location;
        }
      }
    }
  }, 100);

  return (
    <div className="w-full h-screen">
      <Canvas className="bg-black h-full">
        {
          CHUNG.layers.map((layer, i) => {
            return (
              <group key={i}>
                {polygonMesh(layer.floor, layer.name, i * 50, "darkred")}
                <group>
                  {
                    layer.rooms.map((room, j) => {
                      return (
                        <group key={j}>
                          {polygonMesh(room.polygon, room.name, i * 50 + 5, "green")}
                        </group>
                      );
                    })
                  }
                </group>
              </group>
            );
          })
        }
        {
          [...new Array(100)].map((_, i) => <Model position={[(i % 5) * 5, 1, Math.floor(i / 25) * 5]} animationParams={tests[i]} key={i} scale={10} />)
        }
        <Perf />
        {/* <PerspectiveCamera makeDefault /> */}
        {/* <PresentationControls> */}
        <MapControls screenSpacePanning />

        <ambientLight intensity={0.5} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <directionalLight color="red" position={[0, 5, 5]} />

        {/* </PresentationControls> */}
      </Canvas>
    </div>
  );
}

export default MainPage;

// ////
// /**
//  * Point container
//  */
// export interface Point {
//   x: number;
//   y: number;
// }

// /**
//  * Polygon container, consists of points
//  */
// export interface Polygon {
//   /**
//    * Polygon shape specified by points in counter clockwise order.
//    */
//   points: Point[];
// }

// /**
//  * Container that consists boundary polygon and a name.
//  */
// export interface Room {
//   name: string;
//   polygon: Polygon;
// }

// /**
//  * Container that consists of a floor boundary and many rooms.
//  */
// export interface Layer {
//   name: string;
//   rooms: Room[];
//   floor: Polygon;
// }

// /**
//  * Container that consists of multiple building layers.
//  */
// export interface Building {
//   name: string;
//   layers: Layer[];
// }

// /**
//  * Utility function that generates a rectangular Polygon
//  */
// function rect(x: number, y: number, w: number, h: number) {
//   return {
//     points: [
//       [0, 0],
//       [1, 0],
//       [1, 1],
//       [0, 1],
//     ].map(([kx, ky]) => ({
//       x: x + kx * w,
//       y: y + ky * h,
//     })),
//   } as Polygon;
// }

// /**
//  * Simple building stub
//  */
// export const TEST_BUILDING: Building = {
//   name: "test",
//   layers: [
//     {
//       name: "1F",
//       rooms: [
//         {
//           name: "kitchen",
//           polygon: rect(10, 10, 40, 40),
//         },
//         {
//           name: "room",
//           polygon: rect(50, 50, 40, 40),
//         },
//       ],
//       floor: rect(0, 0, 100, 100),
//     },
//     {
//       name: "2F",
//       rooms: [
//         {
//           name: "room2",
//           polygon: rect(50, 50, 40, 40),
//         },
//       ],
//       floor: rect(0, 0, 100, 100),
//     },
//   ],
// };
