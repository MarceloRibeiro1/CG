import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        createGroundPlane,
        onWindowResize,
        initDefaultDirectionalLighting,
        degreesToRadians} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(4, 4, 6)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var groundPlane = createGroundPlane(10, 10); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(0,-0.01,0);
//scene.add(groundPlane);

var light = initDefaultDirectionalLighting(scene, new THREE.Vector3(60, 60, 60));

var textureloader = new THREE.TextureLoader();
var textura1 = textureloader.load('../assets/textures/wood.png');
var textura2 = textureloader.load('../assets/textures/woodtop.png');

var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 , 1 , true );
var material = new THREE.MeshLambertMaterial({color:"rgb(255,255,255)",side:THREE.DoubleSide});
var cylinder = new THREE.Mesh(geometry, material);
cylinder.material.map = textura1;
cylinder.position.set(0,0.5,0);
scene.add(cylinder);

var geometry2 = new THREE.CircleGeometry( 0.5 , 32 );
var material2 = new THREE.MeshLambertMaterial({color:"rgb(255,255,255)",side:THREE.DoubleSide});

var circle = new THREE.Mesh(geometry2, material2);
circle.material.map = textura2;
circle.rotateX(Math.PI/2)
scene.add(circle);


var circle2 = new THREE.Mesh(geometry2, material2);
circle2.material.map = textura2;
circle2.position.set(0,1,0);
circle2.rotateX(Math.PI/2)
scene.add(circle2);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}