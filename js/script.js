import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, group, time = 0;
let animationId = null;
const container = document.getElementById('canvas-container');

function initBlock1() {
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD8D8D8);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(4, 2, 7);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.zoomSpeed = 0.8;
    controls.rotateSpeed = 0.8;
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
        color: 0xc0c0c0, metalness: 0.95, roughness: 0.2, emissive: 0x222222, emissiveIntensity: 0.05
    });

    const darkSilverMaterial = new THREE.MeshStandardMaterial({
        color: 0xa0a0a0, metalness: 0.9, roughness: 0.25, emissive: 0x111111, emissiveIntensity: 0.03
    });

    const brightSilverMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0, metalness: 0.98, roughness: 0.15, emissive: 0x444444, emissiveIntensity: 0.08
    });

    group = new THREE.Group();

    const spiralPoints = [];
    const turns = 2.5;
    const radius = 0.45;
    const heightTotal = 1.2;
    const segments = 80;

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * turns;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (t - 0.5) * heightTotal;
        spiralPoints.push(new THREE.Vector3(x, y, z));
    }

    const spiralGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiralPoints), 200, 0.05, 12, false);
    const spiralTube = new THREE.Mesh(spiralGeometry, silverMaterial);
    spiralTube.castShadow = true;
    group.add(spiralTube);

    const extraSpiralPoints = [];
    const radius2 = 0.55;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * turns + 0.5;
        const x = Math.cos(angle) * radius2;
        const z = Math.sin(angle) * radius2;
        const y = (t - 0.5) * heightTotal;
        extraSpiralPoints.push(new THREE.Vector3(x, y, z));
    }
    const extraSpiralGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(extraSpiralPoints), 200, 0.035, 10, false);
    const extraSpiralTube = new THREE.Mesh(extraSpiralGeometry, darkSilverMaterial);
    extraSpiralTube.castShadow = true;
    group.add(extraSpiralTube);

    const centerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 48, 48), brightSilverMaterial);
    centerSphere.castShadow = true;
    group.add(centerSphere);

    const orbCount = 20;
    const orbs = [];
    const orbRadius = 0.82;

    for (let i = 0; i < orbCount; i++) {
        const orbMaterial = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.92, roughness: 0.18, emissive: 0x888888, emissiveIntensity: 0.1 });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 24), orbMaterial);
        orb.castShadow = true;
        group.add(orb);
        orbs.push({ mesh: orb, angle: (i / orbCount) * Math.PI * 2, speed: 0.008 });
    }

    const smallOrbs = [];
    const smallOrbCount = 30;
    const smallOrbRadius = 0.95;

    for (let i = 0; i < smallOrbCount; i++) {
        const orbMaterial = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.88, roughness: 0.22, emissive: 0x666666, emissiveIntensity: 0.06 });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 20), orbMaterial);
        orb.castShadow = true;
        group.add(orb);
        smallOrbs.push({ mesh: orb, angle: (i / smallOrbCount) * Math.PI * 2, speed: -0.012, yOffset: Math.sin((i / smallOrbCount) * Math.PI * 2) * 0.45 });
    }

    const floatingParticles = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
        const particleGeo = new THREE.SphereGeometry(0.015, 8, 8);
        const particleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, emissive: 0xaaaaaa, emissiveIntensity: 0.15 });
        const particle = new THREE.Mesh(particleGeo, particleMat);
        const radiusP = 0.7 + Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        const yPos = (Math.random() - 0.5) * 1.5;
        const xPos = Math.cos(angle) * radiusP;
        const zPos = Math.sin(angle) * radiusP;
        particle.position.set(xPos, yPos, zPos);
        group.add(particle);
        floatingParticles.push({ mesh: particle, radius: radiusP, angle: angle, yPos: yPos, speed: 0.003 + Math.random() * 0.008, ySpeed: 0.002 + Math.random() * 0.005 });
    }

    scene.add(group);

    function animate() {
        animationId = requestAnimationFrame(animate);

        time += 0.016;

        group.rotation.y = Math.sin(time * 0.15) * 0.15;
        group.rotation.x = Math.sin(time * 0.12) * 0.08;

        orbs.forEach(orb => {
            orb.angle += orb.speed;
            const x = Math.cos(orb.angle) * orbRadius;
            const z = Math.sin(orb.angle) * orbRadius;
            const y = Math.sin(orb.angle * 1.5) * 0.5;
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
            if (p.yPos > 0.9) p.yPos = -0.9;
            if (p.yPos < -0.9) p.yPos = 0.9;
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
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
}

const itemsConfig = [
    { id: 1, src: "images/1square.svg", width: 601, height: 598, targetX: 400, targetY: 200 },
    { id: 2, src: "images/2square.svg", width: 375, height: 369, targetX: 470, targetY: 240 },
    { id: 3, src: "images/3square.svg", width: 231, height: 229, targetX: 520, targetY: 280 },
    { id: 4, src: "images/4square.svg", width: 137, height: 143, targetX: 560, targetY: 320 },
    { id: 5, src: "images/5square.svg", width: 92, height: 83, targetX: 590, targetY: 350 },
    { id: 6, src: "images/6square.svg", width: 58, height: 61, targetX: 610, targetY: 380 },
    { id: 7, src: "images/7square.svg", width: 35, height: 34, targetX: 630, targetY: 400 },
    { id: 8, src: "images/8square.svg", width: 24, height: 27, targetX: 645, targetY: 420 },
    { id: 9, src: "images/9square.svg", width: 11, height: 14, targetX: 655, targetY: 435 },
    { id: 10, src: "images/10square.svg", width: 11, height: 14, targetX: 665, targetY: 450 }
];

const SNAP_RADIUS = 35;
let puzzleItems = [];
let snappedCount = 0;
let draggedPuzzleItem = null;
let dragOffsetX = 0, dragOffsetY = 0;

function getRandomPosition(width, height) {
    const maxX = window.innerWidth - width - 30;
    const maxY = window.innerHeight - height + 200;
    return { x: Math.max(20, Math.random() * Math.max(0, maxX)), y: Math.max(20, Math.random() * Math.max(0, maxY) + 100) };
}

function showVictoryMessage() {
    const msg = document.createElement('div');
    msg.textContent = '✓ ФИГУРА СОБРАНА!';
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'rgba(0,0,0,0.9)';
    msg.style.color = 'gold';
    msg.style.fontFamily = 'monospace';
    msg.style.fontSize = '24px';
    msg.style.padding = '20px 40px';
    msg.style.borderRadius = '12px';
    msg.style.zIndex = '2000';
    msg.style.pointerEvents = 'none';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function checkAllSnapped() {
    snappedCount = puzzleItems.filter(item => item.snapped).length;
    if (snappedCount === itemsConfig.length) {
        showVictoryMessage();
    }
}

function snapToTarget(item, targetX, targetY) {
    item.element.style.left = targetX + 'px';
    item.element.style.top = targetY + 'px';
    item.currentX = targetX;
    item.currentY = targetY;
    item.snapped = true;
    checkAllSnapped();
}

function rotateItem(item) {
    let currentRotate = item.rotation || 0;
    currentRotate += 15;
    if (currentRotate >= 360) currentRotate -= 360;
    item.rotation = currentRotate;
    item.element.style.transform = `rotate(${currentRotate}deg)`;
}

function createDraggableElement(config) {
    const div = document.createElement('div');
    div.className = 'draggable-item';
    div.id = `item-${config.id}`;
    const img = document.createElement('img');
    img.src = config.src;
    img.style.width = `${config.width}px`;
    img.style.height = `${config.height}px`;
    img.style.display = 'block';
    img.style.pointerEvents = 'none';
    div.appendChild(img);
    const startPos = getRandomPosition(config.width, config.height);
    div.style.left = startPos.x + 'px';
    div.style.top = startPos.y + 'px';
    div.style.width = `${config.width}px`;
    div.style.height = `${config.height}px`;

    const item = {
        element: div,
        id: config.id,
        width: config.width,
        height: config.height,
        currentX: startPos.x,
        currentY: startPos.y,
        snapped: false,
        targetX: config.targetX,
        targetY: config.targetY,
        rotation: 0
    };

    div.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!item.snapped) {
            rotateItem(item);
        }
    });

    return item;
}

function initBlock2() {
    const layer = document.getElementById('draggableLayer');
    if (!layer) return;
    layer.innerHTML = '';
    puzzleItems = [];
    itemsConfig.forEach(config => {
        const item = createDraggableElement(config);
        layer.appendChild(item.element);
        puzzleItems.push(item);

        item.element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            if (item.snapped) return;
            draggedPuzzleItem = item;
            const rect = item.element.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            item.element.style.cursor = 'grabbing';
            item.element.classList.add('dragging');
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!draggedPuzzleItem) return;
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        newX = Math.max(0, Math.min(window.innerWidth - draggedPuzzleItem.width, newX));
        newY = Math.max(0, Math.min(window.innerHeight + 200, newY));
        draggedPuzzleItem.element.style.left = newX + 'px';
        draggedPuzzleItem.element.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', (e) => {
        if (!draggedPuzzleItem) return;
        const item = draggedPuzzleItem;
        const targetX = item.targetX;
        const targetY = item.targetY;
        const currentX = parseInt(item.element.style.left);
        const currentY = parseInt(item.element.style.top);
        const dx = Math.abs(currentX - targetX);
        const dy = Math.abs(currentY - targetY);
        if (dx <= SNAP_RADIUS && dy <= SNAP_RADIUS && !item.snapped) {
            snapToTarget(item, targetX, targetY);
        }
        item.element.style.cursor = 'grab';
        item.element.classList.remove('dragging');
        draggedPuzzleItem = null;
    });
}

function initBlock3() {
    const lensCanvas = document.getElementById('lensCanvas');
    const container = document.querySelector('.block3');
    const textElement = document.getElementById('fibonacciText');

    if (!lensCanvas || !container) return;

    let isDragging = false;
    let lensX = 0, lensY = 0;

    const ctx = lensCanvas.getContext('2d');
    let textCanvas = null;

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        lensCanvas.width = rect.width;
        lensCanvas.height = rect.height;
        lensCanvas.style.width = `${rect.width}px`;
        lensCanvas.style.height = `${rect.height}px`;
    }

    function createTextCanvas() {
        const rect = container.getBoundingClientRect();
        const textRect = textElement.getBoundingClientRect();

        textCanvas = document.createElement('canvas');
        textCanvas.width = rect.width;
        textCanvas.height = rect.height;
        const textCtx = textCanvas.getContext('2d');

        textCtx.fillStyle = '#D8D8D8';
        textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

        textCtx.font = '28px "Durik", monospace';
        textCtx.fillStyle = '#2c2c2c';
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'top';

        const lines = textElement.innerText.split('\n');
        const startX = textRect.left - rect.left + (textRect.width / 2);
        let yOffset = textRect.top - rect.top;
        const lineHeight = 45;

        lines.forEach(line => {
            textCtx.fillText(line, startX, yOffset);
            yOffset += lineHeight;
        });

        drawLens();
    }

    function drawLens() {
        if (!ctx || !textCanvas) return;

        ctx.clearRect(0, 0, lensCanvas.width, lensCanvas.height);

        const radius = 150;
        const x = lensX;
        const y = lensY;

        if (x === 0 && y === 0) {
            lensX = lensCanvas.width / 2;
            lensY = lensCanvas.height / 2;
            return;
        }

        ctx.save();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(textCanvas, 0, 0);

        ctx.restore();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#c0c0c0';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, radius - 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, radius - 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(192,192,192,0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        for (let i = 0; i < 12; i++) {
            const angle = (Date.now() / 800 + i) * 0.6;
            const r1 = radius - 18;
            const r2 = radius - 5;
            const x1 = x + Math.cos(angle) * r1;
            const y1 = y + Math.sin(angle) * r1;
            const x2 = x + Math.cos(angle + 0.4) * r2;
            const y2 = y + Math.sin(angle + 0.4) * r2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(255,215,0,0.3)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        const gradient = ctx.createRadialGradient(x - 25, y - 25, 10, x, y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(0.4, 'rgba(220,220,220,0.25)');
        gradient.addColorStop(0.7, 'rgba(180,180,180,0.12)');
        gradient.addColorStop(1, 'rgba(120,120,120,0.05)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - 4, y - 4, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    function animateLens() {
        drawLens();
        requestAnimationFrame(animateLens);
    }

    function onMouseMove(e) {
        const rect = container.getBoundingClientRect();
        lensX = e.clientX - rect.left;
        lensY = e.clientY - rect.top;
        drawLens();
    }

    function onMouseDown(e) {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        lensX = e.clientX - rect.left;
        lensY = e.clientY - rect.top;
        lensCanvas.style.cursor = 'grabbing';
        drawLens();
    }

    function onMouseUp() {
        isDragging = false;
        lensCanvas.style.cursor = 'grab';
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        setTimeout(createTextCanvas, 50);
    });

    lensCanvas.addEventListener('mousemove', onMouseMove);
    lensCanvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    lensCanvas.style.cursor = 'grab';

    setTimeout(() => {
        resizeCanvas();
        createTextCanvas();
        lensX = lensCanvas.width / 2;
        lensY