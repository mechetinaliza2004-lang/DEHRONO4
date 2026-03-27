import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xD8D8D8);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(2.5, 2, 4);
camera.lookAt(0, 0.5, 0);

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
controls.target.set(0, 0.5, 0);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(3, 4, 2);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xffaa66, 0.5);
fillLight.position.set(1, 1, 2);
scene.add(fillLight);

const backLight = new THREE.PointLight(0x88aaff, 0.6);
backLight.position.set(-1.5, 1.5, -2);
scene.add(backLight);

const rimLight = new THREE.PointLight(0xffffff, 0.5);
rimLight.position.set(1.2, 1.2, -1.8);
scene.add(rimLight);

const bottomLight = new THREE.PointLight(0xaa8866, 0.4);
bottomLight.position.set(0, -1.5, 1);
scene.add(bottomLight);

const group = new THREE.Group();

const materialMetal = new THREE.MeshStandardMaterial({
    color: 0xaa8866,
    metalness: 0.85,
    roughness: 0.25,
    emissive: 0x442200,
    emissiveIntensity: 0.1
});

const materialDarkMetal = new THREE.MeshStandardMaterial({
    color: 0x886644,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x221100,
    emissiveIntensity: 0.05
});

const materialAccent = new THREE.MeshStandardMaterial({
    color: 0xccaa88,
    metalness: 0.95,
    roughness: 0.15,
    emissive: 0x553322,
    emissiveIntensity: 0.08
});

const coreGeometry = new THREE.IcosahedronGeometry(0.65, 1);
const core = new THREE.Mesh(coreGeometry, materialDarkMetal);
core.castShadow = true;
group.add(core);

const spikes = [
    { pos: [1.1, 0.2, 0.3], rot: [0.2, 0.4, 0.1], scale: [0.25, 0.8, 0.25] },
    { pos: [-1.0, 0.3, -0.2], rot: [-0.1, -0.3, 0.2], scale: [0.28, 0.85, 0.28] },
    { pos: [0.2, 1.2, 0.1], rot: [0.3, 0.1, 0.2], scale: [0.22, 0.9, 0.22] },
    { pos: [-0.1, -1.1, 0.4], rot: [-0.2, 0.1, -0.1], scale: [0.24, 0.75, 0.24] },
    { pos: [0.5, 0.1, 1.0], rot: [0.1, 0.5, 0.1], scale: [0.26, 0.7, 0.26] },
    { pos: [-0.4, 0.2, -1.1], rot: [0.1, -0.4, 0.2], scale: [0.27, 0.78, 0.27] },
    { pos: [0.8, -0.5, 0.6], rot: [0.4, 0.3, 0.3], scale: [0.23, 0.68, 0.23] },
    { pos: [-0.7, -0.4, -0.8], rot: [-0.3, -0.2, 0.4], scale: [0.25, 0.72, 0.25] },
    { pos: [0.3, 0.9, -0.5], rot: [0.2, -0.1, 0.5], scale: [0.24, 0.82, 0.24] },
    { pos: [-0.5, 0.8, 0.6], rot: [0.1, 0.6, -0.2], scale: [0.26, 0.8, 0.26] },
    { pos: [0.6, -0.8, -0.2], rot: [0.5, -0.2, 0.3], scale: [0.22, 0.7, 0.22] },
    { pos: [-0.8, 0.5, -0.4], rot: [-0.2, 0.5, 0.1], scale: [0.27, 0.85, 0.27] }
];

spikes.forEach(spike => {
    const geometry = new THREE.ConeGeometry(0.22, 0.7, 12);
    const spikeMesh = new THREE.Mesh(geometry, materialMetal);
    spikeMesh.position.set(spike.pos[0], spike.pos[1], spike.pos[2]);
    spikeMesh.rotation.set(spike.rot[0], spike.rot[1], spike.rot[2]);
    spikeMesh.scale.set(spike.scale[0], spike.scale[1], spike.scale[2]);
    spikeMesh.castShadow = true;
    group.add(spikeMesh);
});

const rings = [
    { radius: 0.95, yOffset: 0.1, rotX: 0.3, rotZ: 0.2, color: 0xaa8866 },
    { radius: 1.05, yOffset: -0.15, rotX: 0.5, rotZ: 0.4, color: 0xccaa88 },
    { radius: 0.85, yOffset: 0.45, rotX: 0.1, rotZ: 0.6, color: 0x886644 }
];

rings.forEach(ring => {
    const ringGeometry = new THREE.TorusGeometry(ring.radius, 0.05, 64, 200);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: ring.color, metalness: 0.9, roughness: 0.2 });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.position.y = ring.yOffset;
    ringMesh.rotation.x = ring.rotX;
    ringMesh.rotation.z = ring.rotZ;
    ringMesh.castShadow = true;
    group.add(ringMesh);
});

const extraSpikes = [
    [0.95, 0.35, 0.45], [0.85, -0.2, 0.7], [-0.9, 0.4, 0.5], [-0.7, -0.3, -0.9],
    [0.4, 1.05, 0.2], [-0.3, 1.0, -0.4], [0.2, -0.95, 0.5], [-0.5, -0.85, -0.3],
    [1.0, -0.1, -0.2], [-1.05, 0.0, 0.2], [0.1, 0.5, 1.1], [0.0, -0.4, -1.15]
];

extraSpikes.forEach(pos => {
    const geometry = new THREE.ConeGeometry(0.12, 0.5, 8);
    const spikeMesh = new THREE.Mesh(geometry, materialAccent);
    spikeMesh.position.set(pos[0], pos[1], pos[2]);
    spikeMesh.castShadow = true;
    group.add(spikeMesh);
});

const floatingParticles = [];
const particleCount = 300;
const particlePositions = [];

for (let i = 0; i < particleCount; i++) {
    const radius = 1.2 + Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 1.8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const particleGeo = new THREE.SphereGeometry(0.02, 6, 6);
    const particleMat = new THREE.MeshStandardMaterial({
        color: 0xccaa88,
        metalness: 0.7,
        emissive: 0x442200,
        emissiveIntensity: 0.3
    });
    const particle = new THREE.Mesh(particleGeo, particleMat);
    particle.position.set(x, height, z);
    group.add(particle);

    floatingParticles.push({
        mesh: particle,
        radius: radius,
        angle: angle,
        height: height,
        speed: 0.005 + Math.random() * 0.01
    });
}

scene.add(group);

let time = 0;

function animate() {
    requestAnimationFrame(animate);

    time += 0.012;

    group.rotation.y = Math.sin(time * 0.1) * 0.1;
    group.rotation.x = Math.sin(time * 0.08) * 0.05;

    floatingParticles.forEach(p => {
        p.angle += p.speed;
        const newX = Math.cos(p.angle) * p.radius;
        const newZ = Math.sin(p.angle) * p.radius;
        p.mesh.position.x = newX;
        p.mesh.position.z = newZ;
        p.mesh.position.y = p.height + Math.sin(time * 1.5 + p.radius) * 0.05;
    });

    const pulse = 0.5 + Math.sin(time * 1.2) * 0.15;
    rimLight.intensity = pulse;
    backLight.intensity = 0.4 + Math.sin(time * 0.9) * 0.1;
    fillLight.intensity = 0.4 + Math.cos(time * 1.1) * 0.1;

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