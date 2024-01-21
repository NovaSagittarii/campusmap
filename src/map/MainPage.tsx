import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import { Model, aParams } from '../assets/Model'

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

function MainPage() {
  var tests = [...new Array(100)].map((_, i) => {
    return useRef<aParams>({
      bodyRotationX: 0,
      bodyRotationY: 0,
      bodyRotationZ: 0,
      headRotationX: 0,
      headRotationY: 0,
      headRotationZ: 0,
      hairRotationX: 0,
      hairRotationY: 0,
      hairRotationZ: 0,
    })
  });
  setInterval(() => {
    tests.forEach((test) => {
      if (!test.current) return;
      test.current.bodyRotationX += 0.01;
      test.current.bodyRotationY += 0.01;
      test.current.bodyRotationZ += 0.01;
    });
  }, 10);

  return (
    <div className="w-full h-screen">
      <Canvas className="bg-black h-full">
        {
          [...new Array(100)].map((_, i) => <Model position={[0, i * 5, 0]} animationParams={tests[i]} />)
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
