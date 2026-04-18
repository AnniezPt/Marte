import * as THREE from 'three';

// --- SISTEMA DE AUDIO GENERATIVO (Web Audio API) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const sfx = {
    shoot: () => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    },
    empty: () => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    },
    hit: () => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    },
    monsterGrowl: () => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(40 + Math.random()*20, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(20, audioCtx.currentTime + 1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 1);
    },
    itemPickup: () => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.setValueAtTime(900, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    },
    click: () => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }
};

// --- GENERADOR DE TEXTURAS PROCEDIMENTALES ---
function createNoiseTexture(color1, color2, isMetal) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 256, 256);
    for(let i=0; i<8000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? color2 : 'rgba(0,0,0,0.2)';
        ctx.fillRect(Math.random()*256, Math.random()*256, 2, 2);
    }
    if(isMetal) {
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 128); ctx.lineTo(256, 128);
        ctx.moveTo(128, 0); ctx.lineTo(128, 256);
        ctx.stroke();
        for(let i=0; i<20; i++) {
            ctx.fillStyle = 'rgba(100, 30, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(Math.random()*256, Math.random()*256, Math.random()*20, 0, Math.PI*2);
            ctx.fill();
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

const wallTex = createNoiseTexture('#4a4a4a', '#3a3a3a', true);
const floorTex = createNoiseTexture('#353535', '#252525', true);
const ceilingTex = createNoiseTexture('#2a2a2a', '#1a1a1a', false);
const fleshTex = createNoiseTexture('#6a1a1a', '#330000', false);

// --- TEXTURAS AVANZADAS PARA EL TÓTEM ---
function createAdvancedFlesh() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#3a0a0a'; ctx.fillRect(0,0,512,512);
    for(let i=0; i<20000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#551111' : '#1a0000';
        ctx.fillRect(Math.random()*512, Math.random()*512, 3, 3);
    }
    ctx.lineWidth = 2;
    for(let i=0; i<50; i++) {
        ctx.strokeStyle = Math.random() > 0.5 ? '#110000' : '#440000';
        ctx.beginPath();
        ctx.moveTo(Math.random()*512, Math.random()*512);
        ctx.bezierCurveTo(Math.random()*512, Math.random()*512, Math.random()*512, Math.random()*512, Math.random()*512, Math.random()*512);
        ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createGlobeTex() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a2a4a'; ctx.fillRect(0,0,256,256);
    for(let i=0; i<30; i++) {
        ctx.fillStyle = '#2a4a1a';
        ctx.beginPath();
        ctx.arc(Math.random()*256, Math.random()*256, 10+Math.random()*30, 0, Math.PI*2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

const advFleshTex = createAdvancedFlesh();
const globeTex = createGlobeTex();

// --- ESTADO DEL JUEGO ---
const gameState = {
    isRunning: false,
    inDialogue: false,
    char: null,
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    sanity: 100,
    ammo: 0,
    inventory: { meds: 0, batteries: 0 },
    sanityDrainRate: 1.0,
    mapKeys: 0,
    flashlightOn: true
};

// --- CONFIGURACIÓN THREE.JS ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.FogExp2(0x221111, 0.008); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('game-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x888888, 1.8);
scene.add(ambientLight);

const flashLight = new THREE.SpotLight(0xfff5e6, 8.0);
flashLight.angle = Math.PI / 2.0;
flashLight.penumbra = 0.5;
flashLight.distance = 80;
flashLight.castShadow = true;
flashLight.shadow.mapSize.width = 512;
flashLight.shadow.mapSize.height = 512;
camera.add(flashLight);
flashLight.position.set(0, 0, 1);
flashLight.target.position.set(0, 0, -1);
camera.add(flashLight.target);
scene.add(camera);

// --- LINTERNA EN MANO ---
const flashlightGroup = new THREE.Group();
const flBodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.5 });
const flBody = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 16), flBodyMat);
flBody.rotation.x = Math.PI / 2;

const flHeadMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.8 });
const flHead = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.1, 16), flHeadMat);
flHead.rotation.x = Math.PI / 2;
flHead.position.z = -0.15;

const flLensMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xfff5e6, emissiveIntensity: 2.0 });
const flLens = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16), flLensMat);
flLens.rotation.x = Math.PI / 2;
flLens.position.z = -0.20;

flashlightGroup.add(flBody);
flashlightGroup.add(flHead);
flashlightGroup.add(flLens);
flashlightGroup.position.set(-0.35, -0.3, -0.5); 
camera.add(flashlightGroup);

// --- ARMA DEL JUGADOR ---
const weaponGroup = new THREE.Group();
const gunMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), gunMat);
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0, 0, -0.2);
const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.3), gunMat);
body.position.set(0, -0.05, -0.05);
weaponGroup.add(barrel);
weaponGroup.add(body);
weaponGroup.position.set(0.3, -0.3, -0.5);
camera.add(weaponGroup);

const muzzleFlash = new THREE.PointLight(0xffaa00, 0, 5);
muzzleFlash.position.set(0, 0, -0.5);
weaponGroup.add(muzzleFlash);

// --- MAPA Y ENTORNOS ---
const tileSize = 4;
const wallHeight = 4;
const mapLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,8,0,1,0,0,0,0,0,1,5,0,0,1],
    [1,4,0,3,1,0,1,1,1,0,1,1,1,0,1],
    [1,1,0,1,1,0,1,3,1,0,0,0,0,0,1],
    [1,1,0,0,1,1,1,0,1,1,1,1,1,2,1],
    [1,4,0,0,0,0,0,0,0,0,0,0,1,0,1], 
    [1,1,1,1,1,2,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,1,4,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,1,1], 
    [1,1,1,0,1,1,1,1,1,1,1,0,1,7,1],
    [1,5,0,0,0,0,0,0,2,0,0,0,0,0,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const walls = [];
const interactables = [];
const enemies = [];
const lights = [];

const matWall = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9, metalness: 0.1 });
const matFloor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 });
const matCeil = new THREE.MeshStandardMaterial({ map: ceilingTex, roughness: 1.0 });

const interactGeo = new THREE.BoxGeometry(1, 1, 1);
const matMeds = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
const matAmmo = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 1 });

const enemyGeo = new THREE.SphereGeometry(1, 8, 8);
const enemyMat = new THREE.MeshStandardMaterial({ map: fleshTex, roughness: 1, transparent: true, opacity: 0.9 });

function buildLevel() {
    scene.children.slice().forEach(c => {
        if(c.isMesh && c !== weaponGroup && c.parent !== weaponGroup) scene.remove(c);
    });
    walls.length = 0; interactables.length = 0; enemies.length = 0;

    const floorGeo = new THREE.PlaneGeometry(mapLayout[0].length * tileSize, mapLayout.length * tileSize);
    const floor = new THREE.Mesh(floorGeo, matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((mapLayout[0].length*tileSize)/2 - tileSize/2, 0, (mapLayout.length*tileSize)/2 - tileSize/2);
    scene.add(floor);

    const ceil = new THREE.Mesh(floorGeo, matCeil);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(floor.position.x, wallHeight, floor.position.z);
    scene.add(ceil);

    for(let z=0; z<mapLayout.length; z++) {
        for(let x=0; x<mapLayout[z].length; x++) {
            const type = mapLayout[z][x];
            const px = x * tileSize;
            const pz = z * tileSize;

            if(type === 1) {
                const wall = new THREE.Mesh(new THREE.BoxGeometry(tileSize, wallHeight, tileSize), matWall);
                wall.position.set(px, wallHeight/2, pz);
                wall.castShadow = true;
                wall.receiveShadow = true;
                scene.add(wall);
                walls.push(wall);
            } else if(type === 2) {
                const light = new THREE.PointLight(0xff0000, 1, 15);
                light.position.set(px, wallHeight - 0.5, pz);
                light.castShadow = true;
                scene.add(light);
                lights.push({obj: light, baseInt: 1, flicker: true});
                const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), new THREE.MeshBasicMaterial({color:0xff0000}));
                fixture.position.copy(light.position);
                scene.add(fixture);
            } else if(type === 3) {
                const m = new THREE.Mesh(interactGeo, matMeds);
                m.position.set(px, 0.5, pz);
                scene.add(m);
                interactables.push({ mesh: m, type: 'meds' });
            } else if(type === 4) {
                const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), matAmmo);
                m.position.set(px, 0.2, pz);
                scene.add(m);
                interactables.push({ mesh: m, type: 'ammo' });
            } else if(type === 5) {
                const totemGroup = new THREE.Group();
                totemGroup.position.set(px, 0, pz);
                
                const tMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.7 });
                const tRustMat = new THREE.MeshStandardMaterial({ color: 0x5a3a2a, metalness: 0.6, roughness: 0.9 });
                const tFleshMat = new THREE.MeshStandardMaterial({ map: advFleshTex, roughness: 0.5 });
                const tBoneMat = new THREE.MeshStandardMaterial({ color: 0xaaaa99, roughness: 0.9 });
                const tEyeMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff0000, emissiveIntensity: 8 });
                const tGlobeMat = new THREE.MeshStandardMaterial({ map: globeTex, roughness: 0.3, metalness: 0.2 });

                const base1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), tMetalMat);
                base1.position.y = 0.2;
                totemGroup.add(base1);
                const base2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), tRustMat);
                base2.position.y = 0.6;
                base2.rotation.y = Math.PI / 8;
                totemGroup.add(base2);

                for(let i=0; i<3; i++) {
                    const angle = (i / 3) * Math.PI * 2 + Math.PI/6;
                    const bodyGroup = new THREE.Group();
                    
                    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.5, 4, 8), tFleshMat);
                    torso.position.y = 0.4;
                    torso.rotation.x = Math.PI / 6;
                    bodyGroup.add(torso);
                    
                    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), tFleshMat);
                    head.position.set(0, 0.8, 0.1);
                    head.rotation.x = -Math.PI / 4;
                    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.1), new THREE.MeshBasicMaterial({color: 0x000000}));
                    mouth.position.set(0, -0.05, 0.12);
                    head.add(mouth);
                    bodyGroup.add(head);

                    const armGeo = new THREE.CapsuleGeometry(0.06, 0.4, 4, 8);
                    const armL = new THREE.Mesh(armGeo, tFleshMat);
                    armL.position.set(-0.2, 0.3, -0.1); armL.rotation.z = -Math.PI/4; armL.rotation.x = -Math.PI/4;
                    const armR = new THREE.Mesh(armGeo, tFleshMat);
                    armR.position.set(0.2, 0.3, -0.1); armR.rotation.z = Math.PI/4; armR.rotation.x = -Math.PI/4;
                    bodyGroup.add(armL); bodyGroup.add(armR);

                    bodyGroup.position.set(Math.cos(angle)*0.8, 0, Math.sin(angle)*0.8);
                    bodyGroup.lookAt(0, 0, 0);
                    totemGroup.add(bodyGroup);
                }

                for(let i=0; i<8; i++) {
                    const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.25 - i*0.01, 0.35 - i*0.01, 0.5, 8), Math.random()>0.3 ? tFleshMat : tRustMat);
                    segment.position.set(Math.sin(i*0.5)*0.1, 0.8 + i*0.35, Math.cos(i*0.5)*0.1);
                    segment.rotation.set(Math.random()*0.2, i*0.5, Math.random()*0.2);
                    totemGroup.add(segment);
                }

                const globe = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), tGlobeMat);
                globe.position.set(0.1, 2.0, 0.25);
                globe.rotation.z = Math.PI / 6;
                totemGroup.add(globe);
                
                const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.3), tRustMat);
                monitor.position.set(-0.2, 1.5, 0.3);
                monitor.rotation.set(-0.2, -0.3, 0.1);
                const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), new THREE.MeshBasicMaterial({color: 0x113311}));
                screen.position.z = 0.16;
                monitor.add(screen);
                totemGroup.add(monitor);

                const crossBar1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 0.4), tRustMat);
                crossBar1.position.y = 3.2;
                crossBar1.rotation.z = 0.05;
                totemGroup.add(crossBar1);
                const crossBar2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 0.45), tMetalMat);
                crossBar2.position.set(0, 3.25, -0.05);
                crossBar2.rotation.z = -0.02;
                totemGroup.add(crossBar2);

                const mainHeadGroup = new THREE.Group();
                mainHeadGroup.position.set(0, 3.6, 0.2);
                
                const skullMass = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), tFleshMat);
                skullMass.scale.set(1, 0.8, 1.2);
                mainHeadGroup.add(skullMass);

                const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.5), tBoneMat);
                jaw.position.set(0, -0.4, 0.2);
                jaw.rotation.x = Math.PI / 8; 
                mainHeadGroup.add(jaw);
                for(let i=0; i<6; i++) {
                    const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.1, 4), tBoneMat);
                    tooth.position.set(-0.15 + (i*0.06), -0.25, 0.4);
                    tooth.rotation.x = Math.PI;
                    mainHeadGroup.add(tooth);
                    const bottomTooth = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.1, 4), tBoneMat);
                    bottomTooth.position.set(-0.15 + (i*0.06), -0.35, 0.4);
                    mainHeadGroup.add(bottomTooth);
                }

                const eyePositions = [
                    [0.3, 0.2, 0.45, 0.15], [-0.3, 0.2, 0.45, 0.12], 
                    [0, 0.4, 0.4, 0.1], [0.4, -0.1, 0.4, 0.18], 
                    [-0.4, -0.05, 0.45, 0.14], [0.15, 0.1, 0.5, 0.08]
                ];
                eyePositions.forEach(pos => {
                    const eyeBase = new THREE.Mesh(new THREE.CylinderGeometry(pos[3]*1.2, pos[3]*1.2, 0.1, 8), tMetalMat);
                    eyeBase.position.set(pos[0], pos[1], pos[2]);
                    eyeBase.rotation.x = Math.PI/2;
                    const eyeGlow = new THREE.Mesh(new THREE.SphereGeometry(pos[3], 8, 8), tEyeMat);
                    eyeGlow.position.set(pos[0], pos[1], pos[2] + 0.05);
                    mainHeadGroup.add(eyeBase);
                    mainHeadGroup.add(eyeGlow);
                });
                totemGroup.add(mainHeadGroup);

                class CustomCurve extends THREE.Curve {
                    constructor(p1, p2, p3) { super(); this.p1 = p1; this.p2 = p2; this.p3 = p3; }
                    getPoint(t, optionalTarget = new THREE.Vector3()) {
                        const tx = (1 - t) * (1 - t) * this.p1.x + 2 * (1 - t) * t * this.p2.x + t * t * this.p3.x;
                        const ty = (1 - t) * (1 - t) * this.p1.y + 2 * (1 - t) * t * this.p2.y + t * t * this.p3.y;
                        const tz = (1 - t) * (1 - t) * this.p1.z + 2 * (1 - t) * t * this.p2.z + t * t * this.p3.z;
                        return optionalTarget.set(tx, ty, tz);
                    }
                }

                for(let i=0; i<12; i++) {
                    const startX = (Math.random()>0.5 ? 1 : -1) * (0.5 + Math.random()*0.8);
                    const p1 = new THREE.Vector3(startX, 3.1, (Math.random()-0.5)*0.5);
                    const p3 = new THREE.Vector3(startX + (Math.random()-0.5)*0.5, 1.0 + Math.random(), (Math.random()-0.5));
                    const p2 = new THREE.Vector3((p1.x+p3.x)/2, Math.min(p1.y, p3.y) - 0.5 - Math.random(), (p1.z+p3.z)/2); 
                    
                    const curve = new CustomCurve(p1, p2, p3);
                    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.015 + Math.random()*0.02, 5, false), Math.random()>0.3 ? tMetalMat : tFleshMat);
                    totemGroup.add(tube);
                }
                
                for(let i=0; i<8; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const p1 = new THREE.Vector3(Math.cos(angle)*0.5, 0.2, Math.sin(angle)*0.5);
                    const p3 = new THREE.Vector3(Math.cos(angle)*(1.5 + Math.random()), 0, Math.sin(angle)*(1.5 + Math.random()));
                    const p2 = new THREE.Vector3((p1.x+p3.x)/2, 0.3, (p1.z+p3.z)/2);
                    
                    const curve = new CustomCurve(p1, p2, p3);
                    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.04, 5, false), tFleshMat);
                    totemGroup.add(tube);
                }

                const tLight = new THREE.PointLight(0xff0000, 4, 12);
                tLight.position.set(0, 3.6, 1.0);
                totemGroup.add(tLight);
                lights.push({obj: tLight, baseInt: 4, flicker: false, pulse: true});

                scene.add(totemGroup);
                
                const interactBox = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.5, 2.5), new THREE.MeshBasicMaterial({visible: false}));
                interactBox.position.set(px, 2.25, pz);
                scene.add(interactBox);
                interactables.push({ mesh: interactBox, type: 'totem', id: x+z });

            } else if(type === 6) {
                const m = new THREE.Mesh(enemyGeo, enemyMat);
                m.position.set(px, 1.5, pz);
                scene.add(m);
                const eye = new THREE.PointLight(0xff0000, 2, 5);
                m.add(eye);
                enemies.push({ mesh: m, hp: 40, state: 'idle' });
            } else if(type === 7) {
                const m = new THREE.Mesh(new THREE.BoxGeometry(tileSize, wallHeight, 1), new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00aa00}));
                m.position.set(px, wallHeight/2, pz);
                scene.add(m);
                interactables.push({ mesh: m, type: 'exit' });
            } else if(type === 8) {
                const light = new THREE.PointLight(0xddeeff, 1.5, 15);
                light.position.set(px, wallHeight - 0.5, pz);
                light.castShadow = true;
                scene.add(light);
                lights.push({obj: light, baseInt: 1.5, flicker: false});
                const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), new THREE.MeshBasicMaterial({color:0xddeeff}));
                fixture.position.copy(light.position);
                scene.add(fixture);
            }
        }
    }
}

// --- CONTROLES DE TECLADO ---
const moveState = { fwd: false, bwd: false, strLeft: false, strRight: false, turnLeft: false, turnRight: false, sprint: false };
const velocity = new THREE.Vector3();
const playerRadius = 0.5;

document.addEventListener('keydown', (e) => {
    if(!gameState.isRunning || gameState.inDialogue) return;
    switch(e.code) {
        case 'KeyW': moveState.fwd = true; break;
        case 'KeyS': moveState.bwd = true; break;
        case 'KeyA': moveState.strLeft = true; break; 
        case 'KeyD': moveState.strRight = true; break; 
        case 'KeyQ': moveState.turnLeft = true; break; 
        case 'KeyE': moveState.turnRight = true; break; 
        case 'ShiftLeft': 
        case 'ShiftRight': moveState.sprint = true; break; 
        case 'KeyF': tryInteract(); break; 
        case 'Space': shoot(); break; 
        case 'KeyX': toggleFlashlight(); break; 
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'KeyW': moveState.fwd = false; break;
        case 'KeyS': moveState.bwd = false; break;
        case 'KeyA': moveState.strLeft = false; break;
        case 'KeyD': moveState.strRight = false; break;
        case 'KeyQ': moveState.turnLeft = false; break;
        case 'KeyE': moveState.turnRight = false; break;
        case 'ShiftLeft': 
        case 'ShiftRight': moveState.sprint = false; break;
    }
});

function toggleFlashlight() {
    gameState.flashlightOn = !gameState.flashlightOn;
    flashLight.intensity = gameState.flashlightOn ? 6.0 : 0.0;
    flLensMat.emissiveIntensity = gameState.flashlightOn ? 2.0 : 0.0;
    sfx.click();
    logMsg(gameState.flashlightOn ? "Linterna: ENCENDIDA" : "Linterna: APAGADA");
}

const _moveVector = new THREE.Vector3();
function moveForward(distance) {
    _moveVector.setFromMatrixColumn(camera.matrix, 0);
    _moveVector.crossVectors(camera.up, _moveVector);
    camera.position.addScaledVector(_moveVector, distance);
}
function moveRight(distance) {
    _moveVector.setFromMatrixColumn(camera.matrix, 0);
    camera.position.addScaledVector(_moveVector, distance);
}

function checkCollision(newPos) {
    for(let i=0; i<walls.length; i++) {
        const box = new THREE.Box3().setFromObject(walls[i]);
        const closestX = Math.max(box.min.x, Math.min(newPos.x, box.max.x));
        const closestZ = Math.max(box.min.z, Math.min(newPos.z, box.max.z));
        const distanceX = newPos.x - closestX;
        const distanceZ = newPos.z - closestZ;
        if((distanceX * distanceX + distanceZ * distanceZ) < (playerRadius * playerRadius)) {
            return true;
        }
    }
    return false;
}

// --- SISTEMAS DE JUEGO ---
const raycaster = new THREE.Raycaster();
let weaponCooldown = 0;

function logMsg(msg) {
    const panel = document.getElementById('log-panel');
    const el = document.createElement('div');
    el.className = 'log-msg';
    el.innerText = msg;
    panel.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function updateHUD() {
    document.getElementById('hp-fill').style.width = (gameState.hp / gameState.maxHp * 100) + '%';
    document.getElementById('stamina-fill').style.width = (gameState.stamina / gameState.maxStamina * 100) + '%';
    document.getElementById('sanity-fill').style.width = (gameState.sanity / 100 * 100) + '%';
    document.getElementById('ammo-count').innerText = gameState.ammo;
    
    const vignette = document.getElementById('sanity-vignette');
    if(gameState.sanity < 50) {
        vignette.style.opacity = (50 - gameState.sanity) / 50;
    } else {
        vignette.style.opacity = 0;
    }
}

function damagePlayer(amount) {
    gameState.hp -= amount;
    sfx.hit();
    const flash = document.getElementById('damage-flash');
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 100);
    
    if(gameState.hp <= 0) {
        gameState.isRunning = false;
        document.getElementById('end-screen').classList.remove('hidden');
        document.getElementById('hud').classList.add('hidden');
    }
    updateHUD();
}

function shoot() {
    if(weaponCooldown > 0) return;
    if(gameState.ammo <= 0) {
        sfx.empty();
        weaponCooldown = 0.5;
        logMsg("Sin munición.");
        return;
    }
    
    gameState.ammo--;
    weaponCooldown = 0.3;
    sfx.shoot();
    updateHUD();

    weaponGroup.position.z += 0.1;
    weaponGroup.rotation.x += 0.1;
    muzzleFlash.intensity = 5;
    setTimeout(() => { muzzleFlash.intensity = 0; }, 50);

    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
    const enemyMeshes = enemies.map(e => e.mesh);
    const intersects = raycaster.intersectObjects([...walls, ...enemyMeshes]);

    if(intersects.length > 0) {
        const hit = intersects[0];
        const enemyIdx = enemies.findIndex(e => e.mesh === hit.object);
        if(enemyIdx !== -1) {
            const enemy = enemies[enemyIdx];
            enemy.hp -= (gameState.char === 'soldier' ? 25 : 15);
            enemy.mesh.position.add(raycaster.ray.direction.multiplyScalar(0.5));
            if(enemy.hp <= 0) {
                scene.remove(enemy.mesh);
                enemies.splice(enemyIdx, 1);
                logMsg("Amenaza neutralizada.");
                gameState.sanity = Math.min(100, gameState.sanity + 10);
            }
        }
    }
}

const totemData = [
    { id: 't1', text: "TÓTEM DE CARNE: Varios cuerpos humanos están fundidos con la estructura de acero. Sus bocas cosidas emiten un zumbido de módem. Una pantalla agrietada en el pecho central parpadea con datos vitales.",
      opts: [
          { text: "Conectar tu terminal neuronal al tótem (Extraer datos)", effect: () => { logMsg("Datos anómalos obtenidos. Has visto cosas terribles."); gameState.sanity -= 15; }, lore: true },
          { text: "Romper la pantalla (Purgar conexión)", effect: () => { logMsg("Los cuerpos gimen de dolor. Sistema purgado."); sfx.monsterGrowl(); }, lore: false }
      ]
    },
    { id: 't2', text: "ALTAR BIOMECÁNICO: Un amasijo de cables colgantes y vísceras con múltiples ojos robóticos que siguen cada uno de tus movimientos. Sientes cómo la máquina intenta inhalar tu propio oxígeno.",
      opts: [
          { text: "Arrancar el módulo de seguridad de entre sus costillas", effect: () => { logMsg("Código extraído. Tu traje se ha manchado de fluidos oscuros."); gameState.mapKeys++; gameState.sanity -= 5; }, lore: true },
          { text: "Retroceder lentamente", effect: () => {}, lore: false }
      ]
    }
];

function tryInteract() {
    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
    const interMeshes = interactables.map(i => i.mesh);
    const intersects = raycaster.intersectObjects(interMeshes);

    if(intersects.length > 0 && intersects[0].distance < 3) {
        const itemIdx = interactables.findIndex(i => i.mesh === intersects[0].object);
        const item = interactables[itemIdx];

        if(item.type === 'meds') {
            const heal = gameState.char === 'bio' ? 60 : 40;
            gameState.hp = Math.min(gameState.maxHp, gameState.hp + heal);
            sfx.itemPickup();
            logMsg(`Integridad restaurada (+${heal})`);
            scene.remove(item.mesh);
            interactables.splice(itemIdx, 1);
            updateHUD();
        } else if(item.type === 'ammo') {
            gameState.ammo += 10;
            sfx.itemPickup();
            logMsg("Munición pesada obtenida (+10)");
            scene.remove(item.mesh);
            interactables.splice(itemIdx, 1);
            updateHUD();
        } else if(item.type === 'totem') {
            openDialogue(totemData[item.id % totemData.length]);
        } else if(item.type === 'exit') {
            if(gameState.mapKeys > 0 || gameState.char === 'eng') {
                document.getElementById('end-title').innerText = "Sector Asegurado";
                document.getElementById('end-desc').innerText = "Has logrado escapar al siguiente nivel. Por ahora.";
                document.getElementById('end-screen').classList.remove('hidden');
                gameState.isRunning = false;
            } else {
                logMsg("Se requiere anulación de seguridad (Terminal o Ingeniero)");
            }
        }
    }
}

function openDialogue(data) {
    gameState.inDialogue = true;
    const overlay = document.getElementById('dialogue-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('dialogue-text').innerText = data.text;
    
    const optContainer = document.getElementById('dialogue-options');
    optContainer.innerHTML = '';
    
    data.opts.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-btn';
        btn.innerHTML = `${opt.text} ${opt.lore ? '<span>[Impacta Cordura]</span>' : ''}`;
        btn.onclick = () => {
            opt.effect();
            closeDialogue();
        };
        optContainer.appendChild(btn);
    });
}

function closeDialogue() {
    gameState.inDialogue = false;
    document.getElementById('dialogue-overlay').classList.add('hidden');
    updateHUD();
}

// --- BUCLE PRINCIPAL ---
let prevTime = performance.now();
let walkTime = 0; 

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    prevTime = time;

    if (gameState.isRunning && !gameState.inDialogue) {
        weaponGroup.position.z = THREE.MathUtils.lerp(weaponGroup.position.z, -0.5, delta * 10);
        weaponGroup.rotation.x = THREE.MathUtils.lerp(weaponGroup.rotation.x, 0, delta * 10);
        if(weaponCooldown > 0) weaponCooldown -= delta;

        const turnSpeed = 2.0; 
        if (moveState.turnLeft) camera.rotation.y += turnSpeed * delta;
        if (moveState.turnRight) camera.rotation.y -= turnSpeed * delta;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        let dirZ = Number(moveState.fwd) - Number(moveState.bwd);
        let dirX = Number(moveState.strRight) - Number(moveState.strLeft);
        const isMoving = dirZ !== 0 || dirX !== 0;

        let speed = 40.0;
        if (moveState.sprint && isMoving && gameState.stamina > 0) {
            speed = 70.0;
            gameState.stamina -= 25 * delta; 
        } else {
            gameState.stamina += 15 * delta; 
        }
        gameState.stamina = Math.max(0, Math.min(gameState.maxStamina, gameState.stamina));
        
        if (dirZ !== 0) velocity.z -= dirZ * speed * delta;
        if (dirX !== 0) velocity.x -= dirX * speed * delta;

        if (isMoving) {
            walkTime += delta * (moveState.sprint && gameState.stamina > 0 ? 15 : 10);
            const bob = Math.sin(walkTime) * 0.02;
            weaponGroup.position.y = -0.3 + bob;
            flashlightGroup.position.y = -0.3 - bob; 
        } else {
            weaponGroup.position.y = THREE.MathUtils.lerp(weaponGroup.position.y, -0.3, delta * 5);
            flashlightGroup.position.y = THREE.MathUtils.lerp(flashlightGroup.position.y, -0.3, delta * 5);
        }

        const oldPos = camera.position.clone();
        moveRight(-velocity.x * delta);
        if(checkCollision(camera.position)) camera.position.copy(oldPos);

        const oldPos2 = camera.position.clone();
        moveForward(-velocity.z * delta);
        if(checkCollision(camera.position)) camera.position.copy(oldPos2);

        camera.position.y = 1.6;

        raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
        const interMeshes = interactables.map(i => i.mesh);
        const intersects = raycaster.intersectObjects(interMeshes);
        const prompt = document.getElementById('interaction-prompt');
        if(intersects.length > 0 && intersects[0].distance < 3) {
            prompt.classList.remove('hidden');
        } else {
            prompt.classList.add('hidden');
        }

        enemies.forEach(enemy => {
            const dist = enemy.mesh.position.distanceTo(camera.position);
            enemy.mesh.scale.setScalar(1 + Math.sin(time*0.005)*0.1);
            
            if(dist < 15) {
                if(enemy.state === 'idle') {
                    enemy.state = 'aggro';
                    sfx.monsterGrowl();
                }
                const dir = new THREE.Vector3().subVectors(camera.position, enemy.mesh.position).normalize();
                enemy.mesh.position.add(dir.multiplyScalar(delta * 2));
                
                gameState.sanity -= 2 * delta * gameState.sanityDrainRate;
                
                if(dist < 1.5) {
                    damagePlayer(20);
                    enemy.mesh.position.add(dir.multiplyScalar(-2));
                }
            }
        });

        gameState.sanity -= 0.5 * delta * gameState.sanityDrainRate;
        if(gameState.sanity < 0) gameState.sanity = 0;
        
        const baseFov = 75;
        if(gameState.sanity < 30) {
            camera.fov = baseFov + Math.sin(time * 0.01) * (30 - gameState.sanity);
            camera.updateProjectionMatrix();
            camera.rotation.z = Math.sin(time * 0.05) * 0.02;
        } else {
            camera.fov = baseFov;
            camera.updateProjectionMatrix();
            camera.rotation.z = 0;
        }

        lights.forEach(l => {
            if(l.flicker && Math.random() < 0.05) {
                l.obj.intensity = Math.random() > 0.5 ? 0 : l.baseInt;
            }
            if(l.pulse) {
                l.obj.intensity = l.baseInt + Math.sin(time * 0.003) * 1.5;
            }
        });

        updateHUD();
    }

    renderer.render(scene, camera);
}

const charCards = document.querySelectorAll('.char-card');
const startBtn = document.getElementById('btn-start');

charCards.forEach(card => {
    card.addEventListener('click', () => {
        charCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        gameState.char = card.dataset.char;
        startBtn.disabled = false;
    });
});

document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al iniciar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

startBtn.addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    
    if(gameState.char === 'soldier') {
        gameState.maxHp = 150; gameState.hp = 150; gameState.ammo = 24; gameState.sanityDrainRate = 1.0; 
        gameState.maxStamina = 120; gameState.stamina = 120;
    } else if(gameState.char === 'bio') {
        gameState.maxHp = 100; gameState.hp = 100; gameState.ammo = 10; gameState.sanityDrainRate = 0.5; 
        gameState.maxStamina = 100; gameState.stamina = 100;
    } else if(gameState.char === 'eng') {
        gameState.maxHp = 100; gameState.hp = 100; gameState.ammo = 10; gameState.sanityDrainRate = 1.5; 
        gameState.maxStamina = 150; gameState.stamina = 150;
    }

    buildLevel();
    camera.position.set(tileSize * 2, 1.6, tileSize * 1.5);
    camera.rotation.set(0, Math.PI, 0); 
    
    gameState.isRunning = true;
    document.getElementById('hud').classList.remove('hidden');
    
    window.focus();
    
    logMsg("Iniciando descenso. Sistemas en línea.");
});

document.getElementById('btn-restart').addEventListener('click', () => {
    location.reload();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
