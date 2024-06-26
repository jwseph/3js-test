import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLOT_WIDTH = 3

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-innerWidth/2, innerWidth/2, innerHeight/2, -innerHeight/2, .000001, 1000 );
camera.position.set(100, 100, 100);
camera.zoom = 100;
camera.updateProjectionMatrix();
camera.position.set(10, 10, 10);

window.camera = camera;

const camerahelper = new THREE.CameraHelper(camera)
scene.add(camerahelper)

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = false;
// controls.enablePan = false;
controls.maxZoom = 400;
controls.minZoom = 20;
// controls.maxDistance = 10;
controls.minPolarAngle = controls.maxPolarAngle = Math.asin((2/3)**.5);
controls.target = new THREE.Vector3(1, 0, 1)
controls.update();

window.addEventListener('resize', function () {
    renderer.setSize(innerWidth, innerHeight);
    [camera.left, camera.right] = [-innerWidth/2, innerWidth/2];
    [camera.top, camera.bottom] = [innerHeight/2, -innerHeight/2];
    camera.updateProjectionMatrix();
})
const getWidth = () => renderer.domElement.clientWidth;
const getHeight = () => renderer.domElement.clientHeight;

function getTerrain() {
    const geometry = new THREE.BoxGeometry(1, .25, 1);
    const material = new THREE.MeshPhongMaterial({color: 0x7bb61f});
    const terraingroup = new THREE.Group();
    for (let i = 0; i < PLOT_WIDTH; i++) {
        for(let y = 0; y < PLOT_WIDTH; y++){
            let temp = new THREE.Mesh(geometry, material);
            temp.position.set(i, 0, y);
            terraingroup.add(temp);
        }
    }
    return terraingroup;
}

const terrain = getTerrain();
terrain.receiveShadow = true;
console.log(terrain);
scene.add(terrain);

const dirLight = new THREE.DirectionalLight(0xF3BA30, .9); // soft white light
dirLight.castShadow = true;
dirLight.position.set(3, 7, 1);
let light = dirLight;
light.shadow.mapSize.width = 1024; // default
light.shadow.mapSize.height = 1024; // default
light.shadow.camera.near = 0.01; // default
light.shadow.camera.far = 50000; // default
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.bottom = -10;
light.shadow.camera.top = 10;

const shadowhelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(shadowhelper);

scene.add(dirLight);

const ambLight = new THREE.AmbientLight(0x2CDBFC, 0.4);
scene.add(ambLight);

const loader = new GLTFLoader();

function getTree(gltf) {
    const tree = gltf.scene.children[0];
    return tree;
}

loader.load('./Boab.glb', function (gltf) {
    const tree = getTree(gltf);
    let m = 1/32;
    tree.scale.set(m, m, m);
    tree.castShadow = true;
    scene.add(tree);
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    // cube.rotation.x += .01, cube.rotation.y += .01;
    // line.rotation.x += .01, line.rotation.y += .01;
    // if (shiba != null) shiba.rotation.x += .01, shiba.rotation.y += .01;
    controls.update();
    renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
	// Initiate function or other initializations here
    renderer.setAnimationLoop(animate);
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}

// CLICK DETECTION
const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('mousedown', function (e) {
    // sauce: https://stackoverflow.com/questions/7956442/detect-clicked-object-in-three-js
    e.preventDefault();
    const coords = new THREE.Vector2(
        (e.clientX / getWidth()) * 2 - 1,
        1 - 2 * (e.clientY / getHeight()),
    );
    raycaster.setFromCamera(coords, camera);
    const intersections = raycaster.intersectObjects(scene.children, true);
    if (intersections.length) {
        console.log(intersections);
    }
});