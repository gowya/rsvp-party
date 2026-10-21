"use client";

import { useEffect, useRef } from "react";
import type * as ThreeNS from "three";
import { motion } from "@/lib/motion";

const TILE_TINTS = ["#fff6c2", "#ffee8c", "#ffd95a", "#ffb347", "#ff8a3d", "#ff7eb6", "#ffffff"];

// Sans WebGL (désactivé, vieux téléphone…), une boule fixe en CSS au lieu de faire planter la page
function cssFallback(host: HTMLElement) {
  const fallback = document.createElement("div");
  Object.assign(fallback.style, {
    width: "78%",
    aspectRatio: "1",
    margin: "11%",
    borderRadius: "50%",
    background: [
      "radial-gradient(circle at 34% 28%, rgb(255 255 255 / 0.9) 0 6%, transparent 22%)",
      "repeating-linear-gradient(0deg, rgb(58 31 12 / 0.55) 0 2px, transparent 2px 9%)",
      "repeating-linear-gradient(90deg, rgb(58 31 12 / 0.55) 0 2px, transparent 2px 9%)",
      "radial-gradient(circle at 40% 35%, #fff6c2, #ffd95a 45%, #ff8a3d 80%, #3a1f0c)",
    ].join(","),
    boxShadow: "inset -10px -14px 30px rgb(58 31 12 / 0.45)",
  });
  host.appendChild(fallback);
  return () => fallback.remove();
}

function mountBall(THREE: typeof ThreeNS, RoomEnvironment: new () => ThreeNS.Scene, host: HTMLElement) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer: ThreeNS.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return cssFallback(host);
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 4.6);

  const ball = new THREE.Group();
  scene.add(ball);

  // Noyau sombre entre les facettes
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.985, 32, 24), new THREE.MeshStandardMaterial({ color: "#3a1f0c", roughness: 0.8 }));
  ball.add(core);

  // Facettes miroir posées anneau par anneau
  const rows = 26;
  const tile = (Math.PI / rows) * 0.88;
  const positions: { phi: number; theta: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const phi = ((r + 0.5) / rows) * Math.PI;
    const ringLength = 2 * Math.PI * Math.sin(phi);
    const count = Math.max(4, Math.round(ringLength / (Math.PI / rows)));
    const offset = r % 2 ? 0.5 : 0;
    for (let c = 0; c < count; c++) positions.push({ phi, theta: ((c + offset) / count) * Math.PI * 2 });
  }

  const tiles = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(tile, tile),
    new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.1, envMapIntensity: 1.9, side: THREE.DoubleSide }),
    positions.length,
  );
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  positions.forEach(({ phi, theta }, i) => {
    const dir = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    dummy.position.copy(dir);
    dummy.lookAt(dir.clone().multiplyScalar(2));
    dummy.updateMatrix();
    tiles.setMatrixAt(i, dummy.matrix);
    color.set(Math.random() < 0.55 ? TILE_TINTS[0] : TILE_TINTS[Math.floor(Math.random() * TILE_TINTS.length)]);
    tiles.setColorAt(i, color);
  });
  ball.add(tiles);

  // Lumières de coucher de soleil
  scene.add(new THREE.AmbientLight("#fff1c4", 0.6));
  const key = new THREE.DirectionalLight("#fff3c0", 2.2);
  key.position.set(2, 3, 4);
  scene.add(key);
  const warm = new THREE.PointLight("#ff8a3d", 14, 10);
  const pink = new THREE.PointLight("#ff7eb6", 10, 10);
  scene.add(warm, pink);

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  let raf = 0;
  let running = false;
  const start = performance.now();
  let last = start;
  let spin = 0;
  const render = () => {
    const now = performance.now();
    const t = (now - start) / 1000;
    const dt = Math.min(now - last, 50) / 1000;
    last = now;
    // Tourne plus vite quand on scrolle vite, penche avec la souris ou le téléphone
    spin += dt * (0.35 + motion.spinBoost * 1.6);
    ball.rotation.y = spin;
    ball.rotation.x += (motion.tiltY * 0.3 - ball.rotation.x) * 0.06;
    ball.rotation.z += (-motion.tiltX * 0.25 - ball.rotation.z) * 0.06;
    warm.position.set(Math.cos(t * 0.8) * 3, -1.2, Math.sin(t * 0.8) * 3);
    pink.position.set(Math.cos(t * 0.6 + 2) * -3, 1.4, Math.sin(t * 0.6 + 2) * 3);
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(render);
  };

  // Le rendu ne tourne que quand la boule est à l'écran
  const io = new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting && !reduceMotion;
    if (visible && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(render);
    } else if (!visible) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  io.observe(host);
  render();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    tiles.geometry.dispose();
    (tiles.material as ThreeNS.Material).dispose();
    core.geometry.dispose();
    (core.material as ThreeNS.Material).dispose();
    envMap.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export default function DiscoBall({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    // La 3D est chargée à part, pendant le loader : elle ne retarde plus le démarrage du site
    Promise.all([import("three"), import("three/examples/jsm/environments/RoomEnvironment.js")])
      .then(([THREE, { RoomEnvironment }]) => {
        if (!cancelled) cleanup = mountBall(THREE, RoomEnvironment, host);
      })
      .catch(() => {
        if (!cancelled) cleanup = cssFallback(host);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
