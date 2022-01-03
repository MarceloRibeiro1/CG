import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        onWindowResize, 
        degreesToRadians,
        createGroundPlaneWired,
        radiansToDegrees,
        initDefaultBasicLight,
        initCamera} from "../libs/util/util.js";


var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 40)");


var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0,80,0);
  camera.up.set( 0, 1, 0 );
var TrackballCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  TrackballCamera.lookAt(0, 0, 0);
  TrackballCamera.position.set(0,80,0);
  TrackballCamera.up.set( 0, 1, 0 );

scene.add(camera);
scene.add(TrackballCamera);
var cameraFree = false;


initDefaultBasicLight(scene,true);


{
    // Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
window.addEventListener( 'resize', function(){onWindowResize(TrackballCamera, renderer)}, false );

var groundPlane = createGroundPlaneWired(600, 600, 50, 50); // width and height
scene.add(groundPlane);

// Show text information onscreen
showInformation();
}
// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( TrackballCamera, renderer.domElement );
//trackballControls.target = group;


// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// position the cube
cube.position.set(8.0, 2.0, 8.0);
// add the cube to the scene
scene.add(cube);


{
//-------------------------------------------------------------------
// Start setting the group

var group = new THREE.Group();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );

// Set the parts of the pseudo-car
var body = createCylinder(2.0, 2.7, 10.0, 20, 20, false, 1);
  body.rotateX(degreesToRadians(90));
  body.position.set(0.0, 0.5, 0.0)

var axis1 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
  axis1.rotateZ(degreesToRadians(90));
  axis1.position.set(0.0, -1.0, 4.0);

var axis2 = createCylinder(0.3, 0.3, 7.0, 10, 10, false);
  axis2.rotateZ(degreesToRadians(90));
  axis2.position.set(0.0, -1.0, -4.0);

var roda1 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
  roda1.position.set( 3.5, -1.0, 4.0);

var roda2 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
  roda2.position.set(-3.5, -1.0, 4.0);

var roda3 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
  roda3.position.set(3.5, -1.0, -4.0);

var roda4 = createTorus(1.0, 0.3, 20, 20, Math.PI * 2);
  roda4.position.set(-3.5, -1.0, -4.0);

// Add objects to the group
group.add( axesHelper );
group.add( body );
group.add( axis1);
group.add( axis2);
group.add( roda1 );
group.add( roda2 );
group.add( roda3 );
group.add( roda4 );

// Add group to the scene
scene.add(group);

// Move all to the start position
group.translateY(2.3);
group.rotateY(degreesToRadians(-90));




function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, color)
{
  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
  var material;
  if(!color)
    material = new THREE.MeshPhongMaterial({color:"rgb(255,0,0)"});
  else
    material = new THREE.MeshPhongMaterial({color:"rgb(230,120,50)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
  return object;
}

function createTorus(radius, tube, radialSegments, tubularSegments, arc)
{
  var geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
  var material = new THREE.MeshPhongMaterial({color:"rgb(125,125,125)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.rotateY(degreesToRadians(90));
  return object;
}

}

render();

function keyboardUpdate() {

  keyboard.update();

  if ( keyboard.down("A") ) axesHelper.visible = !axesHelper.visible;

  if ( keyboard.pressed("up") )    group.translateZ(  1 );
  if ( keyboard.pressed("down") )  group.translateZ( -1 );

  if ( keyboard.down("S") ) console.log(radiansToDegrees(group.rotation.y))

  var angle = degreesToRadians(5);
  if ( keyboard.pressed("left") )  group.rotateY(  angle );
  if ( keyboard.pressed("right") ) group.rotateY( -angle );

}



function cameraControl()
{
  changeCamera();
  
  if (cameraFree)
    trackballControls.update();
  else
    cameraFollow();
}

function changeCamera()
{
  if ( keyboard.down("space") )
  {
    // Troca de camera
    cameraFree = !cameraFree;
    setupCamera();
  }
}

function setupCamera()
{
  
  if (!cameraFree)
    {
      // Quando desativado o trackball
      // Ativar outros objetos a serem visíveis
      cube.visible = true;
    }
    else 
    {
      // Quando ativado o trackball
      // Arrumar Posicao
      trackballControls.reset;
      trackballControls.target.set( group.position.x, group.position.y, group.position.z );
      TrackballCamera.up.set( 0,1,0 );
      TrackballCamera.position.set(group.position.x , 80, group.position.z + 80);
      TrackballCamera.lookAt(group.position);
      
      // Desativar visibilidade de outros objetos
      cube.visible = false;
    }
}



function cameraFollow()
{
  var objectToFollow = group;
  var dir = new THREE.Vector3();
  group.getWorldDirection(dir);
  camera.position.set(objectToFollow.position.x + dir.x*10, 80, objectToFollow.position.z + 80 + dir.z*10);
  camera.lookAt(objectToFollow.position.x + dir.x*10, 0, objectToFollow.position.z +dir.z*10);
}

function cameraRenderer ()
{
  if (cameraFree)
    renderer.render(scene, TrackballCamera);
  else
    renderer.render(scene, camera);
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Group Example");
    controls.addParagraph();
    controls.add("Use mouse to rotate/pan/zoom the camera");
    controls.add("Up / Arrow to walk");
    controls.add("Left / Right arrow to turn");
    controls.add("Press 'A' to show/hide axes");
    controls.show();
}


function render()
{
  stats.update(); // Update FPS
  keyboardUpdate();
  requestAnimationFrame(render); // Show events
  cameraControl();
  cameraRenderer(); // Render scene 
}
