import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function GoldEmblem3DCanvas({ 
    tiltX = 0, 
    tiltY = 0, 
    isHovered = false,
    className = "" 
}) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const meshRef = useRef(null);
    const topKeyLightRef = useRef(null);
    const ambientLightRef = useRef(null);
    const animIdRef = useRef(null);

    // Refs to track live tilt props inside animation loop
    const tiltXRef = useRef(tiltX);
    const tiltYRef = useRef(tiltY);
    const isHoveredRef = useRef(isHovered);
    tiltXRef.current = tiltX;
    tiltYRef.current = tiltY;
    isHoveredRef.current = isHovered;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 160;
        const height = container.clientHeight || 210;

        // 1. Three.js Scene & Camera Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.8);

        // 2. High-Precision WebGL Renderer
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 3. TOP-DOWN STUDIO LIGHTING RIG (Emitting from JUST SEAN FLOWS Header above)
        // Warm overall ambient fill
        const ambientLight = new THREE.AmbientLight(0xFFF2D6, 1.4);
        scene.add(ambientLight);
        ambientLightRef.current = ambientLight;

        // Primary 18K Gold Spotlight from Top Header (JUST • SEAN • FLOWS)
        const topKeyLight = new THREE.PointLight(0xFFE89A, 4.2, 14);
        topKeyLight.position.set(0, 3.8, 2.6);
        scene.add(topKeyLight);
        topKeyLightRef.current = topKeyLight;

        // Secondary Soft Champagne Rim Light from top-left
        const topRimLight = new THREE.PointLight(0xFFFFFF, 2.2, 10);
        topRimLight.position.set(-1.8, 3.2, 2.2);
        scene.add(topRimLight);

        // Subtle Bordeaux Velvet Floor Bounce
        const bottomBounce = new THREE.PointLight(0x8A1428, 0.9, 8);
        bottomBounce.position.set(0, -2.5, 1.5);
        scene.add(bottomBounce);

        // 4. Texture Preloading (Emblem Alpha & 3D Normal Map)
        const textureLoader = new THREE.TextureLoader();
        const diffuseMap = textureLoader.load('/assets/logo/jsf_emblem_transparent.png');
        const normalMap = textureLoader.load('/assets/logo/jsf_emblem_normal.png');

        diffuseMap.colorSpace = THREE.SRGBColorSpace;

        // 5. 18K Real Gold Physical Material
        const goldMaterial = new THREE.MeshPhysicalMaterial({
            map: diffuseMap,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(1.6, 1.6),
            transparent: true,
            alphaTest: 0.05,
            metalness: 0.95,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            color: new THREE.Color(0xFFE698),
            emissive: new THREE.Color(0x2A1800),
            emissiveIntensity: 0.28,
            side: THREE.DoubleSide
        });

        // 6. 3D Embossed Plane Geometry (3:4 ratio)
        const geometry = new THREE.PlaneGeometry(1.65, 2.2, 32, 32);
        const mesh = new THREE.Mesh(geometry, goldMaterial);
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
        meshRef.current = mesh;

        // 7. 60FPS Render & 1/3 Sensitivity Smooth Gyro Animation Loop
        let startTime = performance.now();

        const animate = () => {
            const now = performance.now();
            const elapsed = (now - startTime) / 1000;

            const curTiltX = tiltXRef.current;
            const curTiltY = tiltYRef.current;
            const curHover = isHoveredRef.current;

            if (meshRef.current) {
                // 1/3 Sensitivity Tilt Interpolation (Subtle, regal, museum-grade)
                const targetRotX = (-curTiltY * 0.15) + Math.sin(elapsed * 0.7) * 0.018;
                const targetRotY = (curTiltX * 0.15) + Math.cos(elapsed * 0.6) * 0.022;
                const targetZ = (curHover ? 0.2 : 0) + Math.sin(elapsed * 1.4) * 0.02;

                meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.10;
                meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.10;
                meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.10;
            }

            // Top Header Light Source: Gracefully glides from the top position
            if (topKeyLightRef.current) {
                topKeyLightRef.current.position.x = (curTiltX * 0.8) + Math.sin(elapsed * 0.8) * 0.4;
                topKeyLightRef.current.position.y = 3.6 + (-curTiltY * 0.5) + Math.cos(elapsed * 0.6) * 0.25;
                topKeyLightRef.current.position.z = 2.6;
            }

            renderer.render(scene, camera);
            animIdRef.current = requestAnimationFrame(animate);
        };

        animIdRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            if (!container || !rendererRef.current) return;
            const w = container.clientWidth || 160;
            const h = container.clientHeight || 210;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            goldMaterial.dispose();
            diffuseMap.dispose();
            normalMap.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
