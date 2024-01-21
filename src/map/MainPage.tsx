import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import { Model, aParams } from '../assets/Model'
import { randFloat } from "three/src/math/MathUtils.js";

const temp = new THREE.Object3D();
const material = new THREE.MeshPhongMaterial({ color: "red" });
const geometry = new THREE.SphereGeometry(1.0);
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
  return {
    bodyRotationX: 0,
    bodyRotationY: 0,
    bodyRotationZ: 0,
    headRotationX: 0,
    headRotationY: 0,
    headRotationZ: 0,
    hairRotationX: 0,
    hairRotationY: 0,
    hairRotationZ: 0,
  } as aParams;
}

function MainPage() {
  var tests = [...new Array(100)].map((_, i) => {
    return useRef<aParams>(createAParams());
  });
  for (var i = 0; i < tests.length; i++) {
    tests[i].current.bodyRotationX = randFloat(-0.1, 0.1);
    tests[i].current.bodyRotationY = randFloat(-0.1, 0.1);
    tests[i].current.bodyRotationZ = randFloat(-0.1, 0.1);
  }
  setInterval(() => {
    for (var i = 0; i < tests.length; i++) {
      tests[i].current.bodyRotationX = randFloat(-0.1, 0.1);
      tests[i].current.bodyRotationY = randFloat(-0.1, 0.1);
      tests[i].current.bodyRotationZ = randFloat(-0.1, 0.1);
    }
  }, 10000);

  return (
    <div className="w-full h-screen">
      <Canvas className="bg-black h-full">
        {
          [...new Array(100)].map((_, i) => <Model position={[(i % 5) * 5, Math.floor(i / 5) * 5, 0]} animationParams={tests[i]} key={i} />)
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
