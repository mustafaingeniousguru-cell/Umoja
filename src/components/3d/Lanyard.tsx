/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 0, 25],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  onDragChange
}: any) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        className="z-10"
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Suspense fallback={null}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              onDragChange={onDragChange}
            />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  onDragChange
}: any) {
  const band = useRef<any>(null),
    fixed = useRef<any>(null),
    j1 = useRef<any>(null),
    j2 = useRef<any>(null),
    j3 = useRef<any>(null),
    card = useRef<any>(null),
    nudgeApplied = useRef(false);
  
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
    
  const segmentProps: any = { type: 'dynamic', canSleep: false, colliders: false as const, angularDamping: 0.8, linearDamping: 0.8 };

  const { nodes, materials } = useGLTF('/card.glb') as any;
  const texture = useTexture(lanyardImage || '/lanyard.png') as THREE.Texture;
  const frontTex = useTexture(frontImage || BLANK_PIXEL) as THREE.Texture;
  const backTex = useTexture(backImage || BLANK_PIXEL) as THREE.Texture;

  // Manually load front/back images for canvas drawing
  const [frontImg, setFrontImg] = useState<HTMLImageElement | null>(null);
  const [backImg, setBackImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!frontImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setFrontImg(img);
    img.src = frontImage;
  }, [frontImage]);

  useEffect(() => {
    if (!backImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setBackImg(img);
    img.src = backImage;
  }, [backImage]);

  const cardMap = useMemo(() => {
    const baseMap = materials?.base?.map;
    if (!frontImage && !backImage) return baseMap || null;

    const baseImg = baseMap?.image;
    const W = baseImg?.width || 1024;
    const H = baseImg?.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap || null;

    // Draw base image or dark background
    if (baseImg) {
      ctx.drawImage(baseImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, W, H);
    }

    const drawFitted = (img: HTMLImageElement | null, rect: any) => {
      if (!img || !img.width || !img.height) return;
      const rx = rect.x * W, ry = rect.y * H, rw = rect.w * W, rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      const dx = rx + (rw - dw) / 2, dy = ry + (rh - dh) / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh); ctx.restore();
    };

    if (frontImage && frontImg) drawFitted(frontImg, { x: 0, y: 0, w: 1, h: 1 });
    if (backImage && backImg) drawFitted(backImg, { x: 0, y: 0, w: 1, h: 1 });

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap?.flipY ?? true;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontImg, backImg, materials]);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useEffect(() => {
    if (onDragChange) onDragChange(!!dragged);
  }, [dragged, onDragChange]);

  // INCREASED ROPE JOINTS FROM 1 TO 1.5 FOR A LONGER LANYARD (DORI BARI)
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.5]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.5]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.5]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!nudgeApplied.current && card.current && !dragged) {
      card.current.applyImpulse({ x: 1.5, y: 0, z: 0 }, true);
      nudgeApplied.current = true;
    }
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      if (band.current) band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  (curve as any).curveType = 'chordal';
  (texture as THREE.Texture).wrapS = (texture as THREE.Texture).wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/* SHIFTED ANCHOR UP SO LONGER ROPE FITS SCREEN */}
      <group position={[0, 6, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3} // INCREASED CARD SCALE FOR A MUCH BIGGER CARD
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => { (e.target as any).releasePointerCapture(e.pointerId); drag(false); }}
            onPointerDown={e => {
              (e.target as any).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {nodes && nodes.card ? (
              <>
                <mesh geometry={nodes.card.geometry}>
                  <meshPhysicalMaterial
                    map={cardMap || materials?.base?.map}
                    map-anisotropy={16}
                    clearcoat={isMobile ? 0 : 1}
                    clearcoatRoughness={0.15}
                    roughness={0.9}
                    metalness={0.3}
                  />
                </mesh>
                {nodes.clip && <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />}
                {nodes.clamp && <mesh geometry={nodes.clamp.geometry} material={materials.metal} />}
              </>
            ) : (
              // ENHANCED FALLBACK ID CARD GEOMETRY
              <group>
                {/* Main Card Body */}
                <mesh>
                   <boxGeometry args={[0.85, 1.3, 0.04]} />
                   <meshStandardMaterial map={cardMap || undefined} color={cardMap ? "#ffffff" : "#0a1628"} metalness={0.3} roughness={0.5} />
                </mesh>
                {/* Solid Gold Heavy Border Frame */}
                <mesh position={[0, 0, -0.025]}>
                   <boxGeometry args={[0.92, 1.37, 0.03]} />
                   <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            )}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error meshLineGeometry is registered via extend() */}
        <meshLineGeometry />
        {/* @ts-expect-error meshLineMaterial is registered via extend() */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
