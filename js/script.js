import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xD8D8D8);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(2.5, 1.5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;
controls.zoomSpeed = 1.0;
controls.rotateSpeed = 1.2;
controls.target.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(3, 4, 2);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xffffff, 0.6);
fillLight.position.set(1, 1, 2);
scene.add(fillLight);

const backLight = new THREE.PointLight(0xaaccff, 0.5);
backLight.position.set(-1.5, 1.5, -2);
scene.add(backLight);

const rimLight = new THREE.PointLight(0xffffff, 0.6);
rimLight.position.set(1.2, 1.2, -1.8);
scene.add(rimLight);

const bottomLight = new THREE.PointLight(0xccccaa, 0.4);
bottomLight.position.set(0, -1.5, 1);
scene.add(bottomLight);

const silverMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0x222222,
    emissiveIntensity: 0.05
});

const darkSilverMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    metalness: 0.9,
    roughness: 0.25,
    emissive: 0x111111,
    emissiveIntensity: 0.03
});

const brightSilverMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    metalness: 0.98,
    roughness: 0.15,
    emissive: 0x444444,
    emissiveIntensity: 0.08
});

const group = new THREE.Group();

const spiralPoints = [];
const turns = 2.5;
const radius = 0.9;
const heightTotal = 1.8;
const segments = 80;

for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (t - 0.5) * heightTotal;
    spiralPoints.push(new THREE.Vector3(x, y, z));
}

const spiralGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(spiralPoints),
    200,
    0.08,
    12,
    false
);
const spiralTube = new THREE.Mesh(spiralGeometry, silverMaterial);
spiralTube.castShadow = true;
group.add(spiralTube);

const extraSpiralPoints = [];
const radius2 = 1.05;
for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns + 0.5;
    const x = Math.cos(angle) * radius2;
    const z = Math.sin(angle) * radius2;
    const y = (t - 0.5) * heightTotal;
    extraSpiralPoints.push(new THREE.Vector3(x, y, z));
}
const extraSpiralGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(extraSpiralPoints),
    200,
    0.05,
    10,
    false
);
const extraSpiralTube = new THREE.Mesh(extraSpiralGeometry, darkSilverMaterial);
extraSpiralTube.castShadow = true;
group.add(extraSpiralTube);

const centerSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 48, 48),
    brightSilverMaterial
);
centerSphere.castShadow = true;
group.add(centerSphere);

const orbCount = 24;
const orbs = [];
const orbRadius = 1.35;

for (let i = 0; i < orbCount; i++) {
    const orbMaterial = new THREE.MeshStandardMaterial({
        color: 0xd0d0d0,
        metalness: 0.92,
        roughness: 0.18,
        emissive: 0x888888,
        emissiveIntensity: 0.1
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), orbMaterial);
    orb.castShadow = true;
    group.add(orb);
    orbs.push({
        mesh: orb,
        angle: (i / orbCount) * Math.PI * 2,
        speed: 0.008
    });
}

const smallOrbs = [];
const smallOrbCount = 36;
const smallOrbRadius = 1.55;

for (let i = 0; i < smallOrbCount; i++) {
    const orbMaterial = new THREE.MeshStandardMaterial({
        color: 0xb0b0b0,
        metalness: 0.88,
        roughness: 0.22,
        emissive: 0x666666,
        emissiveIntensity: 0.06
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 20), orbMaterial);
    orb.castShadow = true;
    group.add(orb);
    smallOrbs.push({
        mesh: orb,
        angle: (i / smallOrbCount) * Math.PI * 2,
        speed: -0.012,
        yOffset: Math.sin((i / smallOrbCount) * Math.PI * 2) * 0.6
    });
}

const floatingParticles = [];
const particleCount = 200;

for (let i = 0; i < particleCount; i++) {
    const particleGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.85,
        emissive: 0xaaaaaa,
        emissiveIntensity: 0.15
    });
    const particle = new THREE.Mesh(particleGeo, particleMat);

    const radiusP = 1.2 + Math.random() * 0.7;
    const angle = Math.random() * Math.PI * 2;
    const yPos = (Math.random() - 0.5) * 2.2;
    const xPos = Math.cos(angle) * radiusP;
    const zPos = Math.sin(angle) * radiusP;
    particle.position.set(xPos, yPos, zPos);
    group.add(particle);

    floatingParticles.push({
        mesh: particle,
        radius: radiusP,
        angle: angle,
        yPos: yPos,
        speed: 0.003 + Math.random() * 0.008,
        ySpeed: 0.002 + Math.random() * 0.005
    });
}

scene.add(group);

let time = 0;

function animate() {
    requestAnimationFrame(animate);

    time += 0.016;

    group.rotation.y = Math.sin(time * 0.15) * 0.15;
    group.rotation.x = Math.sin(time * 0.12) * 0.08;

    orbs.forEach(orb => {
        orb.angle += orb.speed;
        const x = Math.cos(orb.angle) * orbRadius;
        const z = Math.sin(orb.angle) * orbRadius;
        const y = Math.sin(orb.angle * 1.5) * 0.8;
        orb.mesh.position.set(x, y, z);
    });

    smallOrbs.forEach(orb => {
        orb.angle += orb.speed;
        const x = Math.cos(orb.angle) * smallOrbRadius;
        const z = Math.sin(orb.angle) * smallOrbRadius;
        const y = orb.yOffset;
        orb.mesh.position.set(x, y, z);
    });

    floatingParticles.forEach(p => {
        p.angle += p.speed;
        const newX = Math.cos(p.angle) * p.radius;
        const newZ = Math.sin(p.angle) * p.radius;
        p.mesh.position.x = newX;
        p.mesh.position.z = newZ;
        p.yPos += p.ySpeed;
        if (p.yPos > 1.2) p.yPos = -1.2;
        if (p.yPos < -1.2) p.yPos = 1.2;
        p.mesh.position.y = p.yPos;
    });

    const pulse = 0.5 + Math.sin(time * 1.5) * 0.2;
    rimLight.intensity = pulse;
    backLight.intensity = 0.4 + Math.sin(time * 1.2) * 0.15;
    fillLight.intensity = 0.5 + Math.cos(time * 1.0) * 0.1;

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}