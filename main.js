import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, .1, 1000);
camera.position.set(30, 50, 40);
camera.lookAt(0, 0, 0);

scene.background = new THREE.Color(0xfdfbd3);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.update();

window.addEventListener('resize', function () {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
})

function getCube() {
    const geometry = new THREE.BoxGeometry(200, 5, 200);
    const material = new THREE.MeshStandardMaterial({color: 0x00ff00, roughness: .2, metalness: .3});
    return new THREE.Mesh(geometry, material);
}

const cube = getCube();
cube.receiveShadow = true;
console.log(cube);
scene.add(cube);

function getLine() {
    const material = new THREE.LineBasicMaterial({color: 0xff0000})

    const points = [];
    points.push(new THREE.Vector3(-2, 0, 0), new THREE.Vector3(0, 0, 2));
    points.push(new THREE.Vector3(2, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geometry, material);
}

const line = getLine();
line.rotation.x = -Math.PI/2;
scene.add(line);

const dirLight = new THREE.DirectionalLight(0xfdfbd3, 2); // soft white light
dirLight.castShadow = true;
dirLight.position.set(0, 100, 0);
scene.add(dirLight)
let light = dirLight

//Set up shadow properties for the light
light.shadow.mapSize.width = 3000; // default
light.shadow.mapSize.height = 3000; // default
light.shadow.camera.top = 100;
light.shadow.camera.bottom = - 100;
light.shadow.camera.left = - 100;
light.shadow.camera.right = 100;
light.shadow.camera.near = 0.01;
light.shadow.camera.far = 10000;
light.shadow.bias = 0.0001;

const ambLight = new THREE.AmbientLight(0xfdfbd3, 1);
scene.add(ambLight);

// const loader = new GLTFLoader();
// loader.load('./Avocado/Avocado.gltf', function (gltf) {
//     console.log(gltf);
//     const avocado = gltf.scene.children[0];
//     console.log(avocado);
//     scene.add(avocado);
//     // scene.add(gltf.scene);
//     // renderer.render(scene, camera);
// },
// function (xhr) {
//     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// },
// function (error) {
//     console.error(error);
// });

const loader = new GLTFLoader();

// let shiba = null;
// loader.load( './shiba/scene.gltf', function ( gltf ) {
//     shiba = gltf.scene.children[0];
//     shiba.rotation.x = shiba.rotation.y = 0;
//     shiba.rotation.x = -Math.PI/2;
//     console.log(shiba);
// 	scene.add( gltf.scene );
// }, undefined, function ( error ) {
// 	console.error( error );
// } );

loader.load('./Tree.glb', function (gltf) {
    scene.add(gltf.scene);
    const tree = gltf.scene.children[0];
    tree.castShadow = true;
    tree.scale.set(30,30,30);
    tree.position.set(0,40,0)
}, undefined, function (error) {
    console.error(error);
});
loader.load('./Cloud Set.glb', function (gltf) {
    scene.add(gltf.scene);
    const clouds = gltf.scene.children[0];
    for(child of gltf.scene.children){
        child.scale.set(5,5,5);
    }
    
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