import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize,
        initDefaultBasicLight,
        degreesToRadians} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(15, 20, 15)); // Init camera in this position
initDefaultBasicLight(scene);
var pos = [0.0, 1.0, 0.0];

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(degreesToRadians(-90));
// add the plane to the scene
scene.add(plane);

// create a sphere
var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial({color:'rgb(255,0,0)'});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// position the sphere

var posx = 0.0;
var posy = 1.0;
var posz = 0.0;

sphere.position.set(0.0, 1.0, 0.0);
// add the sphere to the scene
scene.add(sphere);

var moviment = false;

var distXZ = 0;
var distXY = 0;
var percentx = 0;
var percenty = 0;
var percentz = 0;
var dist = 0;

function activate()
{
    if (posx != pos[0] || posy != pos[1] || posz != pos[2])
    {
        moviment = true;


        distXZ = Math.sqrt((Math.pow(pos[0]-posx),2) + (Math.pow(pos[2]-posz),2));
        distXY = Math.sqrt((Math.pow(pos[0]-posx),2) + (Math.pow(pos[1]-posy),2));
        
        dist = pos[0]-posx;
        percentx = Math.abs(dist/distXZ);
        dist = pos[1]-posy;
        percenty = Math.abs(dist/distXY);
        dist = pos[2]-posz;
        percentz = Math.abs(dist/distXZ);
    }
    // console.log(moviment)
    // console.log("X");
    // console.log(pos[0]);
    // console.log(posx);
    // console.log("Y");
    // console.log(pos[1]);
    // console.log(posy);
    // console.log("Z");
    // console.log(pos[2]);
    // console.log(posz);

}


function vec()
{
    if(moviment){
        var dir = 0;
        var vel = 0.03;
        var dist = 0;

        // Move X
        dist = pos[0]-posx;
        dir = Math.sign(dist);
        if (Math.abs(dist) >= 3*vel)
        { 
            // percent = Math.abs(dist/distXZ);
            posx += vel*dir*percentx;
            sphere.translateX(vel*dir*percentx);
        }else
        {
            posx = pos[0];
            sphere.translateX(vel*dist);
        }

        // Move Y
        dist = pos[1]-posy;
        dir = Math.sign(dist);
        if (Math.abs(dist) >= vel)
        {
            // percent = Math.abs(dist/distXY)
            posy += vel*dir*percenty;
            sphere.translateY(vel*dir*percenty);
        }else
        {
            posy = pos[1];
            sphere.translateY(vel*dir);
        }

        // Move Z
        dist = pos[2]-posz;
        dir = Math.sign(dist);
        if (Math.abs(dist) >= 3*vel)
        {   
            posz += vel*dir*percentz;
            sphere.translateZ(vel*dir*percentz);
        }else
        {
            posz = pos[2];
            sphere.translateZ(vel*dir);
        }


        if (posx == pos[0] && posy == pos[1] && posz == pos[2])
        {
            moviment = false;
            console.log(moviment)
            console.log("X");
            console.log(pos[0]);
            console.log(posx);
            console.log("Y");
            console.log(pos[1]);
            console.log(posy);
            console.log("Z");
            console.log(pos[2]);
            console.log(posz);
        }

    }
}

function buildInterface()
{
    var controls = new function ()
    {
      this.moveX = 0.0;
      this.moveY = 1.0;
      this.moveZ = 0.0;
      this.buttom = function(){
        activate();
        }
  
      this.position = function(){
        pos[0] = this.moveX;
        pos[1] = this.moveY;
        pos[2] = this.moveZ;
       // translate();
      };
    };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'moveX', -12.0, 12.0)
    .onChange(function() { controls.position() })
    .name("Move X");
  gui.add(controls, 'moveY', 1.0, 12.0)
    .onChange(function() { controls.position() })
    .name("Move Y");
  gui.add(controls, 'moveZ', -12.0, 12.0)
    .onChange(function() { controls.position() })
    .name("Move Z");
  gui.add(controls, 'buttom')
    .name("Mover");
}

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );


buildInterface();
render();


function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  vec();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}