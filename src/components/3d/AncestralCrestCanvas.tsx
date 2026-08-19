'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Chinese Paper-Cut Medallion (剪纸 jiǎnzhǐ)
 *
 * A carved cinnabar-red medallion disc with a Chinese paper-cut zodiac
 * texture on the front face. Gold beveled rim, warm lantern lighting,
 * floating red-gold ember particles. Slow majestic rotation.
 */
export const AncestralCrestCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 240;
    const H = el.clientHeight || 240;

    /* ── Scene ──────────────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    /* ── Lights ─────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xfff5e6, 0.7));

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.6);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const warmFill = new THREE.PointLight(0xfed65b, 2.5, 20);
    warmFill.position.set(-3, 2, 4);
    scene.add(warmFill);

    const redRim = new THREE.PointLight(0xcc2222, 1.8, 18);
    redRim.position.set(2, -3, -2);
    scene.add(redRim);

    /* ── Root group (for whole-scene rotation) ──── */
    const root = new THREE.Group();
    scene.add(root);

    /* ── Texture loader ────────────────────────── */
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/textures/chinese-papercut.png');
    tex.colorSpace = THREE.SRGBColorSpace;

    /* ── Medallion Disc ────────────────────────── */
    const RADIUS = 1.7;
    const DEPTH = 0.15;
    const segments = 80;

    // Front face — paper-cut texture
    const frontGeo = new THREE.CircleGeometry(RADIUS, segments);
    const frontMat = new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.15,
      roughness: 0.55,
      side: THREE.FrontSide,
    });
    const front = new THREE.Mesh(frontGeo, frontMat);
    front.position.z = DEPTH / 2 + 0.001;

    // Back face — solid deep cinnabar with subtle sheen
    const backGeo = new THREE.CircleGeometry(RADIUS, segments);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x6b1010,
      metalness: 0.4,
      roughness: 0.5,
      side: THREE.FrontSide,
    });
    const back = new THREE.Mesh(backGeo, backMat);
    back.rotation.y = Math.PI; // face backward
    back.position.z = -(DEPTH / 2 + 0.001);

    // Edge rim — gold cylinder connecting front & back
    const rimGeo = new THREE.CylinderGeometry(RADIUS, RADIUS, DEPTH, segments, 1, true);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2; // orient edge outward

    // Outer decorative gold ring
    const outerRingGeo = new THREE.TorusGeometry(RADIUS + 0.04, 0.045, 20, segments);
    const outerRing = new THREE.Mesh(outerRingGeo, rimMat.clone());
    outerRing.position.z = 0;

    // Inner bevel ring — slightly inset
    const innerRingGeo = new THREE.TorusGeometry(RADIUS - 0.06, 0.025, 16, segments);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xc9a73a,
      metalness: 0.85,
      roughness: 0.2,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.position.z = DEPTH / 2 + 0.01;

    // Group the medallion
    const medallion = new THREE.Group();
    medallion.add(front, back, rim, outerRing, innerRing);
    root.add(medallion);

    /* ── Orbiting Jade Ring ────────────────────── */
    const jadeGeo = new THREE.TorusGeometry(2.4, 0.04, 20, 100);
    const jadeMat = new THREE.MeshStandardMaterial({
      color: 0x3d8b37,
      metalness: 0.55,
      roughness: 0.3,
      transparent: true,
      opacity: 0.75,
    });
    const jadeRing = new THREE.Mesh(jadeGeo, jadeMat);
    jadeRing.rotation.x = Math.PI / 3;
    root.add(jadeRing);

    /* ── Lantern Ember Particles ───────────────── */
    const N = 160;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pCol = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.6 + Math.random() * 2.8;
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);

      // 60% gold, 40% red
      if (Math.random() > 0.4) {
        pCol[i * 3] = 0.95; pCol[i * 3 + 1] = 0.82; pCol[i * 3 + 2] = 0.35;
      } else {
        pCol[i * 3] = 0.88; pCol[i * 3 + 1] = 0.18; pCol[i * 3 + 2] = 0.12;
      }
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.055,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Animation ─────────────────────────────── */
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Gentle Y rotation — shows front, edge, back, edge, front …
      medallion.rotation.y = t * 0.4;

      // Subtle tilt wobble
      medallion.rotation.x = Math.sin(t * 0.3) * 0.12;

      // Jade ring orbit
      jadeRing.rotation.z = t * 0.25;
      jadeRing.rotation.y = t * 0.15;

      // Particles slow drift
      particles.rotation.y = t * 0.03;

      // Lantern-flicker on the warm fill light
      warmFill.intensity = 2.2 + Math.sin(t * 2.5) * 0.4;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    /* ── Resize ────────────────────────────────── */
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
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
