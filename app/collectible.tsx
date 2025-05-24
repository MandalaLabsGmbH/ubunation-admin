'use client'

import { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Mesh } from "three";

interface MeshComponentProps {
  url: string;
}

function MeshComponent({url}: MeshComponentProps) {
    const mesh = useRef<Mesh>(null!);
    const gltf = useLoader(GLTFLoader, url) as GLTF;;
    
    return (
      <mesh ref={mesh}>
        <primitive object={gltf.scene} />
      </mesh>
    );
  }

  export function Collectible({url}: MeshComponentProps) {
    return (
      <div className='flex justify-center items-center h-100'>
        <Canvas>
        <OrbitControls />
        <Environment  preset='sunset' />
          <MeshComponent url={url}
          />
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 1.8]}
            fov={60}
            zoom={2.5}
            />
        </Canvas>
      </div>
    );
  }