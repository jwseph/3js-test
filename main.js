import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, .1, 1000);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

function getCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    return new THREE.Mesh(geometry, material);
}

const cube = getCube();
console.log(cube);
// scene.add(cube);

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
let shiba = null;

loader.load( './shiba/scene.gltf', function ( gltf ) {
    shiba = gltf.scene.children[0];
    shiba.rotation.x = shiba.rotation.y = 0;
    shiba.rotation.x = -Math.PI/2;
    console.log(shiba);
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

function animate() {
    cube.rotation.x += .01, cube.rotation.y += .01;
    line.rotation.x += .01, line.rotation.y += .01;
    if (shiba != null) shiba.rotation.x += .01, shiba.rotation.y += .01;
    renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
	// Initiate function or other initializations here
    renderer.setAnimationLoop(animate);
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}