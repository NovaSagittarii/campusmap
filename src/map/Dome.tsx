import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import Tour from "/tour.jpg";

export default function Dome() {
  const texture = useLoader(THREE.TextureLoader, Tour);
  const geometry = new THREE.SphereGeometry(800, 20, 20);
  const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
  return (
    <mesh geometry={geometry} material={material} />
  );
}
