import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
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
import Dome from "./Dome";
import Floor from "./Floor";

extend({ UnrealBloomPass });


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
      <Text position={[center.x, height - 105, center.y]} fontSize={20} color="black" anchorX="center" anchorY="bottom" maxWidth={100} lineHeight={1} >
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
    }
    var minDist = Infinity;
    var minPOI = null;
    var averageX = room.polygon.points.reduce((acc, point) => acc + point.x, 0) / room.polygon.points.length;
    var averageY = room.polygon.points.reduce((acc, point) => acc + point.y, 0) / room.polygon.points.length;
    for (var poi of floorPlan.pois) {
      if (layer === CHUNG.layers[0] && poi.location[1] > -70) continue;
      if (layer === CHUNG.layers[1] && poi.location[1] < -70) continue;
      var dist = Math.sqrt((poi.location[0] - averageX) ** 2 + (poi.location[2] - averageY) ** 2);
      if (dist < minDist) {
        minDist = dist;
        minPOI = poi;
      }
    }
    if (minPOI) {
      floorPlan.setPOIName(minPOI, room.name);
    }
    console.log(floorPlan.getPOI(room.name));
  }
}

var playerModels: JSX.Element[] = [];
var modelParams: MutableRefObject<aParams>[] = [];
var specialModels: JSX.Element[] = [];
var specialParams: MutableRefObject<aParams>[] = [];

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    var start = prompt("Starting Location");
    var end = prompt("Ending Location");
    var startPOI = floorPlan.pois.find((poi) => poi.name === start);
    var endPOI = floorPlan.pois.find((poi) => poi.name === end);
    if (startPOI && endPOI) {
      console.log(floorPlan.shortestPath(startPOI, endPOI));
      for (var model of modelParams) {
        model.current.status = "hidden";
        model.current.currPOI = null;
        model.current.targetPOI = null;
      }
      modelParams[0].current.currPOI = startPOI;
      modelParams[0].current.targetPOI = endPOI;
      modelParams[0].current.destination = startPOI.location;
      modelParams[0].current.trueDestination = endPOI.location;
      modelParams[0].current.status = "moveTo";
    }
  }
  if (e.key === "g") {
    getLocation();
  }
});

function MainPage() {

  const [visibility, setVisibility] = useState<boolean[]>([true, true]);
  modelParams = [...new Array(100)].map((_) => {
    return useRef<aParams>(createAParams());
  });
  playerModels = [...new Array(100)].map((_, i) => <Model position={[(i % 5) * 5, 1, Math.floor(i / 25) * 5]} animationParams={modelParams[i]} key={i} scale={10} />)
  specialParams = [...new Array(1)].map((_) => {
    return useRef<aParams>(createAParams());
  });
  specialModels = [...new Array(1)].map((_, i) => <Model position={[0, 0, 0]} animationParams={specialParams[i]} key={i + 200} scale={10} />)

  // MAPPING
  // 150 90 = 33.975078895556415, -117.32588988719304
  // -150 -310 = 33.97567973828617, -117.32640214835949

  //33.9751827 -117.3258789
  //33.9755312 -117.3262617



  // Calculated 0 0 = 33.9753793169212925, 117.32600514595549125

  var touchDevice = ('ontouchstart' in document.documentElement);

  if (touchDevice) {
    for (var i = 0; i < modelParams.length; i++) {
      modelParams[i].current.status = "hidden";
    }
  }

  function getPos(x: number, y: number) {
    return [(x - 33.975078895556415) * 300 / (33.975078895556415 - 33.97567973828617) + 150, (y + 117.32588988719304) * -400 / (117.32588988719304 - 117.32640214835949) + 90];
  }

  // for (var i = 0; i < tests.length; i++) {
  //   tests[i].current.rotationForce = [randFloat(-0.1, 0.1), randFloat(-0.1, 0.1), randFloat(-0.1, 0.1)];
  // }
  setInterval(() => {
    for (var i = 0; i < modelParams.length; i++) {
      // tests[i].current.rotationForce = [randFloat(-0.1, 0.1), randFloat(-0.1, 0.1), randFloat(-0.1, 0.1)];
      if (modelParams[i].current.status === "idle") {
        modelParams[i].current.status = "moveTo";
        var currPOI = modelParams[i].current.currPOI;
        var targetPOI = modelParams[i].current.targetPOI;
        if (currPOI === null) {
          currPOI = floorPlan.startPOI();
          targetPOI = floorPlan.startPOI();
          modelParams[i].current.currPOI = currPOI;
          modelParams[i].current.targetPOI = targetPOI;
          modelParams[i].current.destination = currPOI.location;
          modelParams[i].current.trueDestination = targetPOI.location;
        }
        else if (currPOI === targetPOI) {
          if (i === 0 && modelParams[1].current.status === "hidden") {
            modelParams[i].current.status = "stop";
            break;
          }
          targetPOI = floorPlan.randPOI();
          modelParams[i].current.targetPOI = targetPOI;
          currPOI = floorPlan.nextInPath(currPOI, targetPOI);
          modelParams[i].current.currPOI = currPOI;
          modelParams[i].current.destination = currPOI.location;
          modelParams[i].current.trueDestination = targetPOI.location;
        } else {
          currPOI = floorPlan.nextInPath(currPOI, targetPOI);
          modelParams[i].current.currPOI = currPOI;
          modelParams[i].current.destination = currPOI.location;
          modelParams[i].current.trueDestination = targetPOI.location;
        }
      }
    }
  }, 100);

  navigator.geolocation.watchPosition(showPosition, (err) => console.log(err), { enableHighAccuracy: true, maximumAge: 0, timeout: Infinity });
  function showPosition(position: GeolocationPosition) {
    var x = getPos(position.coords.latitude, position.coords.longitude)[0];
    var y = getPos(position.coords.latitude, position.coords.longitude)[1];
    console.log(position.coords.latitude, position.coords.longitude);
    console.log(x, y);
    specialParams[0].current.status = "moveTo";
    specialParams[0].current.destination = [x, -90, y];
  }
  return (
    <div className="w-full h-screen">
      <Canvas className="bg-black h-full">
        <Effects disableGamma>
          <unrealBloomPass threshold={1} strength={0.3} radius={0.5} />
        </Effects>
        {
          CHUNG.layers.map((layer, i) => {
            return (
              <group key={i} visible={visibility[i]} onPointerDown={() => setVisibility((prev) => prev.map((_, j) => j === i ? false : prev[j]))} onPointerUp={() => setVisibility((prev) => prev.map((_, j) => j === i ? true : prev[j]))}>
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
          playerModels
        }
        {
          specialModels
        }
        <Perf />
        {/* <PerspectiveCamera makeDefault /> */}
        {/* <PresentationControls> */}
        <MapControls screenSpacePanning />

        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <directionalLight color="white" position={[0, 5, 5]} />
        <Dome />
        <group position={[0, -105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Floor />
        </group>

        {/* </PresentationControls> */}
      </Canvas>
    </div>
  );
}

export default MainPage;