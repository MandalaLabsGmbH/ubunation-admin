'use client'

import { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Mesh } from "three";

function MeshComponent() {
    const fileUrl = "https://deins.s3.eu-central-1.amazonaws.com/Objects3d/kloppocar/KloppoCar_05.gltf";
    const mesh = useRef<Mesh>(null!);
    const gltf = useLoader(GLTFLoader, fileUrl);
    
    return (
      <mesh ref={mesh}>
        <primitive object={gltf.scene} />
      </mesh>
    );
  }

  export function Collectible() {
    return (
      <div className='flex justify-center items-center h-100'>
        <Canvas>
        <OrbitControls />
        <Environment  preset='sunset' />
          <MeshComponent />
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