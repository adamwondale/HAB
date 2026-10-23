import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Layers,
  Package,
  Compass
} from 'lucide-react';
import { StockItem, ServiceType } from '../types/hrm';

interface Warehouse3DViewProps {
  stockItems: StockItem[];
  selectedDivision: 'All' | ServiceType;
  canVerifyInventory: boolean;
  canManageCatalogAndRestock: boolean;
  onQuickTransaction: (
    item: StockItem,
    type: 'Issued (Out)' | 'Received (Restock)' | 'Returned (In)'
  ) => void;
  onSelectDivision?: (div: 'All' | ServiceType) => void;
}

export interface WarehouseZonePreset {
  id: string;
  label: string;
  shortLabel: string;
  division: 'All' | ServiceType;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  colorHex: string;
}

export const WAREHOUSE_ZONES: WarehouseZonePreset[] = [
  {
    id: 'overview',
    label: 'Full Warehouse Overview',
    shortLabel: 'Overview',
    division: 'All',
    cameraPos: [0, 11.5, 16.5],
    lookAt: [0, 1.6, 0],
    colorHex: '#f59e0b'
  },
  {
    id: 'zone-a',
    label: 'Bay A & B · Security Gear & Radios',
    shortLabel: 'Zone A/B (Security)',
    division: 'Security',
    cameraPos: [-6.5, 4.2, 6.8],
    lookAt: [-6.5, 1.8, -1.5],
    colorHex: '#3b82f6'
  },
  {
    id: 'zone-c',
    label: 'Bay C · Cleaning & Chemical Store',
    shortLabel: 'Zone C (Cleaning)',
    division: 'Cleaning',
    cameraPos: [-1.8, 4.2, 6.8],
    lookAt: [-1.8, 1.8, -1.5],
    colorHex: '#10b981'
  },
  {
    id: 'zone-d',
    label: 'Bay D · Property Maintenance & Electrical',
    shortLabel: 'Zone D (Property)',
    division: 'Property Management',
    cameraPos: [2.8, 4.2, 6.8],
    lookAt: [2.8, 1.8, -1.5],
    colorHex: '#f59e0b'
  },
  {
    id: 'zone-e',
    label: 'Bay E · Head Office & Stationery',
    shortLabel: 'Zone E (HQ Store)',
    division: 'Head Office Staff',
    cameraPos: [7.2, 4.2, 6.8],
    lookAt: [7.2, 1.8, -1.5],
    colorHex: '#a855f7'
  },
  {
    id: 'dock',
    label: 'Dispatch Forklift & Receiving Bay',
    shortLabel: 'Dispatch Bay',
    division: 'All',
    cameraPos: [6.8, 3.8, 9.5],
    lookAt: [0.5, 1.2, 4.8],
    colorHex: '#eab308'
  }
];

// Pre-allocated module-scope scratch vectors for 0 GC inside requestAnimationFrame
const _camTargetPos = new THREE.Vector3(0, 11.5, 16.5);
const _controlsTargetPos = new THREE.Vector3(0, 1.6, 0);
const _tempMatrix = new THREE.Matrix4();
const _tempVec3 = new THREE.Vector3();

// Procedural CanvasTexture generator for warehouse floor grid & safety lane markings
function createWarehouseFloorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark industrial sealed epoxy concrete base
  ctx.fillStyle = '#141c2b';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle concrete tile joints
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  const step = 64;
  for (let i = 0; i <= 1024; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Safety yellow perimeter & forklift aisle stripes
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(48, 48, 928, 928);

  // Main horizontal dispatch corridor lane
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
  ctx.setLineDash([24, 16]);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(64, 650);
  ctx.lineTo(960, 650);
  ctx.stroke();
  ctx.setLineDash([]);

  // Zebra hazard strip along front loading zone
  ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
  for (let x = 120; x < 900; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 665);
    ctx.lineTo(x + 24, 665);
    ctx.lineTo(x + 12, 700);
    ctx.lineTo(x - 12, 700);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural CanvasTexture for soft radial contact shadow
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural CanvasTexture for Rack Zone Header Signboard
function createZoneBannerTexture(
  code: string,
  title: string,
  accentHex: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, 18, 128);
  ctx.fillRect(0, 118, 512, 10);

  ctx.fillStyle = accentHex;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(code, 34, 48);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(title, 34, 92);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

// Procedural CanvasTexture for individual Stock Item SKU Shelf Tag
function createItemLabelTexture(
  item: StockItem,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  const isLow = item.quantityInStock <= item.minReorderLevel;

  ctx.fillStyle = isLow ? '#3b0a14' : '#0f172a';
  ctx.fillRect(0, 0, 512, 160);

  ctx.strokeStyle = isLow ? '#f43f5e' : '#38bdf8';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 506, 154);

  // Top badge row
  ctx.fillStyle = isLow ? '#f43f5e' : '#10b981';
  ctx.fillRect(16, 16, 165, 34);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(item.itemCode, 26, 40);

  // Quantity pill on right
  ctx.fillStyle = isLow ? '#fda4af' : '#6ee7b7';
  ctx.font = 'bold 26px monospace';
  const qtyText = `${item.quantityInStock} ${item.unit}`;
  ctx.fillText(qtyText, 315, 42);

  // Item short name
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 23px sans-serif';
  const shortName = item.name.length > 32 ? item.name.slice(0, 30) + '…' : item.name;
  ctx.fillText(shortName, 18, 92);

  // Storage location & status
  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px monospace';
  ctx.fillText(item.storageLocation, 18, 132);

  if (isLow) {
    ctx.fillStyle = '#fb7185';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText('LOW STOCK', 375, 132);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

// Build a composite 9-part industrial pallet rack bay (grounded at y = 0)
function buildIndustrialRackBay(
  zoneCode: string,
  zoneTitle: string,
  accentHex: string,
  maxAnisotropy: number,
  shadowTex: THREE.CanvasTexture
): THREE.Group {
  const rackGroup = new THREE.Group();

  // Contact shadow on floor
  const shadowGeo = new THREE.PlaneGeometry(4.2, 2.6);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.55
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.015;
  rackGroup.add(shadowMesh);

  // Materials with varied roughness & metalness (>= 0.25 difference)
  const uprightMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.78,
    roughness: 0.28
  });
  const beamMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentHex),
    metalness: 0.5,
    roughness: 0.55
  });
  const deckMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.65,
    roughness: 0.42
  });
  const footplateMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.22
  });

  const rackWidth = 3.4;
  const rackDepth = 1.5;
  const rackHeight = 4.2;
  const halfW = rackWidth / 2;
  const halfD = rackDepth / 2;

  // 1. Four vertical steel upright columns + grounded footplates
  const postGeo = new THREE.BoxGeometry(0.11, rackHeight, 0.11);
  const footGeo = new THREE.BoxGeometry(0.22, 0.04, 0.22);
  const postCorners = [
    [-halfW, -halfD],
    [halfW, -halfD],
    [-halfW, halfD],
    [halfW, halfD]
  ];

  postCorners.forEach(([px, pz]) => {
    const post = new THREE.Mesh(postGeo, uprightMat);
    post.position.set(px, rackHeight / 2, pz);
    post.castShadow = true;
    post.receiveShadow = true;
    rackGroup.add(post);

    const foot = new THREE.Mesh(footGeo, footplateMat);
    foot.position.set(px, 0.02, pz);
    rackGroup.add(foot);
  });

  // 2. Side cross-bracing struts
  const braceGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.65, 8);
  [-halfW, halfW].forEach(sideX => {
    for (let tier = 0; tier < 3; tier++) {
      const brace = new THREE.Mesh(braceGeo, uprightMat);
      brace.position.set(sideX, 0.8 + tier * 1.2, 0);
      brace.rotation.x = tier % 2 === 0 ? 0.65 : -0.65;
      rackGroup.add(brace);
    }
  });

  // 3. Three shelf levels (y = 0.35, 1.65, 2.95) with front/back beams + wire deck
  const shelfHeights = [0.35, 1.65, 2.95];
  const beamGeo = new THREE.BoxGeometry(rackWidth + 0.06, 0.12, 0.07);
  const deckGeo = new THREE.BoxGeometry(rackWidth - 0.12, 0.04, rackDepth - 0.1);

  shelfHeights.forEach(sy => {
    const frontBeam = new THREE.Mesh(beamGeo, beamMat);
    frontBeam.position.set(0, sy, halfD);
    frontBeam.castShadow = true;
    rackGroup.add(frontBeam);

    const backBeam = new THREE.Mesh(beamGeo, beamMat);
    backBeam.position.set(0, sy, -halfD);
    backBeam.castShadow = true;
    rackGroup.add(backBeam);

    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, sy + 0.04, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    rackGroup.add(deck);
  });

  // 4. Top header signboard with procedural CanvasTexture
  const signTex = createZoneBannerTexture(zoneCode, zoneTitle, accentHex, maxAnisotropy);
  const signGeo = new THREE.BoxGeometry(rackWidth, 0.62, 0.08);
  const signMaterials = [
    uprightMat,
    uprightMat,
    uprightMat,
    uprightMat,
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.35, metalness: 0.15 }),
    uprightMat
  ];
  const signMesh = new THREE.Mesh(signGeo, signMaterials);
  signMesh.position.set(0, rackHeight + 0.22, halfD - 0.05);
  rackGroup.add(signMesh);

  return rackGroup;
}

// Build a composite 3D representation of a specific StockItem (5–8 distinct parts per item)
function buildStockItemCompositeGroup(
  item: StockItem,
  maxAnisotropy: number,
  isSelected: boolean
): { group: THREE.Group; hitBox: THREE.Mesh; beaconMesh: THREE.Mesh } {
  const group = new THREE.Group();
  const isLow = item.quantityInStock <= item.minReorderLevel;

  // 1. Slatted wooden/composite pallet base (grounded at y = 0 of shelf)
  const palletMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.82,
    metalness: 0.05
  });
  const palletBaseGeo = new THREE.BoxGeometry(1.25, 0.07, 1.05);
  const palletBase = new THREE.Mesh(palletBaseGeo, palletMat);
  palletBase.position.y = 0.035;
  palletBase.castShadow = true;
  palletBase.receiveShadow = true;
  group.add(palletBase);

  // Fill ratio based on stock level (visualizes stock quantity in 3D!)
  const stockRatio = Math.max(0.25, Math.min(1.4, item.quantityInStock / Math.max(1, item.minReorderLevel * 1.5)));

  // 2. Division-specific multi-part 3D cargo geometry
  if (item.division === 'Security') {
    if (item.itemCode.includes('003') || item.name.toLowerCase().includes('radio')) {
      // Walkie-Talkie Radios in metallic charging dock + antennas
      const dockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 });
      const radioBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.55, roughness: 0.45 });
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
        roughness: 0.2
      });

      const cradle = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.65), dockMat);
      cradle.position.set(0, 0.13, 0);
      group.add(cradle);

      const radioCount = Math.min(6, Math.max(2, Math.ceil(item.quantityInStock / 3)));
      for (let i = 0; i < radioCount; i++) {
        const rx = -0.38 + (i % 3) * 0.38;
        const rz = i < 3 ? 0.14 : -0.16;
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.1), radioBodyMat);
        body.position.set(rx, 0.36, rz);
        body.castShadow = true;
        group.add(body);

        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.01), screenMat);
        screen.position.set(rx, 0.42, rz + 0.055);
        group.add(screen);

        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.26, 8), dockMat);
        antenna.position.set(rx + 0.05, 0.65, rz);
        group.add(antenna);
      }
    } else if (item.name.toLowerCase().includes('boot')) {
      // Heavy-duty Steel-Toe Boots boxes + sculpted boot display on top
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.65, metalness: 0.1 });
      const bootLeatherMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.42, metalness: 0.2 });
      const steelToeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.85 });

      for (let row = 0; row < 2; row++) {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.26 * stockRatio, 0.78), boxMat);
        crate.position.set(row === 0 ? -0.28 : 0.28, 0.07 + (0.26 * stockRatio) / 2, 0);
        crate.castShadow = true;
        group.add(crate);
      }

      // Sculpted demo boot on top
      const topY = 0.07 + 0.26 * stockRatio;
      const bootShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.28, 12), bootLeatherMat);
      bootShaft.position.set(0, topY + 0.14, -0.05);
      group.add(bootShaft);

      const bootFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.34), bootLeatherMat);
      bootFoot.position.set(0, topY + 0.06, 0.04);
      group.add(bootFoot);

      const steelCap = new THREE.Mesh(new THREE.SphereGeometry(0.092, 12, 8), steelToeMat);
      steelCap.scale.set(1, 0.65, 1);
      steelCap.position.set(0, topY + 0.06, 0.19);
      group.add(steelCap);
    } else {
      // Tactical Security Uniform Folded Stacks + Straps
      const fabricMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.78, metalness: 0.05 });
      const badgeGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 });

      for (let s = 0; s < 3; s++) {
        const stackH = (0.16 + s * 0.04) * stockRatio;
        const bundle = new THREE.Mesh(new THREE.BoxGeometry(0.34, stackH, 0.76), fabricMat);
        bundle.position.set(-0.36 + s * 0.36, 0.07 + stackH / 2, 0);
        bundle.castShadow = true;
        group.add(bundle);

        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.36, stackH + 0.01, 0.08), badgeGoldMat);
        strap.position.set(-0.36 + s * 0.36, 0.07 + stackH / 2, 0);
        group.add(strap);
      }
    }
  } else if (item.division === 'Cleaning') {
    if (item.name.toLowerCase().includes('trolley') || item.name.toLowerCase().includes('mop')) {
      // Commercial Dual-Bucket Wringer Mop Trolley
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25 });
      const blueBucketMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.15 });
      const redBucketMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35, metalness: 0.15 });

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 0.58), frameMat);
      chassis.position.set(0, 0.15, 0);
      group.add(chassis);

      const blueBucket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.42, 16), blueBucketMat);
      blueBucket.position.set(-0.22, 0.38, 0);
      blueBucket.castShadow = true;
      group.add(blueBucket);

      const redBucket = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.42, 16), redBucketMat);
      redBucket.position.set(0.24, 0.38, 0);
      redBucket.castShadow = true;
      group.add(redBucket);

      const handlePole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.78, 8), frameMat);
      handlePole.position.set(-0.22, 0.62, 0);
      handlePole.rotation.z = -0.15;
      group.add(handlePole);
    } else {
      // 5L Chemical Jerrycans / Cleaning Supplies on containment tray
      const trayMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.45, metalness: 0.2 });
      const bottleMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.28, metalness: 0.1 });
      const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.05 });

      const tray = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.08, 0.88), trayMat);
      tray.position.set(0, 0.11, 0);
      group.add(tray);

      for (let gx = -1; gx <= 1; gx++) {
        for (let gz = -1; gz <= 0; gz++) {
          const jCan = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.42, 0.28), bottleMat);
          jCan.position.set(gx * 0.32, 0.35, gz * 0.34 + 0.16);
          jCan.castShadow = true;
          group.add(jCan);

          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.07, 10), capMat);
          cap.position.set(gx * 0.32, 0.58, gz * 0.34 + 0.16);
          group.add(cap);
        }
      }
    }
  } else if (item.division === 'Property Management') {
    // Red Cantilevered Steel Toolboxes & Electrical LED Cartons
    const toolRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.65, roughness: 0.32 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.15 });
    const cartonMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.75, metalness: 0.08 });

    if (item.name.toLowerCase().includes('toolbox')) {
      for (let t = 0; t < 2; t++) {
        const tx = t === 0 ? -0.28 : 0.28;
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.68), toolRedMat);
        box.position.set(tx, 0.24, 0);
        box.castShadow = true;
        group.add(box);

        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 8), chromeMat);
        handle.rotation.x = Math.PI / 2;
        handle.position.set(tx, 0.45, 0);
        group.add(handle);
      }
    } else {
      const boxH = 0.48 * stockRatio;
      const ledCrate = new THREE.Mesh(new THREE.BoxGeometry(0.96, boxH, 0.78), cartonMat);
      ledCrate.position.set(0, 0.07 + boxH / 2, 0);
      ledCrate.castShadow = true;
      group.add(ledCrate);

      const ledFrame = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.05, 0.65), chromeMat);
      ledFrame.position.set(0, 0.09 + boxH, 0);
      group.add(ledFrame);
    }
  } else {
    // Head Office Staff: Wrapped A4 Paper Ream Stacks & Laser Toner Cartridges
    const reamMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.05 });
    const wrapperBandMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.4, metalness: 0.2 });
    const tonerMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.35, metalness: 0.45 });

    const isToner = item.name.toLowerCase().includes('toner');
    for (let c = 0; c < 2; c++) {
      const cx = c === 0 ? -0.28 : 0.28;
      const stackH = (isToner ? 0.32 : 0.46) * stockRatio;
      const stack = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, stackH, 0.66),
        isToner ? tonerMat : reamMat
      );
      stack.position.set(cx, 0.07 + stackH / 2, 0);
      stack.castShadow = true;
      group.add(stack);

      const band = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.67), wrapperBandMat);
      band.position.set(cx, 0.07 + stackH * 0.5, 0);
      group.add(band);
    }
  }

  // 3. Front-facing SKU Label Plate (procedural CanvasTexture)
  const labelTex = createItemLabelTexture(item, maxAnisotropy);
  const labelGeo = new THREE.PlaneGeometry(1.18, 0.36);
  const labelMat = new THREE.MeshBasicMaterial({
    map: labelTex,
    side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.set(0, 0.86, 0.68);
  labelMesh.rotation.x = -0.14;
  group.add(labelMesh);

  // 4. Status indicator beacon post (Emerald for healthy, Rose for Low Stock, Amber ring when selected)
  const beaconColor = isSelected ? 0xfbbf24 : isLow ? 0xf43f5e : 0x10b981;
  const beaconMat = new THREE.MeshStandardMaterial({
    color: beaconColor,
    emissive: beaconColor,
    emissiveIntensity: isSelected ? 0.9 : isLow ? 0.75 : 0.35,
    roughness: 0.2,
    metalness: 0.3
  });
  const beaconMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12), beaconMat);
  beaconMesh.position.set(0.52, 0.86, 0.55);
  group.add(beaconMesh);

  // 5. Invisible simplified collision proxy box on Layer 1 for fast raycasting
  const hitBoxGeo = new THREE.BoxGeometry(1.4, 1.15, 1.25);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.position.set(0, 0.55, 0);
  hitBox.layers.enable(1);
  hitBox.userData = { stockItemId: item.id };
  group.add(hitBox);

  return { group, hitBox, beaconMesh };
}

// Build a composite 9-part industrial electric forklift in the receiving aisle (grounded at y = 0)
function buildWarehouseForklift(shadowTex: THREE.CanvasTexture): THREE.Group {
  const forklift = new THREE.Group();

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.2),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  forklift.add(shadow);

  const bodyAmberMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.45,
    roughness: 0.32
  });
  const counterweightMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.75,
    roughness: 0.4
  });
  const steelMastMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.22
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.9,
    metalness: 0.05
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.8,
    roughness: 0.25
  });

  // 1. Main chassis body
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.72, 1.15), bodyAmberMat);
  chassis.position.set(0, 0.56, 0);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  forklift.add(chassis);

  // 2. Rear cast-iron counterweight
  const rearWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.58, 0.76, 16), counterweightMat);
  rearWeight.position.set(-0.68, 0.58, 0);
  rearWeight.castShadow = true;
  forklift.add(rearWeight);

  // 3. Four industrial tires + metallic wheel hubs (grounded at y = 0.26)
  const wheelPositions: [number, number][] = [
    [0.58, 0.58],
    [0.58, -0.58],
    [-0.62, 0.58],
    [-0.62, -0.58]
  ];
  wheelPositions.forEach(([wx, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 16), tireMat);
    tire.rotation.x = Math.PI / 2;
    tire.position.set(wx, 0.26, wz);
    tire.castShadow = true;
    forklift.add(tire);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.24, 12), rimMat);
    hub.rotation.x = Math.PI / 2;
    hub.position.set(wx, 0.26, wz);
    forklift.add(hub);
  });

  // 4. Operator overhead roll-cage (4 pillars + roof guard)
  const cagePostGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.15, 8);
  [
    [0.35, 0.48],
    [0.35, -0.48],
    [-0.45, 0.48],
    [-0.45, -0.48]
  ].forEach(([cx, cz]) => {
    const post = new THREE.Mesh(cagePostGeo, steelMastMat);
    post.position.set(cx, 1.48, cz);
    forklift.add(post);
  });

  const cageRoof = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 1.06), steelMastMat);
  cageRoof.position.set(-0.05, 2.06, 0);
  cageRoof.castShadow = true;
  forklift.add(cageRoof);

  // 5. Dual vertical hydraulic mast rails + forks
  [-0.32, 0.32].forEach(fz => {
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.35, 0.1), steelMastMat);
    mast.position.set(0.96, 1.28, fz);
    mast.castShadow = true;
    forklift.add(mast);

    const forkTine = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.05, 0.12), rimMat);
    forkTine.position.set(1.48, 0.22, fz);
    forkTine.castShadow = true;
    forklift.add(forkTine);
  });

  // 6. Roof amber safety strobe beacon
  const strobe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.14, 12),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
      roughness: 0.2
    })
  );
  strobe.position.set(-0.35, 2.16, 0);
  forklift.add(strobe);

  return forklift;
}

export const Warehouse3DView: React.FC<Warehouse3DViewProps> = ({
  stockItems,
  selectedDivision,
  canVerifyInventory,
  canManageCatalogAndRestock,
  onQuickTransaction,
  onSelectDivision
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [selectedItemId, setSelectedItemId] = useState<string>(stockItems[0]?.id || '');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string>('overview');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [showLowStockBeaconsOnly, setShowLowStockBeaconsOnly] = useState<boolean>(false);

  // Mutable refs for the WebGL loop so React state changes never destroy or recreate the scene
  const stockItemsRef = useRef<StockItem[]>(stockItems);
  stockItemsRef.current = stockItems;

  const selectedItemIdRef = useRef<string>(selectedItemId);
  selectedItemIdRef.current = selectedItemId;

  const isCameraAnimatingRef = useRef<boolean>(false);
  const itemGroupsGroupRef = useRef<THREE.Group | null>(null);
  const hitBoxesRef = useRef<THREE.Object3D[]>([]);
  const itemCoordinatesMapRef = useRef<Map<string, { pos: THREE.Vector3; camPos: THREE.Vector3 }>>(new Map());
  const maxAnisotropyRef = useRef<number>(4);

  const selectedItem = stockItems.find(i => i.id === selectedItemId) || stockItems[0];
  const hoveredItem = hoveredItemId ? stockItems.find(i => i.id === hoveredItemId) : null;
  const lowStockCount = stockItems.filter(i => i.quantityInStock <= i.minReorderLevel).length;

  // Move camera target smoothly to a zone preset
  const flyToZone = useCallback((zone: WarehouseZonePreset) => {
    setActiveZoneId(zone.id);
    _camTargetPos.set(...zone.cameraPos);
    _controlsTargetPos.set(...zone.lookAt);
    isCameraAnimatingRef.current = true;
    if (onSelectDivision && zone.id !== 'dock') {
      onSelectDivision(zone.division);
    }
  }, [onSelectDivision]);

  // Move camera smoothly to focus on a specific 3D stock item on its rack shelf
  const focusOnStockItem3D = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    const coords = itemCoordinatesMapRef.current.get(itemId);
    if (coords) {
      _controlsTargetPos.copy(coords.pos);
      _camTargetPos.copy(coords.camPos);
      isCameraAnimatingRef.current = true;
    }
  }, []);

  // Sync division filter from parent to 3D zone camera
  useEffect(() => {
    if (selectedDivision === 'All') {
      const z = WAREHOUSE_ZONES[0];
      _camTargetPos.set(...z.cameraPos);
      _controlsTargetPos.set(...z.lookAt);
      setActiveZoneId('overview');
      isCameraAnimatingRef.current = true;
    } else {
      const matchingZone = WAREHOUSE_ZONES.find(z => z.division === selectedDivision);
      if (matchingZone) {
        _camTargetPos.set(...matchingZone.cameraPos);
        _controlsTargetPos.set(...matchingZone.lookAt);
        setActiveZoneId(matchingZone.id);
        isCameraAnimatingRef.current = true;
      }
    }
  }, [selectedDivision]);

  // Rebuild the shelf cargo meshes whenever stockItems quantities/items or selection change
  const rebuildShelfCargoMeshes = useCallback(() => {
    const cargoContainer = itemGroupsGroupRef.current;
    if (!cargoContainer) return;

    // Dispose old geometries & textures in cargoContainer
    cargoContainer.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
    cargoContainer.clear();
    hitBoxesRef.current = [];
    itemCoordinatesMapRef.current.clear();

    // Map each division to its physical warehouse rack X coordinate
    const rackXByDivision: Record<ServiceType, number> = {
      'Security': -6.5,
      'Cleaning': -1.8,
      'Property Management': 2.8,
      'Head Office Staff': 7.2
    };

    const shelfHeights = [0.41, 1.71, 3.01];
    const slotCountsByDiv: Record<ServiceType, number> = {
      'Security': 0,
      'Cleaning': 0,
      'Property Management': 0,
      'Head Office Staff': 0
    };

    stockItemsRef.current.forEach(item => {
      if (showLowStockBeaconsOnly && item.quantityInStock > item.minReorderLevel) {
        return;
      }

      const div = item.division;
      const idx = slotCountsByDiv[div] || 0;
      slotCountsByDiv[div] = idx + 1;

      const rackX = rackXByDivision[div] ?? 0;
      const shelfLevel = Math.min(2, Math.floor(idx / 2));
      const sideOffset = idx % 2 === 0 ? -0.78 : 0.78;

      const worldX = rackX + sideOffset;
      const worldY = shelfHeights[shelfLevel];
      const worldZ = -1.8;

      const isSelected = item.id === selectedItemIdRef.current;
      const { group, hitBox } = buildStockItemCompositeGroup(
        item,
        maxAnisotropyRef.current,
        isSelected
      );

      group.position.set(worldX, worldY, worldZ);
      cargoContainer.add(group);
      hitBoxesRef.current.push(hitBox);

      itemCoordinatesMapRef.current.set(item.id, {
        pos: new THREE.Vector3(worldX, worldY + 0.45, worldZ),
        camPos: new THREE.Vector3(worldX, worldY + 1.55, worldZ + 4.4)
      });
    });
  }, [showLowStockBeaconsOnly]);

  // Trigger cargo update when stockItems or selectedItemId changes
  useEffect(() => {
    rebuildShelfCargoMeshes();
  }, [stockItems, selectedItemId, showLowStockBeaconsOnly, rebuildShelfCargoMeshes]);

  // Keyboard shortcut 'H' to collapse/expand bottom HUD and 'F' for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'h') {
        setIsHudCollapsed(prev => !prev);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Main Three.js WebGL initialization (runs once on mount)
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    const bgHex = 0x0b1120;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.018);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 11.5, 16.5);

    // 3. Renderer (Three.js r160+ PBR & Color Pipeline)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    maxAnisotropyRef.current = maxAnisotropy;

    // 4. Studio Environment Map (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 5. Studio 3-Point Lighting Rig (Warm Key + Cool Hemisphere Fill + Rim)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.65);
    hemiLight.position.set(0, 18, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    keyLight.position.set(10, 16, 12);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 45;
    const d = 14;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-12, 10, -10);
    scene.add(rimLight);

    // 6. Epoxy Warehouse Floor with procedural safety lanes
    const floorTex = createWarehouseFloorTexture(maxAnisotropy);
    const floorGeo = new THREE.PlaneGeometry(36, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.55,
      metalness: 0.15
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const contactShadowTex = createContactShadowTexture();

    // 7. Build the 4 Heavy-Duty Industrial Rack Bays (Zones A/B, C, D, E)
    const rackDefinitions = [
      { x: -6.5, code: 'BAY A & B', title: 'SECURITY GEAR', hex: '#3b82f6' },
      { x: -1.8, code: 'BAY C', title: 'CLEANING STORE', hex: '#10b981' },
      { x: 2.8, code: 'BAY D', title: 'PROPERTY TOOLS', hex: '#f59e0b' },
      { x: 7.2, code: 'BAY E', title: 'HQ STATIONERY', hex: '#a855f7' }
    ];

    rackDefinitions.forEach(r => {
      const rackBay = buildIndustrialRackBay(
        r.code,
        r.title,
        r.hex,
        maxAnisotropy,
        contactShadowTex
      );
      rackBay.position.set(r.x, 0, -1.8);
      scene.add(rackBay);
    });

    // 8. Build Industrial Electric Forklift in Front Dispatch Lane
    const forklift = buildWarehouseForklift(contactShadowTex);
    forklift.position.set(1.2, 0, 4.2);
    forklift.rotation.y = -0.35;
    scene.add(forklift);

    // 9. Build Storekeeper Inspection Desk & Dispatch Scale on Left Front
    const deskGroup = new THREE.Group();
    const deskShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.8),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.5
      })
    );
    deskShadow.rotation.x = -Math.PI / 2;
    deskShadow.position.y = 0.015;
    deskGroup.add(deskShadow);

    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.08, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.5 })
    );
    deskTop.position.y = 0.78;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.42, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.2
      })
    );
    monitor.position.set(0, 1.08, -0.25);
    deskGroup.add(monitor);
    deskGroup.position.set(-5.8, 0, 4.2);
    deskGroup.rotation.y = 0.25;
    scene.add(deskGroup);

    // 10. InstancedMesh for 24 Overhead High-Bay Industrial LED Trusses & Floor Safety Bollards
    const bollardGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.9, 12);
    const bollardMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.35
    });
    const bollardCount = 24;
    const bollardInstanced = new THREE.InstancedMesh(bollardGeo, bollardMat, bollardCount);
    bollardInstanced.castShadow = true;

    let bIdx = 0;
    rackDefinitions.forEach(r => {
      [
        [-1.85, -0.4],
        [1.85, -0.4],
        [-1.85, -3.1],
        [1.85, -3.1],
        [-1.85, 0.8],
        [1.85, 0.8]
      ].forEach(([ox, oz]) => {
        if (bIdx < bollardCount) {
          _tempMatrix.makeTranslation(r.x + ox, 0.45, oz);
          bollardInstanced.setMatrixAt(bIdx, _tempMatrix);
          bIdx++;
        }
      });
    });
    bollardInstanced.instanceMatrix.needsUpdate = true;
    bollardInstanced.computeBoundingSphere();
    scene.add(bollardInstanced);

    // 11. Dedicated Group for Dynamic Stock Items on Racks
    const cargoContainer = new THREE.Group();
    scene.add(cargoContainer);
    itemGroupsGroupRef.current = cargoContainer;
    rebuildShelfCargoMeshes();

    // 12. OrbitControls with smooth exponential damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 2.5;
    controls.maxDistance = 28;
    controls.target.set(0, 1.6, 0);

    const stopCamAnim = () => {
      isCameraAnimatingRef.current = false;
    };
    renderer.domElement.addEventListener('pointerdown', stopCamAnim);
    renderer.domElement.addEventListener('wheel', stopCamAnim);

    // 13. Raycasting on Layer 1 for interactive hover & click selection
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let lastRaycastTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 40) return; // Throttle to 25Hz
      lastRaycastTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitBoxesRef.current, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.stockItemId;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredItemId(hitId || null);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredItemId(null);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitBoxesRef.current, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.stockItemId;
        if (hitId) {
          focusOnStockItem3D(hitId);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // Pre-compile shaders once before starting loop
    renderer.compile(scene, camera);

    // 14. ResizeObserver for responsive / fullscreen transitions
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 15. Animation Loop with THREE.Clock and exponential camera damping
    const clock = new THREE.Clock();
    let animFrameId = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      if (isCameraAnimatingRef.current) {
        const alpha = 1 - Math.exp(-5.5 * dt);
        camera.position.lerp(_camTargetPos, alpha);
        controls.target.lerp(_controlsTargetPos, alpha);
        if (
          camera.position.distanceToSquared(_camTargetPos) < 0.002 &&
          controls.target.distanceToSquared(_controlsTargetPos) < 0.002
        ) {
          isCameraAnimatingRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', stopCamAnim);
      renderer.domElement.removeEventListener('wheel', stopCamAnim);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      envTexture.dispose();
      floorTex.dispose();
      contactShadowTex.dispose();
      renderer.dispose();
    };
  }, [focusOnStockItem3D, rebuildShelfCargoMeshes]);

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen bg-slate-950 overflow-hidden'
          : 'relative w-full h-[640px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl'
      }
    >
      {/* Dedicated Isolated WebGL Canvas Mount Container */}
      <div ref={canvasMountRef} className="w-full h-full" />

      {/* Top-Left Minimal Spec & Warehouse Telemetry Badge (Solid surface, no backdrop-filter) */}
      <div className="absolute top-4 left-4 pointer-events-auto flex flex-wrap items-center gap-2 bg-slate-900/95 border border-slate-700/90 rounded-xl px-3.5 py-2 shadow-lg text-xs text-slate-200">
        <div className="flex items-center gap-2 pr-2.5 border-r border-slate-700">
          <Box className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-white tracking-tight">HAB 3D Physical Warehouse</span>
            <span className="hidden sm:inline text-slate-400 ml-1.5 font-mono text-[11px]">
              · 4 Divisions · {stockItems.length} Active SKUs
            </span>
          </div>
        </div>

        {/* Low Stock Alert Toggle Pill */}
        <button
          type="button"
          onClick={() => setShowLowStockBeaconsOnly(prev => !prev)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
            showLowStockBeaconsOnly
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{lowStockCount} Low Stock {showLowStockBeaconsOnly ? '(Filtered)' : 'Alerts'}</span>
        </button>

        {hoveredItem && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-amber-500/40 text-amber-200 text-[11px] font-mono">
            <span>Inspecting:</span>
            <strong className="text-white">{hoveredItem.itemCode}</strong>
            <span>({hoveredItem.quantityInStock} {hoveredItem.unit})</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsFullscreen(prev => !prev)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
          title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen 100vw x 100vh'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}</span>
        </button>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter, <= 15% Viewport Footprint) */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[940px] pointer-events-auto transition-transform duration-300"
        style={{
          transform: isHudCollapsed
            ? 'translate(-50%, calc(100% - 34px))'
            : 'translate(-50%, 0)'
        }}
      >
        {/* Collapse / Expand Zen Mode Toggle Tab */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsHudCollapsed(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-t-lg bg-slate-900/95 border border-b-0 border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {isHudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Show Warehouse Controls & Rack Inspector (H)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Hide Controls · Zen Mode (H)</span>
              </>
            )}
          </button>
        </div>

        {/* Main Bottom Dock Surface (Solid rgba surface, no backdrop-filter over WebGL) */}
        <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-3.5 shadow-2xl space-y-3 text-xs text-slate-200">
          {/* Top Row: Camera Zone Presets + Rack Slot Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Bays:</span>
              </span>
              {WAREHOUSE_ZONES.map(zone => {
                const isActive = activeZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => flyToZone(zone)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {zone.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Direct Shelf SKU Selector Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <select
                aria-label="Jump camera to specific stock item shelf"
                value={selectedItem?.id || ''}
                onChange={e => focusOnStockItem3D(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-100 text-[11px] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 max-w-[260px]"
              >
                {stockItems.map(item => (
                  <option key={item.id} value={item.id}>
                    [{item.itemCode}] {item.name.slice(0, 28)} ({item.quantityInStock} {item.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom Row: Selected 3D Rack Slot Live Inspector & 1-Click Stock Manager Actions */}
          {selectedItem && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    selectedItem.quantityInStock <= selectedItem.minReorderLevel
                      ? 'bg-rose-950/90 border-rose-700 text-rose-300'
                      : 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                  }`}
                >
                  <Package className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      {selectedItem.itemCode}
                    </span>
                    <span className="font-bold text-white text-sm truncate">
                      {selectedItem.name}
                    </span>
                    {selectedItem.amharicName && (
                      <span className="text-slate-400 text-xs">
                        ({selectedItem.amharicName})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-0.5">
                    <span>
                      Rack Slot: <strong className="text-slate-200 font-mono">{selectedItem.storageLocation}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Division: <strong className="text-slate-200">{selectedItem.division}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      On Shelf:{' '}
                      <strong
                        className={`font-mono ${
                          selectedItem.quantityInStock <= selectedItem.minReorderLevel
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {selectedItem.quantityInStock} {selectedItem.unit}
                      </strong>{' '}
                      (Min: {selectedItem.minReorderLevel})
                    </span>
                    <span>·</span>
                    <span>
                      Unit Cost: <strong className="text-slate-200 font-mono">ETB {selectedItem.unitCostETB.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Stock Manager Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => focusOnStockItem3D(selectedItem.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Focus Shelf</span>
                </button>

                {canVerifyInventory && (
                  <>
                    <button
                      type="button"
                      onClick={() => onQuickTransaction(selectedItem, 'Issued (Out)')}
                      disabled={selectedItem.quantityInStock <= 0}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-[11px] transition-colors shadow-xs"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Issue from Shelf</span>
                    </button>

                    {canManageCatalogAndRestock && (
                      <button
                        type="button"
                        onClick={() => onQuickTransaction(selectedItem, 'Received (Restock)')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-xs"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Restock Rack</span>
                      </button>
                    )}

                    {selectedItem.isReturnable && (
                      <button
                        type="button"
                        onClick={() => onQuickTransaction(selectedItem, 'Returned (In)')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return Gear</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
