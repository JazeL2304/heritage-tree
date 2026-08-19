'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Chinese Paper-Cut Medallion (剪纸 jiǎnzhǐ)
 *
 * Interactive 3D medallion — drag to rotate, auto-rotates when idle.
 * Red & gold palette only (no jade green).
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

    /* ── Texture ───────────────────────────────── */
    const tex = new THREE.TextureLoader().load('/textures/chinese-papercut.png');
    tex.colorSpace = THREE.SRGBColorSpace;

    /* ── Medallion Disc ────────────────────────── */
    const RADIUS = 1.7;
    const DEPTH = 0.15;
    const seg = 80;

    // Front — paper-cut texture
    const front = new THREE.Mesh(
      new THREE.CircleGeometry(RADIUS, seg),
      new THREE.MeshStandardMaterial({ map: tex, metalness: 0.15, roughness: 0.55 })
    );
    front.position.z = DEPTH / 2 + 0.001;

    // Back — same paper-cut texture (mirrored)
    const backTex = tex.clone();
    backTex.wrapS = THREE.RepeatWrapping;
    backTex.repeat.x = -1; // mirror horizontally
    const back = new THREE.Mesh(
      new THREE.CircleGeometry(RADIUS, seg),
      new THREE.MeshStandardMaterial({ map: backTex, metalness: 0.15, roughness: 0.55 })
    );
    back.rotation.y = Math.PI;
    back.position.z = -(DEPTH / 2 + 0.001);

    // Edge rim — gold
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 });
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(RADIUS, RADIUS, DEPTH, seg, 1, true),
      rimMat
    );
    rim.rotation.x = Math.PI / 2;

    // Outer gold ring
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS + 0.04, 0.045, 20, seg),
      rimMat.clone()
    );

    // Inner bevel ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS - 0.06, 0.025, 16, seg),
      new THREE.MeshStandardMaterial({ color: 0xc9a73a, metalness: 0.85, roughness: 0.2 })
    );
    innerRing.position.z = DEPTH / 2 + 0.01;

    const medallion = new THREE.Group();
    medallion.add(front, back, rim, outerRing, innerRing);
    scene.add(medallion);

    /* ── Lantern Ember Particles ───────────────── */
    const N = 140;
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

      // Gold & red sparks only
      if (Math.random() > 0.4) {
        pCol[i * 3] = 0.95; pCol[i * 3 + 1] = 0.82; pCol[i * 3 + 2] = 0.35;
      } else {
        pCol[i * 3] = 0.88; pCol[i * 3 + 1] = 0.18; pCol[i * 3 + 2] = 0.12;
      }
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.055, transparent: true, opacity: 0.8, vertexColors: true,
    }));
    scene.add(particles);

    /* ── Drag Interaction ──────────────────────── */
    let isDragging = false;
    let prevX = 0;
    let userOffsetY = 0;   // drag delta during current gesture
    let angleAtGrab = 0;   // medallion.rotation.y snapshot when grabbed
    let timeAtRelease = 0; // clock time when last released (to offset auto-rot)
    let baseAngle = 0;     // persistent angle carried across grabs

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      userOffsetY = 0;
      // Snapshot current visual angle
      angleAtGrab = medallion.rotation.y;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      userOffsetY += dx * 0.01;
      prevX = e.clientX;
    };

    const onPointerUp = () => {
      if (isDragging) {
        // Persist the final angle and reset auto-rotation clock offset
        baseAngle = angleAtGrab + userOffsetY;
        timeAtRelease = clock.getElapsedTime();
      }
      isDragging = false;
    };

    const canvas = renderer.domElement;
    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    /* ── Animation ─────────────────────────────── */
    let frameId: number;
    const clock = new THREE.Clock();
    const AUTO_SPEED = 0.35; // rad/s

    const animate = () => {
      const t = clock.getElapsedTime();

      if (isDragging) {
        // Show snapshot angle + user drag offset (auto-rot frozen)
        medallion.rotation.y = angleAtGrab + userOffsetY;
      } else {
        // Auto-rotate from the angle where user released
        medallion.rotation.y = baseAngle + AUTO_SPEED * (t - timeAtRelease);
      }

      // Gentle tilt wobble
      medallion.rotation.x = Math.sin(t * 0.3) * 0.08;

      // Particles slow drift
      particles.rotation.y = t * 0.03;

      // Lantern flicker
      warmFill.intensity = 2.2 + Math.sin(t * 2.5) * 0.4;

      // Cursor style
      canvas.style.cursor = isDragging ? 'grabbing' : 'grab';

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
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
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
