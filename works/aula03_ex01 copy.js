
import * as THREE from  '../build/three.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

scene.add( new THREE.HemisphereLight() ); 

// To use the keyboard
var keyboard = new KeyboardState();

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0.0, 0.0, 1.0);
  camera.up.set( 0, 1, 0 );

var cameraHolder = new THREE.Object3D();
  cameraHolder.position.set(0.0,2.0,0.0);
  cameraHolder.rotateY(degreesToRadians(45));
  cameraHolder.add(camera);

scene.add(cameraHolder);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(200, 200, 30, 30, "rgb(30,40 , 50)"); // width, height, resolutionW, resolutionH
 // groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);


// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );


function controlledRender()
{
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, camera);   
}

function mov(){

  keyboard.update();

  if ( keyboard.pressed("A") )     cameraHolder.rotateY(  0.03 );
	if ( keyboard.pressed("D") )    cameraHolder.rotateY( -0.03 );
	if ( keyboard.pressed("W") )       cameraHolder.rotateX(  -0.03 );
	if ( keyboard.pressed("S") )     cameraHolder.rotateX( 0.03 );
	if ( keyboard.pressed("Q") )    cameraHolder.rotateZ( 0.03 );
	if ( keyboard.pressed("E") )     cameraHolder.rotateZ( -0.03 );    
	if ( keyboard.pressed("shift") )    cameraHolder.translateZ(  -0.5 );
}
render();

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Flying Camera");
  controls.addParagraph();
  controls.add("Shift to move");
  controls.add(" W / S arrows to rotate X");
  controls.add(" A / D arrows to rotate Y");
  controls.add("Q / E to rotate Z");
  controls.add("Press O to show axes");
  controls.show();

function render()
{
  controlledRender();
  mov();
  requestAnimationFrame(render);
}
