'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AncestralCrestCanvasProps {
  isUnlocked?: boolean;
}

export const AncestralCrestCanvas: React.FC<AncestralCrestCanvasProps> = ({ isUnlocked }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const ringMesh1Ref = useRef<THREE.Mesh | null>(null);
  const ringMesh2Ref = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfed65b, 3, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const redLight = new THREE.PointLight(0x8e1616, 4, 50);
    redLight.position.set(-5, -5, -5);
    scene.add(redLight);

    // Group Container
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Imperial Diamond/Octahedron Mesh
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x8e1616,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMeshRef.current = coreMesh;
    group.add(coreMesh);

    // 2. Outer Gold Ring 1
    const ringGeo1 = new THREE.TorusGeometry(2.0, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xfed65b,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1Ref.current = ringMesh1;
    group.add(ringMesh1);

    // 3. Outer Gold Ring 2 (Perpendicular)
    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 2;
    ringMesh2Ref.current = ringMesh2;
    group.add(ringMesh2);

    // 4. Golden Star Dust Particles Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfed65b,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Procedural Rotation
      group.rotation.y = elapsed * 0.4;
      group.rotation.x = Math.sin(elapsed * 0.2) * 0.2;

      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.y = -elapsed * 0.8;
      }
      if (ringMesh1Ref.current) {
        ringMesh1Ref.current.rotation.z = elapsed * 0.5;
      }
      if (ringMesh2Ref.current) {
        ringMesh2Ref.current.rotation.y = -elapsed * 0.6;
      }

      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-48 h-48 md:w-60 md:h-60 mx-auto flex items-center justify-center relative z-10"
    />
  );
};
