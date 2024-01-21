/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { MutableRefObject, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

export type aParams = {
  bodyRotationX: number;
  bodyRotationY: number;
  bodyRotationZ: number;
  headRotationX: number;
  headRotationY: number;
  headRotationZ: number;
  hairRotationX: number;
  hairRotationY: number;
  hairRotationZ: number;
}

type ModelProps = ThreeElements["mesh"] & {
  animationParams: MutableRefObject<aParams>;
}

export function Model({ animationParams, ...props }: ModelProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const hairRef = useRef<THREE.Mesh>(null);
  const { nodes, materials } = useGLTF("/playermodel.gltf");

  useFrame(() => {
    if (!headRef.current || !bodyRef.current || !hairRef.current) return;
    // headRef.current.rotation.y += 0.01;
    // headRef.current.rotation.x += 0.01;
    // headRef.current.rotation.z += 0.01;
    // hairRef.current.rotation.y += 0.01;
    // hairRef.current.rotation.x += 0.01;
    // hairRef.current.rotation.z += 0.01;
    bodyRef.current.rotation.x += animationParams.current.bodyRotationX;
    bodyRef.current.rotation.y += animationParams.current.bodyRotationY;
    bodyRef.current.rotation.z += animationParams.current.bodyRotationZ;
  });

  return (
    <group {...props} dispose={null} ref={bodyRef}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Body.geometry}
        material={materials.Material}
        scale={[1, 0.927, 1]}
      />
      <mesh ref={headRef}
        castShadow
        receiveShadow
        geometry={nodes.Head.geometry}
        material={materials.Material}
        position={[0, 0.812, 0]}
        scale={0.626}
      />
      <mesh ref={hairRef}
        castShadow
        receiveShadow
        geometry={nodes.Hair.geometry}
        material={materials.Material}
        position={[0, 0.812, 0]}
        scale={0.626}
      />
    </group>
  );
}

useGLTF.preload("/playerModel.gltf");
