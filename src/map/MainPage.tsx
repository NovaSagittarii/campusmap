import { useEffect, useMemo, useRef, useState } from "react";
import { extend, Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import { Model, aParams } from '../assets/Model'
import { randFloat, randInt } from "three/src/math/MathUtils.js";
import { Polygon, TEST_BUILDING } from "../types";
import { CHUNG, L1G, L2G, L12GS } from "../data";
import { Text } from "@react-three/drei";
import { POI, FloorPlan } from "../floorPlan";
import { UnrealBloomPass } from 'three-stdlib'
import { Effects } from "@react-three/drei";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import Dome from "./Dome";
import Floor from "./Floor";

extend({ UnrealBloomPass, OutputPass });


const temp = new THREE.Object3D();
const material = new THREE.MeshPhongMaterial({ color: "red" });
material.side = THREE.DoubleSide;
const geometry = new THREE.SphereGeometry(1.0);
const polygonMesh = (polygon: Polygon, name: string, height: number, color: string) => {
  var shape = new THREE.Shape(polygon.points.map((point) => new THREE.Vector2(point.x, point.y)));
  var center = shape.getPoints().reduce((acc, point) => acc.add(point), new THREE.Vector2(0, 0)).divideScalar(shape.getPoints().length);
  var geometry = new THREE.ShapeGeometry(shape);
  var material = new THREE.MeshPhongMaterial({ color: color });
  material.side = THREE.DoubleSide;
  material.toneMapped = false;
  material.emissive = new THREE.Color(color);
  material.emissiveIntensity = 10;
  if (color == "green") {
    material.wireframe = true;
  }
  geometry.rotateX(Math.PI / 2);

  return (
    <>
      <mesh geometry={geometry} position={[0, height - 100, 0]} material={material} />
      <Text position={[center.x, height - 105, center.y]} fontSize={20} color="white" anchorX="center" anchorY="bottom" maxWidth={100} lineHeight={1} >
        {name}
      </Text >
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

var POI1F: POI[] = [];
var POI2F: POI[] = [];
for (let room of L1G.positions) {
  var nextPOI = new POI("?", [room.x - 300, -90, room.y - 400]);
  floorPlan.addPOI(nextPOI);
  POI1F.push(nextPOI);
}
for (let room of L2G.positions) {
  var nextPOI = new POI("?", [room.x - 300, -40, room.y - 400]);
  floorPlan.addPOI(nextPOI);
  POI2F.push(nextPOI);
}
for (let path of L1G.edges) {
  floorPlan.addEdge(POI1F[path[0]], POI1F[path[1]]);
  floorPlan.addEdge(POI1F[path[1]], POI1F[path[0]]);
}
for (let path of L2G.edges) {
  floorPlan.addEdge(POI2F[path[0]], POI2F[path[1]]);
  floorPlan.addEdge(POI2F[path[1]], POI2F[path[0]]);
}
for (let path of L12GS) {
  floorPlan.addEdge(POI1F[path[0]], POI2F[path[1]]);
  floorPlan.addEdge(POI2F[path[1]], POI1F[path[0]]);
}

for (var layer of CHUNG.layers) {
  for (var point of layer.floor.points) {
    point.x -= 300;
    point.y -= 400;
  }
  for (var room of layer.rooms) {
    for (var point of room.polygon.points) {
      point.x -= 300;
      point.y -= 400;
      // find nearest POI
      var minDist = Infinity;
      var minPOI = null;
      for (var poi of floorPlan.pois) {
        var dist = Math.sqrt((poi.location[0] - point.x) ** 2 + (poi.location[2] - point.y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          minPOI = poi;
        }
      }
      poi!.name = room.name;
    }
  }
}

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
        <Effects disableGamma>
          <unrealBloomPass threshold={1} strength={0.3} radius={0.5} />
          <outputPass args={[THREE.ACESFilmicToneMapping]} />
        </Effects>
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
        <directionalLight color="white" position={[0, 0, 5]} />
        <directionalLight color="white" position={[0, 5, 5]} />
        <Dome />
        <group position={[0, -105, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <Floor />
        </group>

        {/* </PresentationControls> */}
      </Canvas>
    </div>
  );
}

export default MainPage;