'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ── Brand colours (Brand Book strict #0F172A) ── */
const C = {
  midnight:  '#05163B',
  midnight2: '#1A2540',
  butter:    '#FFE9A1',
  teal:      '#0B5A47',
  tealDim:   'rgba(11, 90, 71, 0.35)',
  cream:     '#F5F0E8',
  lavender:  '#E1D6FF',
};

/* ── Lat/Lng → Cartesian on sphere of radius r ── */
/* ── Lat/Lng → Cartesian on sphere of radius r ── */
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ── Location structure with sectors ── */
interface LocationData {
  lat: number;
  lng: number;
  sector: 'ai' | 'climate' | 'tech';
  name: string;
}

const LOCATIONS: LocationData[] = [
  { lat:  20.6, lng:  78.9, sector: 'tech',    name: 'India' },
  { lat:  37.1, lng: -95.7, sector: 'climate', name: 'United States' },
  { lat:  51.5, lng:  -0.1, sector: 'ai',      name: 'United Kingdom' },
  { lat:  50.4, lng:  30.5, sector: 'climate', name: 'Eastern Europe' },
  { lat: -29.0, lng:  26.0, sector: 'tech',    name: 'South Africa' },
  { lat:  28.6, lng:  77.2, sector: 'ai',      name: 'Delhi' },
  { lat:  46.2, lng:   6.1, sector: 'climate', name: 'Geneva' },
  { lat:  24.8, lng: 120.9, sector: 'tech',    name: 'Taiwan' },
];

/* ── Arc pairs (indices into LOCATIONS) ── */
const ARC_PAIRS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4],
  [0, 6], [7, 1], [3, 5],
];

interface ThreeGlobeProps {
  onCountrySelect?: (country: string | null) => void;
  activeSector: 'all' | 'ai' | 'climate' | 'tech';
}

export default function ThreeGlobe({ onCountrySelect, activeSector }: ThreeGlobeProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const meshesRef = useRef<{
    dots: THREE.Mesh[];
    halos: THREE.Mesh[];
    arcs: { mesh: THREE.Mesh; sectorA: string; sectorB: string }[];
  }>({ dots: [], halos: [], arcs: [] });

  /* ── Effect to handle interactive filtering ── */
  useEffect(() => {
    const { dots, halos, arcs } = meshesRef.current;
    
    dots.forEach((mesh, i) => {
      const sector = LOCATIONS[i].sector;
      const active = activeSector === 'all' || sector === activeSector;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.transparent = true;
        mat.opacity = active ? 1.0 : 0.15;
        mat.needsUpdate = true;
      }
    });

    halos.forEach((mesh, i) => {
      const sector = LOCATIONS[i].sector;
      const active = activeSector === 'all' || sector === activeSector;
      mesh.visible = active;
    });

    arcs.forEach(({ mesh, sectorA, sectorB }) => {
      const active = activeSector === 'all' || sectorA === activeSector || sectorB === activeSector;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.transparent = true;
        mat.opacity = active ? 0.32 : 0.05;
        mat.needsUpdate = true;
      }
    });
  }, [activeSector]);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    /* ── Reset mesh tracking ── */
    meshesRef.current = { dots: [], halos: [], arcs: [] };

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / 500, 0.1, 100);
    camera.position.z = 7.5;

    /* ── Globe group ── */
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    const RADIUS = 2.4;

    /* ── Globe surface ── */
    const geo = new THREE.SphereGeometry(RADIUS, 72, 72);
    const textureLoader = new THREE.TextureLoader();

    // Procedural fallback material (cinematic deep navy + subtle variation)
    const fallbackMat = new THREE.MeshPhongMaterial({
      color:     new THREE.Color(0x0a1a35),
      emissive:  new THREE.Color(0x071428),
      shininess: 18,
      specular:  new THREE.Color(0x1a3a5c),
    });

    const globe = new THREE.Mesh(geo, fallbackMat);
    globeGroup.add(globe);

    // Attempt to load NASA day texture
    textureLoader.load(
      '/textures/earth_day.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        globe.material = new THREE.MeshPhongMaterial({
          map:      tex,
          shininess: 12,
          specular: new THREE.Color(0x1a3a5c),
        });
        (globe.material as THREE.Material).needsUpdate = true;
      },
      undefined,
      () => { /* silently use fallback */ }
    );

    // Night lights emissive layer
    const nightGeo  = new THREE.SphereGeometry(RADIUS + 0.001, 72, 72);
    const nightMesh = new THREE.Mesh(
      nightGeo,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    globeGroup.add(nightMesh);
    textureLoader.load('/textures/earth_night.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      (nightMesh.material as THREE.MeshBasicMaterial).map     = tex;
      (nightMesh.material as THREE.MeshBasicMaterial).opacity = 0.45;
      (nightMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    });

    /* ── Atmosphere glow (Brand Teal #BDE7D9) ── */
    const atmosGeo = new THREE.SphereGeometry(RADIUS * 1.065, 48, 48);
    const atmosMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          // Brand teal: #0B5A47 = 0.043, 0.353, 0.278
          float pulse = 0.38 + 0.04 * sin(time * 0.8);
          gl_FragColor = vec4(0.043, 0.353, 0.278, pulse) * intensity;
        }
      `,
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    /* ── Inner glow ring (faint, adds depth) ── */
    const innerGlowGeo = new THREE.SphereGeometry(RADIUS * 1.02, 48, 48);
    const innerGlowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(0.043, 0.353, 0.278, 0.12) * intensity;
        }
      `,
    });
    globeGroup.add(new THREE.Mesh(innerGlowGeo, innerGlowMat));

    /* ── Cloud layer ── */
    const cloudGeo  = new THREE.SphereGeometry(RADIUS * 1.012, 52, 52);
    const cloudMat  = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.13, depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(clouds);
    textureLoader.load('/textures/earth_clouds.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      (cloudMat as THREE.MeshBasicMaterial).map = tex;
      (cloudMat as THREE.MeshBasicMaterial).opacity  = 0.35;
      cloudMat.needsUpdate = true;
    });

    /* ── Marker dots (Butter Gold, proper lat/lng→sphere) ── */
    const markerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.butter) });
    const signalDots: { mesh: THREE.Mesh; phase: number }[] = [];

    LOCATIONS.forEach(({ lat, lng }, i) => {
      const pos = latLngToVec3(lat, lng, RADIUS + 0.04);

      // Core dot
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), markerMat.clone());
      dot.position.copy(pos);
      globeGroup.add(dot);
      meshesRef.current.dots.push(dot);

      // Animated halo ring
      const ringGeo  = new THREE.RingGeometry(0.045, 0.065, 16);
      const ringMat  = new THREE.MeshBasicMaterial({
        color: new THREE.Color(C.butter),
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0).sub(pos).negate().add(pos));
      globeGroup.add(ring);
      meshesRef.current.halos.push(ring);

      signalDots.push({ mesh: ring, phase: i * 0.85 });
    });

    /* ── Arc lines (Bezier TubeGeometry, brand teal) ── */
    ARC_PAIRS.forEach(([a, b]) => {
      const start = latLngToVec3(LOCATIONS[a].lat, LOCATIONS[a].lng, RADIUS);
      const end   = latLngToVec3(LOCATIONS[b].lat, LOCATIONS[b].lng, RADIUS);

      // Control point lifted above the surface
      const mid  = start.clone().add(end).multiplyScalar(0.5);
      const lift = RADIUS * (0.3 + mid.length() * 0.08);
      mid.normalize().multiplyScalar(RADIUS + lift);

      const curve    = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tubeGeo  = new THREE.TubeGeometry(curve, 40, 0.006, 5, false);
      const tubeMat  = new THREE.MeshBasicMaterial({
        color: new THREE.Color(C.lavender),
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
      });
      const arcMesh = new THREE.Mesh(tubeGeo, tubeMat);
      globeGroup.add(arcMesh);
      meshesRef.current.arcs.push({
        mesh: arcMesh,
        sectorA: LOCATIONS[a].sector,
        sectorB: LOCATIONS[b].sector,
      });
    });

    /* ── Latitude / Longitude grid lines ── */
    const gridMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(C.teal),
      transparent: true,
      opacity: 0.06,
    });
    // Lat lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 4) {
        pts.push(latLngToVec3(lat, lng - 180, RADIUS + 0.005));
      }
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    // Lng lines
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) {
        pts.push(latLngToVec3(lat, lng - 180, RADIUS + 0.005));
      }
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfff8e8, 1.4);
    sun.position.set(6, 3, 5);
    scene.add(sun);
    const fillLight = new THREE.PointLight(new THREE.Color(C.teal), 0.25);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    /* ── Pointer drag rotation ── */
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let velX  = 0, velY  = 0;
    let autoRotate = true;

    const onPointerDown = (e: PointerEvent) => {
      isDragging  = true;
      autoRotate  = false;
      prevX = e.clientX;
      prevY = e.clientY;
      velX  = velY = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      velX = dx * 0.006;
      velY = dy * 0.006;
      globeGroup.rotation.y += velX;
      globeGroup.rotation.x += velY;
      globeGroup.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, globeGroup.rotation.x));
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => {
      isDragging = false;
      // Re-enable auto-rotate after 3s of inactivity
      setTimeout(() => { autoRotate = true; }, 3000);
    };

    /* ── Scroll zoom ── */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(4.5, Math.min(12, camera.position.z + e.deltaY * 0.01));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup',   onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.style.cursor = 'grab';

    /* Size update helper */
    const updateSize = () => {
      const width = container.clientWidth;
      const height = 500;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    updateSize();

    /* ── ResizeObserver ── */
    const ro = new ResizeObserver(() => {
      updateSize();
    });
    ro.observe(container);

    /* ── Animation loop ── */
    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      // Auto-rotate (slow cinematic pan)
      if (autoRotate && !isDragging) {
        globeGroup.rotation.y += 0.0025;
      }
      // Momentum
      if (!isDragging && (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001)) {
        globeGroup.rotation.y += velX;
        globeGroup.rotation.x += velY;
        globeGroup.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, globeGroup.rotation.x));
        velX *= 0.92;
        velY *= 0.92;
      }

      // Cloud drift
      clouds.rotation.y += 0.00035;

      // Atmosphere pulse
      atmosMat.uniforms.time.value = t;

      // Signal dot pulse (scale rings)
      signalDots.forEach(({ mesh, phase }) => {
        const s = 1 + 0.45 * Math.sin(t * 2.2 + phase);
        mesh.scale.setScalar(s);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 - 0.35 * Math.abs(Math.sin(t * 2.2 + phase));
      });

      renderer.render(scene, camera);
    };
    animate();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup',   onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative h-[500px]"
    >
      {/* Subtle glow halo behind globe */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225, 214, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: 4,
          position: 'relative',
          zIndex: 1,
          cursor: 'grab',
        }}
      />
      {/* Hint text */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(11, 90, 71, 0.85)',
          fontFamily: 'var(--font-inter, sans-serif)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        Drag · Rotate · Scroll to Zoom
      </div>
    </div>
  );
}