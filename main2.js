import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLOT_WIDTH = 3

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-innerWidth/4, innerWidth/4, innerHeight/4, -innerHeight/4, .000001, 1000 );
camera.position.set(100, 100, 100);
camera.zoom = 100;
const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
scene.add(hemiLight)

// scene.background = new THREE.Color(0x0CA6EA)
window.camera = camera;

const camerahelper = new THREE.CameraHelper(camera)
scene.add(camerahelper)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = true;
// controls.enablePan = false;
window.controls = controls;
controls.maxZoom = 400;
controls.minZoom = 20;
// controls.maxDistance = 10;
controls.minPolarAngle = controls.maxPolarAngle = Math.asin((2/3)**.5);
controls.target = new THREE.Vector3(0, 0, 0)
controls.update();

window.addEventListener('resize', function () {
    renderer.setSize(innerWidth, innerHeight);
    [camera.left, camera.right] = [-innerWidth/2, innerWidth/2];
    [camera.top, camera.bottom] = [innerHeight/2, -innerHeight/2];
    camera.updateProjectionMatrix();
})



const dirLight = new THREE.DirectionalLight(0xF9E30E, 10); // soft white light
dirLight.castShadow = true;
dirLight.position.set(3, 7, 1);
let light = dirLight;
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.01; // default
light.shadow.camera.far = 500; // default
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.bottom = -20;
light.shadow.camera.top = 20;

const shadowhelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(shadowhelper);

scene.add(dirLight);

const ambLight = new THREE.AmbientLight(0x2CDBFC, 5);
scene.add(ambLight);

const loader = new GLTFLoader();

var skyGeo = new THREE.SphereGeometry(400, 25, 25); 

var texloader  = new THREE.TextureLoader();
var texture = texloader.load( "./sky.jpg" );

var material = new THREE.MeshPhongMaterial({ 
    map: texture,
});

var sky = new THREE.Mesh(skyGeo, material);
sky.material.side = THREE.BackSide;
scene.add(sky);


function getTree(gltf) {
    const tree = gltf.scene.children[0];
    return tree;
}

loader.load('./tree-maple.glb', function (gltf) {
    const tree = getTree(gltf);
    let m = 1/800;
    tree.scale.set(m, m, m);
    tree.traverse( function( child ) { 
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    
    } );
    tree.castShadow = true;
    tree.position.set(0,0.13,0)
    scene.add(tree);
}, undefined, function (error) {
    console.error(error);
});

function getLand(){
    let result = new THREE.Group()
    loader.load('./terrain-world-plain.glb', function (gltf) {
        const land = gltf.scene;
        let m = 0.0003333333
        land.scale.set(m, m, m);
        land.position.set(0,0.12,0)
        land.receiveShadow = true;
        land.traverse( function( child ) { 

            if ( child.isMesh ) {
        
                child.castShadow = true;
                child.receiveShadow = true;
        
            }
        
        } );
        result.add(land)
    }, undefined, function (error) {
        console.error(error);
    });
    return result
}

function getTerrain() {
    const geometry = new THREE.BoxGeometry(1, .25, 1);
    const material = new THREE.MeshPhongMaterial({color: 0x7bb61f});
    const terraingroup = new THREE.Group();
    for (let i = 0; i < PLOT_WIDTH; i++) {
        for(let y = 0; y < PLOT_WIDTH; y++){
            let temp = getLand()
            temp.position.set(i-1, 0, y-1);
            temp.receiveShadow = true;
            terraingroup.add(temp);
        }
    }
    return terraingroup;
}

const terrain = getTerrain();
terrain.receiveShadow = true;
console.log(terrain);
scene.add(terrain);



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