let scene, camera, renderer, model;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 500);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container-3d').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(0xffffff, 1);
    directLight.position.set(0, 200, 100);
    scene.add(directLight);

    const loader = new THREE.FBXLoader();
    loader.load('images/model.fbx', (object) => {
        model = object;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();