import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const plants_dictionary = {
    "birch":["./tree-birch.glb", 1/800, 0.12],
    "maple":["./tree-maple.glb", 1/800, 0.12],
    "oak":["./tree-oak.glb", 1/800, 0.12],
    "apple":["./tree-round-apple.glb", 1/500, 0.12],
    "carnations":["./carnations.glb", 1/500, 0.12],
    "tall":["./tree-tall.glb", 1/500, 0.12],
    "birch-tall":["./tree-birch-tall.glb", 1/500, 0.12],
    "forest":["./tree-forest.glb", 1/500, 0.12],
    "lime":["./tree-lime.glb", 1/500, 0.12],
    "little":["./tree-little.glb", 1/500, 0.12],
    "simple":["./tree-simple.glb", 1/500, 0.12],
    "spruce":["./tree-spruce.glb", 1/500, 0.12],
    "cotton":["./cotton.glb", 1/500, 0.12],
    "poisonous":["./flower-poisonous.glb", 1/500, 0.12],
    "clumb":["./grass-clumb.glb", 1/500, 0.12],
    "sea":["./grass-sea.glb", 1/500, 0.12],
    "mushroom":["./mushroom-toadstool.glb", 1/500, 0.12],
    "pumpkin-leaves":["./pumkin-leaves.glb", 1/500, 0.12],
    "pumpkin":["./pumkin.glb", 1/500, 0.12],
    "roses":["./roses.glb", 1/500, 0.12],
    "shrub-flowers":["./shrub-flowers.glb", 1/500, 0.12],
    "sunflower":["./sunflower.glb", 1/500, 0.12],
    "wheat":["./wheat-plant.glb", 1/500, 0.12],
    "tall":["./tree-tall.glb", 1/500, 0.13],
};

const plant_pos_dictionary = {
    "1":[-1,0,-1],
    "2":[-1,0,0],
    "3":[-1,0,1],
    "4":[0,0,-1],
    "5":[0,0,0],
    "6":[0,0,1],
    "7":[1,0,-1],
    "8":[1,0,0],
    "9":[1,0,1]
};

const PLOT_WIDTH = 3

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-innerWidth/4, innerWidth/4, innerHeight/4, -innerHeight/4, .000001, 1000 );
camera.position.set(10, 10, 10);
camera.zoom = 1;
const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
scene.add(hemiLight)
scene.add(camera)

scene.background = new THREE.Color(0x9bd2e8);

window.camera = camera;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = false;
controls.enablePan = false;
window.controls = controls;
controls.maxZoom = 400;
controls.minZoom = 100;
controls.minPolarAngle = controls.maxPolarAngle = Math.asin((2/3)**.5);
controls.target = new THREE.Vector3(0, 0, 0)
controls.update();

window.addEventListener('resize', function () {
    renderer.setSize(innerWidth, innerHeight);
    [camera.left, camera.right] = [-innerWidth/4, innerWidth/4];
    [camera.top, camera.bottom] = [innerHeight/4, -innerHeight/4];
    camera.updateProjectionMatrix();
})

const dirLight = new THREE.DirectionalLight(0xF9E30E, 5); // soft white light
dirLight.castShadow = true;
dirLight.position.set(3, 7, 1);
let light = dirLight;
light.shadow.mapSize.width = 1024; // default
light.shadow.mapSize.height = 1024; // default
light.shadow.camera.near = 0.001; // default
light.shadow.camera.far = 1000; // default
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

// var skyGeo = new THREE.SphereGeometry(400, 25, 25); 

// var texloader  = new THREE.TextureLoader();
// var texture = texloader.load( "./sky.jpg" );

// var material = new THREE.MeshPhongMaterial({ 
//     map: texture,
// });

// var sky = new THREE.Mesh(skyGeo, material);
// sky.material.side = THREE.BackSide;
// scene.add(sky);

const terraingroup = new THREE.Group();
const terrainarray = new Array(PLOT_WIDTH*PLOT_WIDTH)

function initialize_terrain() {
    for (let i = 0; i < PLOT_WIDTH*PLOT_WIDTH; i++) {
        const subterrain = new THREE.Group()
        terrainarray[i] = subterrain
        terraingroup.add(subterrain)
    }
    let j = 0
    for (let i = 0; i < PLOT_WIDTH; i++) {
        for(let y = 0; y < PLOT_WIDTH; y++){

            let temp = getLand()
            temp.position.set(i-1, 0, y-1);
            terrainarray[i+y+j].add(temp);
        }
        j += 2    
    }
}

function getTree(key, pos){
    let plant = plants_dictionary[key]
    let plant_pos = plant_pos_dictionary[pos]
    loader.load(plant[0], function (gltf) {
        const tree = gltf.scene;
        let m = plant[1]
        tree.scale.set(m, m, m);
        tree.position.set(plant_pos[0], plant[2], plant_pos[2])
        tree.receiveShadow = true;
        tree.traverse( function( child ) { 
            if ( child.isMesh ) {
                child.material.metalness = 0;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        terrainarray[pos-1].add(tree)
    }, undefined, function (error) {
        console.error(error);
    });
}

initialize_terrain()
scene.add(terraingroup);

getTree("birch", 1)
getTree("maple", 2)
getTree("oak", 3)
getTree("apple", 4)
getTree("tall", 5)
getTree("pumpkin", 6)
getTree("roses", 7)
getTree("cotton", 9)
getTree("mushroom", 8)

function getLand(){
    let result = new THREE.Group()
    loader.load('./terrain-world-plain.glb', function (gltf) {
        const land = gltf.scene;
        let m = 0.0003333333
        land.scale.set(m, m, m);
        land.position.set(0,0.12,0)
        land.receiveShadow = true;
        land.traverse( function( child ) { 
            if (child.isMesh) {
                child.material.metalness = 0;
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

let toAnimate
let drop = false

function dropAnimation() {
    toAnimate.translateY(-0.01)
    if (toAnimate.position.getComponent(1) <= 0.12){
        drop = false
        toAnimate.translateY(0.12-toAnimate.position.getComponent(1))
    }
}

var click = 0
function focus(plot) {
    console.log("focusing")
    var dict = plant_pos_dictionary[plot]
    controls.target = new THREE.Vector3(dict[0], 0.4, dict[2])
    for(let i = 0; i < PLOT_WIDTH*PLOT_WIDTH; i++) {
        if (i != plot-1) {
            terrainarray[i].visible = false;
        } else {
            terrainarray[i].visible = true;
        }
    }
    controls.minZoom = 200;
    terrainarray[plot-1].position.set(terrainarray[plot-1].position.getComponent(0), 0.3, terrainarray[plot-1].position.getComponent(2))
    toAnimate = terrainarray[plot-1]
    drop = true
}

function reconstruct() {
    for(let i = 0; i < PLOT_WIDTH*PLOT_WIDTH; i++) {
        terrainarray[i].visible = true;
        terrainarray[i].position.set(terrainarray[i].position.getComponent(0), 0.12, terrainarray[i].position.getComponent(2))
    }
    controls.target = new THREE.Vector3(0, 0, 0)
    controls.minZoom = 100;
    camera.zoom = 1;
}

function buttonclick() {
    if (click >= 9) {
        click = 1
    } else {
        click++
    }
    focus(click)
}

function buttonclick2() {
    reconstruct()
}

document.getElementById('button').addEventListener("click", function(e){
    buttonclick()
})

document.getElementById('button2').addEventListener("click", function(e){
    buttonclick2()
})

//Locks animations to 60 fps

let clock = new THREE.Clock();
let delta = 0;
let interval = 1 / 60;

function animate() {
    requestAnimationFrame(animate)
    delta += clock.getDelta();

    if (delta  > interval) {
        if (drop) {
            dropAnimation()
        }
        controls.update();
        
        renderer.render(scene, camera);
        
        delta = delta % interval;
    }
}

animate();

// if (WebGL.isWebGLAvailable()) {
// 	// Initiate function or other initializations here
//     renderer.setAnimationLoop(animate);
// } else {
// 	const warning = WebGL.getWebGLErrorMessage();
// 	document.getElementById( 'container' ).appendChild( warning );
// }