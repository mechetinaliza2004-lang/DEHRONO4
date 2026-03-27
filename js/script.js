
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xD8D8D8);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 2, 5);
camera.lookAt(0, 0.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.enableZoom = true;
controls.enablePan = true;
controls.zoomSpeed = 1.0;
controls.rotateSpeed = 1.2;
controls.target.set(0, 0.5, 0);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(2, 3, 2);
mainLight.castShadow = true;
mainLight.receiveShadow = false;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLightBottom = new THREE.PointLight(0xffffff, 0.6);
fillLightBottom.position.set(0, -1.5, 1);
scene.add(fillLightBottom);

const backLight = new THREE.PointLight(0x88aaff, 0.5);
backLight.position.set(-1, 1, -2);
scene.add(backLight);

const warmLight = new THREE.PointLight(0xffaa66, 0.4);
warmLight.position.set(1.5, 0.5, 1.5);
scene.add(warmLight);

const coolLight = new THREE.PointLight(0x6688ff, 0.5);
coolLight.position.set(-1, 1.2, 1.8);
scene.add(coolLight);

const rimLight = new THREE.PointLight(0xffffff, 0.5);
rimLight.position.set(1, 1.5, -1.5);
scene.add(rimLight);

let time = 0;
let model = null;
const loader = new GLTFLoader();
const modelPath = './images/model.glb';

loader.load(modelPath,
    (gltf) => {
        model = gltf.scene;

        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = false;

                if (node.material) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(mat => {
                            mat.metalness = 0.85;
                            mat.roughness = 0.25;
                            mat.envMapIntensity = 1.2;
                        });
                    } else {
                        node.material.metalness = 0.85;
                        node.material.roughness = 0.25;
                        node.material.envMapIntensity = 1.2;
                    }
                }
            }
        });

        model.position.set(0, 0.2, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
    },
    undefined,
    (error) => {
        const geometry = new THREE.TorusKnotGeometry(0.8, 0.2, 128, 16, 3, 4);
        const material = new THREE.MeshStandardMaterial({
            color: 0xaa8866,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0x442200,
            emissiveIntensity: 0.15
        });
        const fallbackMesh = new THREE.Mesh(geometry, material);
        fallbackMesh.castShadow = true;
        scene.add(fallbackMesh);

        function animateFallback() {
            requestAnimationFrame(animateFallback);
            fallbackMesh.rotation.y += 0.01;
            fallbackMesh.rotation.x += 0.005;
        }
        animateFallback();
    }
);

const particleCount = 400;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 8;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0xaa8866,
    size: 0.015,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

function animate() {
    requestAnimationFrame(animate);

    time += 0.016;

    const pulse1 = 0.4 + Math.sin(time * 1.5) * 0.15;
    const pulse2 = 0.4 + Math.cos(time * 1.2) * 0.12;

    warmLight.intensity = pulse1;
    coolLight.intensity = pulse2;
    rimLight.intensity = 0.4 + Math.sin(time * 1.8) * 0.1;

    particles.rotation.y = time * 0.03;

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