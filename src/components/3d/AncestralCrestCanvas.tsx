'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Chinese Heritage 3D Scene
 * - Imperial Jade Seal (方印 fāngyìn) — beveled box with gold edges
 * - Two concentric Jade Rings (玉环 yùhuán) orbiting the seal
 * - Floating red lantern sparks (灯笼火花)
 * - Red & gold colour palette matching Chinese imperial aesthetics
 */
export const AncestralCrestCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // ── Scene, Camera, Renderer ──────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Lighting ─────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff5e6, 0.6));

    const warmLight = new THREE.PointLight(0xfed65b, 3, 30);
    warmLight.position.set(4, 4, 4);
    scene.add(warmLight);

    const redFill = new THREE.PointLight(0xcc2222, 2, 25);
    redFill.position.set(-4, -2, 3);
    scene.add(redFill);

    const rimLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    rimLight.position.set(-2, 5, -3);
    scene.add(rimLight);

    // ── Root Group ───────────────────────────────────────
    const root = new THREE.Group();
    scene.add(root);

    // ── 1. Imperial Jade Seal (方印) ─────────────────────
    // Deep vermilion body with rounded edges
    const sealGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6, 4, 4, 4);
    // Soften corners procedurally
    const pos = sealGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const len = Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
      const factor = 0.82 + 0.18 * (v.length() / (len * Math.sqrt(3)));
      v.multiplyScalar(factor);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    sealGeo.computeVertexNormals();

    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x8e1616,
      metalness: 0.35,
      roughness: 0.45,
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    root.add(seal);

    // Wireframe overlay to hint at engraved characters
    const sealWire = new THREE.Mesh(
      sealGeo,
      new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true, transparent: true, opacity: 0.25 })
    );
    root.add(sealWire);

    // ── 2. Jade Rings (玉环) ─────────────────────────────
    const jadeMat = new THREE.MeshStandardMaterial({
      color: 0x3d8b37, // jade green
      metalness: 0.6,
      roughness: 0.25,
      transparent: true,
      opacity: 0.85,
    });

    const ring1Geo = new THREE.TorusGeometry(2.2, 0.06, 24, 120);
    const ring1 = new THREE.Mesh(ring1Geo, jadeMat);
    root.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.05, 24, 120);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring2 = new THREE.Mesh(ring2Geo, goldRingMat);
    ring2.rotation.x = Math.PI / 2;
    root.add(ring2);

    // Third smaller ring — perpendicular accent
    const ring3Geo = new THREE.TorusGeometry(1.9, 0.04, 20, 100);
    const ring3 = new THREE.Mesh(ring3Geo, goldRingMat.clone());
    (ring3.material as THREE.MeshStandardMaterial).opacity = 0.7;
    (ring3.material as THREE.MeshStandardMaterial).transparent = true;
    ring3.rotation.y = Math.PI / 2;
    root.add(ring3);

    // ── 3. Lantern Sparks (灯笼火花) ────────────────────
    const sparkCount = 180;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 3;
      sparkPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sparkPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sparkPos[i * 3 + 2] = r * Math.cos(phi);

      // Mix red and gold sparks
      if (Math.random() > 0.5) {
        sparkColors[i * 3] = 0.95;
        sparkColors[i * 3 + 1] = 0.84;
        sparkColors[i * 3 + 2] = 0.36;
      } else {
        sparkColors[i * 3] = 0.85;
        sparkColors[i * 3 + 1] = 0.15;
        sparkColors[i * 3 + 2] = 0.1;
      }
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // ── Animation Loop ──────────────────────────────────
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Slow majestic rotation of the whole group
      root.rotation.y = t * 0.35;
      root.rotation.x = Math.sin(t * 0.15) * 0.15;

      // Seal gentle self-rotation
      seal.rotation.y = -t * 0.5;
      sealWire.rotation.y = -t * 0.5;

      // Jade ring orbits
      ring1.rotation.z = t * 0.4;
      ring2.rotation.y = -t * 0.3;
      ring3.rotation.x = t * 0.25;

      // Spark field slow drift
      sparks.rotation.y = t * 0.04;
      sparks.rotation.x = Math.sin(t * 0.1) * 0.08;

      // Pulsing light intensity (like lantern flicker)
      warmLight.intensity = 2.5 + Math.sin(t * 2) * 0.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // ── Resize ───────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-48 h-48 md:w-56 md:h-56 mx-auto flex items-center justify-center relative z-10"
    />
  );
};
