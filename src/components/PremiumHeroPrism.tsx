'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function PremiumHeroPrism() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#05163B', 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // PRISM CRYSTAL (3-sided cylinder)
    const geometry = new THREE.CylinderGeometry(3, 3, 8, 3, 1, false);
    
    // Premium Glass Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95, // glass-like
      ior: 1.52,
      thickness: 2.0,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const prism = new THREE.Mesh(geometry, material);
    prism.rotation.x = Math.PI / 4;
    prism.rotation.z = Math.PI / 4;
    scene.add(prism);

    // Inner wireframe for structure
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });
    const edges = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(edges, wireframeMaterial);
    prism.add(wireframe);

    // MULTI-SPECTRUM LIGHTING
    const createLight = (color: number, intensity: number, distance: number) => {
      const light = new THREE.PointLight(color, intensity, distance);
      scene.add(light);
      return light;
    };

    const lights = [
      { obj: createLight(0x0B5A47, 40, 20), speed: 0.015, radius: 8, offset: 0 }, // Teal
      { obj: createLight(0xFFE9A1, 30, 20), speed: 0.02, radius: 7, offset: Math.PI * 0.5 }, // Butter
      { obj: createLight(0xF5F0E8, 25, 20), speed: 0.018, radius: 9, offset: Math.PI }, // Cream
      { obj: createLight(0x05163B, 80, 25), speed: 0.012, radius: 6, offset: Math.PI * 1.5 }, // Midnight Blue glow
      { obj: createLight(0x00FFAA, 30, 20), speed: 0.017, radius: 8, offset: Math.PI * 0.75 }, // Bright Teal highlight
    ];

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // DUST PARTICLES
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 450;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create a circular texture for particles
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (isReducedMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      
      targetX = (x / rect.width) * 1.5;
      targetY = (y / rect.height) * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // RESIZE
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate prism
      if (!isReducedMotion) {
        prism.rotation.y += 0.005;
        prism.rotation.x += 0.002;
      }

      // Orbit lights
      lights.forEach((light) => {
        const time = elapsedTime * (isReducedMotion ? light.speed * 0.2 : light.speed);
        light.obj.position.x = Math.sin(time * 20 + light.offset) * light.radius;
        light.obj.position.y = Math.cos(time * 15 + light.offset) * light.radius * 0.5;
        light.obj.position.z = Math.cos(time * 20 + light.offset) * light.radius;
      });

      // Slowly rotate particles
      if (!isReducedMotion) {
        particlesMesh.rotation.y = elapsedTime * 0.02;
        particlesMesh.rotation.x = elapsedTime * 0.01;
      }

      // Mouse Parallax easing (smoother)
      mouseX += (targetX - mouseX) * 0.03;
      mouseY += (targetY - mouseY) * 0.03;
      
      camera.position.x = mouseX * 2.5;
      camera.position.y = -mouseY * 2.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [isReducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] relative overflow-hidden flex items-center justify-center rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-transparent shadow-[inset_0_0_120px_rgba(255,0,85,0.05),inset_0_0_80px_rgba(0,255,170,0.05)] cursor-default"
    >
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(circle at center, transparent 0%, rgba(3,3,3,0.8) 100%)'
      }} />
    </div>
  );
}
