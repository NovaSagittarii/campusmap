import * as THREE from "three";
import {  useLoader } from "@react-three/fiber";
import Grass from "/grass.jpg";

export default function Floor() {
  const texture = useLoader(THREE.TextureLoader, Grass);
  const geometry = new THREE.PlaneGeometry(1000, 1000);
  const material = new THREE.MeshBasicMaterial({map: texture });
  return (
    <mesh geometry={geometry} material={material} />
  );
}
