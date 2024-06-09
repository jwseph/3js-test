import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
<<<<<<< HEAD
scene.background = new THREE.Color(0xffffff); // 0x9bd2e8
=======
scene.background = new THREE.Color(0x9bd2e8);
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca

const camera = new THREE.OrthographicCamera(-innerWidth/2, innerWidth/2, innerHeight/2, -innerHeight/2, .000001, 1000);
camera.position.set(10, 10, 10);
camera.zoom = 100;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Resize support
window.addEventListener('resize', function () {
    renderer.setSize(innerWidth, innerHeight);
    [camera.left, camera.right] = [-innerWidth/2, innerWidth/2];
    [camera.top, camera.bottom] = [innerHeight/2, -innerHeight/2];
    camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = true;
controls.maxZoom = 400;
controls.minZoom = 20;
controls.minPolarAngle = controls.maxPolarAngle = Math.asin((2/3)**.5);
controls.update();

function getLights() {
<<<<<<< HEAD
    const ambLight = new THREE.AmbientLight(0x005396, 2);
=======
    const ambLight = new THREE.AmbientLight(0x005396, 3);
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
    const dirLight = new THREE.DirectionalLight(0xffbf00, 5);
    dirLight.castShadow = true;
    dirLight.position.set(3, 7, 1);
    let shadow = dirLight.shadow;
    shadow.mapSize.width = 512; // default
    shadow.mapSize.height = 512; // default
    shadow.camera.near = 0.01; // default
    shadow.camera.far = 500; // default
    shadow.camera.left = -20;
    shadow.camera.right = 20;
    shadow.camera.bottom = -20;
    shadow.camera.top = 20;

    const lights = new THREE.Group();
    lights.add(ambLight, dirLight);
    return lights;
}
scene.add(getLights());

function getLand() {
    const res = new THREE.Group();
    loader.load('./terrain-world-plain.glb', function (gltf) {
        const land = gltf.scene;
<<<<<<< HEAD

=======
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
        let m = .0003333333;
        land.scale.set(m, m, m);
        land.position.set(0, .12, 0);
        land.receiveShadow = true;
        land.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = child.receiveShadow = true;
                child.material.metalness = 0;
            }
        } );
<<<<<<< HEAD

=======
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
        res.add(land);
    }, undefined, function (error) {
        console.error(error);
    });
    return res;
}

const treeDictionary = {  // location, magnification, delta y
    'birch': ['./tree-birch.glb', 1/800, 0.12],
    'maple': ['./tree-maple.glb', 1/800, 0.12],
    'oak': ['./tree-oak.glb', 1/800, 0.12],
    'apple': ['./tree-round-apple.glb', 1/500, 0.12],
    'carnations': ['./carnations.glb', 1/500, 0.12],
    'tall': ['./tree-tall.glb', 1/500, 0.12],
    'birch-tall': ['./tree-birch-tall.glb', 1/500, 0.12],
    'forest': ['./tree-forest.glb', 1/500, 0.12],
    'lime': ['./tree-lime.glb', 1/500, 0.12],
    'little': ['./tree-little.glb', 1/500, 0.12],
    'simple': ['./tree-simple.glb', 1/500, 0.12],
    'spruce': ['./tree-spruce.glb', 1/500, 0.12],
    'cotton': ['./cotton.glb', 1/500, 0.12],
    'poisonous': ['./flower-poisonous.glb', 1/500, 0.12],
    'clumb': ['./grass-clumb.glb', 1/500, 0.12],
    'sea': ['./grass-sea.glb', 1/500, 0.12],
    'mushroom': ['./mushroom-toadstool.glb', 1/500, 0.12],
    'pumpkin-leaves': ['./pumkin-leaves.glb', 1/500, 0.12],
    'pumpkin': ['./pumkin.glb', 1/500, 0.12],
    'roses': ['./roses.glb', 1/500, 0.12],
    'shrub-flowers': ['./shrub-flowers.glb', 1/500, 0.12],
    'sunflower': ['./sunflower.glb', 1/500, 0.12],
    'wheat': ['./wheat-plant.glb', 1/500, 0.12],
    'tall': ['./tree-tall.glb', 1/500, 0.13],
};

<<<<<<< HEAD
function getTree(treeType, scale = 1, dead = false) {
=======
function getTree(treeType, scale = 1) {
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
    const res = new THREE.Group();
    let [location, m, y] = treeDictionary[treeType];
    m *= scale;
    loader.load(location, function (gltf) {
        const tree = gltf.scene.children[0];
        tree.scale.set(m, m, m);
        tree.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = child.receiveShadow = true;
                child.material.metalness = 0;
<<<<<<< HEAD
                if (dead) {
                    let color = child.material.color;
                    color.r = color.g = color.b = .3;
                }
=======
                let color = child.material.color;  // these two lines make the plant all black
                color.r = color.g = color.b = 0;  // 
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
            }
        });
        tree.position.set(0, y, 0);
        res.add(tree);
    }, undefined, function (error) {
        console.error(error);
    });
    return res;
}

const chunks = [];
<<<<<<< HEAD
function getChunk(x, z, treeType, scale, dead) {
=======
function getChunk(x, z) {
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
    const land = getLand();
    land.position.set(x, 0, z);
    land.receiveShadow = true;

<<<<<<< HEAD
    const tree = getTree(treeType, scale, dead);
=======
    const tree = getTree('birch');
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
    tree.position.set(x, 0, z);

    const chunk = new THREE.Group();
    chunk.add(land, tree);
    chunks.push(chunk);
    return chunk;
}

const loader = new GLTFLoader();

<<<<<<< HEAD
scene.add(getChunk(0, 0, 'birch', .4));
scene.add(getChunk(1, 0, 'oak', 1, true));
scene.add(getChunk(2, 0, 'maple', .5));
scene.add(getChunk(3, 0, 'oak', 0));
scene.add(getChunk(0, 1, 'oak', 0));
scene.add(getChunk(1, 1, 'lime', .5));
scene.add(getChunk(2, 1, 'oak', 0));
scene.add(getChunk(3, 1, 'sunflower', 1));
scene.add(getChunk(0, 2, 'shrub-flowers', 1));
scene.add(getChunk(1, 2, 'oak', 0));
scene.add(getChunk(2, 2, 'roses', 1));
scene.add(getChunk(3, 2, 'tall', .4, true));
scene.add(getChunk(0, 3, 'oak', 0));
scene.add(getChunk(1, 3, 'spruce', 1, true));
scene.add(getChunk(2, 3, 'birch-tall', 1));
scene.add(getChunk(3, 3, 'oak', 0));
=======
scene.add(getChunk(0, 0));
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca

function animate() {
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

const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('mousedown', function (e) {
    // sauce: https://stackoverflow.com/questions/7956442/detect-clicked-object-in-three-js
    e.preventDefault();
    const coords = new THREE.Vector2(
        (e.clientX / innerWidth) * 2 - 1,
        1 - 2 * (e.clientY / innerHeight),
    );
    raycaster.setFromCamera(coords, camera);

    for (const chunk of chunks) {
        const intersections = raycaster.intersectObjects([chunk], true);
        if (intersections.length) {
            console.log(chunk);
        }
    }
<<<<<<< HEAD
});
=======
});
>>>>>>> 4f48eb74d66db8efc77f8d29b5d8af85371756ca
