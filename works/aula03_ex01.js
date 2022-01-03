
import * as THREE from  '../build/three.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
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
  camera.position.set(3.6, 4.6, 8.2);
  camera.up.set( 0, 1, 0 );

var cameraHolder = new THREE.Object3D();
  cameraHolder.add(camera);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(200, 200, 30, 30, "rgb(30,40 , 50)"); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create 3D representation of the camera (cube and cone)
var cameraObj = createCameraObject();


render();

var cubeAxesHelper = new THREE.AxesHelper(9);
cameraHolder.add(cubeAxesHelper);

var cubeAxesHelper = new THREE.AxesHelper(9);
cameraObj.add(cubeAxesHelper);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );
function createCameraObject()
{
  var matBody = new THREE.MeshPhongMaterial({color:"rgb(255, 0, 0)"});    
  var matLens = new THREE.MeshPhongMaterial({color:"rgb(255, 255, 0)"});        

  var cBody = new THREE.BoxGeometry(.2, .2, .2);
  var body = new THREE.Mesh(cBody, matBody);

  var cLens = new THREE.ConeGeometry(0.1, 0.2, 20);
  var lens = new THREE.Mesh(cLens, matLens);
    lens.rotateX(degreesToRadians(90));
    lens.position.set(0.0, 0.0, -0.1);
  body.add(lens); // Add lens to the body of the camera

  scene.add(body); // Add camera object to scene
  return body;
}


// Updates de 3D object that represents the virtual camera 
// and the camera helper


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

  if ( keyboard.pressed("A") )     cameraHolder.rotateY(  0.01 );
	if ( keyboard.pressed("D") )    cameraHolder.rotateY( -0.01 );
	if ( keyboard.pressed("W") )       cameraHolder.rotateX(  0.01 );
	if ( keyboard.pressed("S") )     cameraHolder.rotateX( -0.01 );
	if ( keyboard.pressed("Q") )   cameraHolder.rotateZ( 0.01 );
	if ( keyboard.pressed("E") ) cameraHolder.rotateZ( -0.01 );

	if ( keyboard.pressed("shift") )    cameraHolder.translateZ(  -0.5 );
}

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
  trackballControls.update();
  controlledRender();
  mov();
  requestAnimationFrame(render);
}
