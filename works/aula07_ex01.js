import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
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
//scene.add( axesHelper );

var groundPlane = createGroundPlane(10, 10); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(0,-0.01,0);
scene.add(groundPlane);

var light = initDefaultDirectionalLighting(scene, new THREE.Vector3(10, 10, 10));

var textureloader = new THREE.TextureLoader();
var textura = textureloader.load('../assets/textures/marble.png');

var planeGeometry = new THREE.PlaneGeometry(1.0, 1.0, 10, 10);
var planeMaterial = new THREE.MeshLambertMaterial({color:"rgb(255,255,255)",side:THREE.DoubleSide});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);


var alpha = 0.5;
var planeMaterialAlpha = new THREE.MeshLambertMaterial({color:"red", opacity: alpha, transparent: true});


var face1 = createFace(planeGeometry,planeMaterial,new THREE.Vector3(0,0,0),new THREE.Vector3(Math.PI/2,0,0),textura)
var face2 = createFace(planeGeometry,planeMaterial,new THREE.Vector3(0,1,0),new THREE.Vector3(Math.PI/2,0,0),textura)

var face3 = createFace(planeGeometry,planeMaterial,new THREE.Vector3(0.5,0.5,0),new THREE.Vector3(0,Math.PI/2,0),textura)
var face4 = createFace(planeGeometry,planeMaterial,new THREE.Vector3(-0.5,0.5,0),new THREE.Vector3(0,Math.PI/2,0),textura)

var face5 = createFace(planeGeometry,planeMaterial,new THREE.Vector3(0,0.5,-0.5),new THREE.Vector3(0,0,Math.PI/2),textura)
var face6 = createFace2(planeGeometry,planeMaterialAlpha,new THREE.Vector3(0,0.5,0.5),new THREE.Vector3(0,0,Math.PI/2),textura)



function createFace(geo,mat,pos,rot,tex){
    var face = new THREE.Mesh(geo,mat)
        face.position.set(pos.x,pos.y,pos.z);
        face.rotation.set(rot.x,rot.y,rot.z);
        face.material.map = tex;
    scene.add(face);

    return face;
}
function createFace2(geo,mat,pos,rot,tex){
  var face = new THREE.Mesh(geo,mat)
      face.position.set(pos.x,pos.y,pos.z);
      face.rotation.set(rot.x,rot.y,rot.z);
      //face.material.map = tex;
  scene.add(face);

  return face;
}

buildInterface();

function buildInterface()
{
  var controls = new function ()
  {
    this.alpha = alpha;
    this.changeAlpha = function(){
      planeMaterialAlpha.opacity = this.alpha;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'alpha', 0.00, 1)
    .onChange(function(e) { controls.changeAlpha() })
    .name("Change Alpha");
}

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