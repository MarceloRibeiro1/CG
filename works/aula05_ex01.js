import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians, 
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(2.18, 1.62, 3.31);
  camera.up.set( 0, 1, 0 );
var objColor = "rgb(255,20,20)";
var objShininess = 200;

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(10.0, 10.0, 50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)", shininess:"200"});
  material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

// Torus
var geometryTorus = new THREE.TorusGeometry(3.0,0.05,10,50,2*Math.PI);
var materialTorus = new THREE.MeshPhongMaterial({color:"rgb(150,75,0)", shininess:"200"})
var torus = new THREE.Mesh(geometryTorus, materialTorus);
  torus.castShadow = false;
  torus.rotateX(degreesToRadians(90));
  torus.position.set(0.0, 2.0, 0.0);
scene.add(torus);


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Control available light and set the active light
var lightIntensity = 1.0;


//---------------------------------------------------------
// Default light position, color, ambient color and intensity

var ambientColor = "rgb(50,50,50)";

var lightPositionR = new THREE.Vector3(3.0, 0.0, 0);
var lightColorR = "rgb(255,0,0)";

var lightPositionG = new THREE.Vector3(0.0, 0.0, 3.0);
var lightColorG = "rgb(0,255,0)";

var lightPositionB = new THREE.Vector3(-3.0, 0.0, 0.0);
var lightColorB = "rgb(0,0,255)";


var sphere = new THREE.SphereGeometry(0.08, 10, 10, 0, Math.PI * 2, 0, Math.PI);

var lightSphereR = createSphere(sphere,torus,lightColorR,lightPositionR);
var lightSphereG = createSphere(sphere,torus,lightColorG,lightPositionG);
var lightSphereB = createSphere(sphere,torus,lightColorB,lightPositionB);

function createSphere(spheregeometry, scene, sphereColor, position)
{
  var material = new THREE.MeshBasicMaterial({color:sphereColor});
  var object = new THREE.Mesh(spheregeometry, material);
    object.visible = true;
    object.position.copy(position);
  scene.add(object);

  return object;
}

// Sphere to represent the light
//var lightSphere = createLightSphere(scene, 0.05, 10, 10, lightPosition);


//---------------------------------------------------------
// Create and set all lights. Only Spot and ambient will be visible at first

var spotLightR = new THREE.SpotLight(lightColorR);
setSpotLight(spotLightR, lightPositionR);

var spotLightG = new THREE.SpotLight(lightColorG);
setSpotLight(spotLightG, lightPositionG);

var spotLightB = new THREE.SpotLight(lightColorB);
setSpotLight(spotLightB, lightPositionB);



// More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add( ambientLight );

buildInterface();
render();

// Set Point Light
// More info here: https://threejs.org/docs/#api/en/lights/PointLight


// Set Spotlight
// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
function setSpotLight(light, position)
{
  light.position.copy(position);
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.angle = degreesToRadians(40);    
  light.castShadow = true;
  light.decay = 2;
  light.penumbra = 0.5;
  light.name = "Spot Light"

  torus.add(light);

}

// Set Directional Light
// More info here: https://threejs.org/docs/#api/en/lights/DirectionalLight



// Update light intensity of the current light

function updateLightIntensity()
{
  spotLightR.intensity = lightIntensity;
  spotLightG.intensity = lightIntensity;
  spotLightB.intensity = lightIntensity;
}

function updateLight(light, sphere)
{
  sphere.visible = !sphere.visible;
  light.visible = !light.visible;
}


function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    this.shininess = objShininess;
    this.lightIntensity = lightIntensity;
    this.ambientLight = true;

    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
    this.onEnableAmbientLight = function(){
      ambientLight.visible = this.ambientLight;
    };
    this.onUpdateShininess = function(){
      material.shininess = this.shininess;
    };
    
    this.onUpdateLightIntensity = function(){
      lightIntensity = this.lightIntensity;
      updateLightIntensity();
    };
  };

  var gui = new GUI();
  gui.add(controls, 'shininess', 0, 1000)
    .name("Obj Shininess")
    .onChange(function(e) { controls.onUpdateShininess() });
  gui.add(controls, 'viewAxes', false)
    .name("View Axes")
    .onChange(function(e) { controls.onViewAxes() });
  gui.add(controls, 'lightIntensity', 0, 5)
    .name("Light Intensity")
    .onChange(function(e) { controls.onUpdateLightIntensity() });
  gui.add(controls, 'ambientLight', true)
    .name("Ambient Light")
    .onChange(function(e) { controls.onEnableAmbientLight() });
}

var angleR = 0;
var angleG = 0;
var angleB = 0;

function keyboardUpdate()
{
  keyboard.update();

  
  lightSphereR.matrixAutoUpdate = false;
  lightSphereG.matrixAutoUpdate = false;
  lightSphereB.matrixAutoUpdate = false;
  spotLightR.matrixAutoUpdate = false;
  spotLightG.matrixAutoUpdate = false;
  spotLightB.matrixAutoUpdate = false;
  
  var mat4 = new THREE.Matrix4();

  lightSphereR.matrix.identity();
  lightSphereG.matrix.identity();
  lightSphereB.matrix.identity();
  spotLightR.matrix.identity();
  spotLightG.matrix.identity();
  spotLightB.matrix.identity();
  
  lightSphereR.matrix.multiply(mat4.makeRotationZ( degreesToRadians( angleR ) ));
  lightSphereR.matrix.multiply(mat4.makeTranslation(3.0, 0.0, 0.0));

  spotLightR.matrix.multiply(mat4.makeRotationZ( degreesToRadians( angleR ) ));
  spotLightR.matrix.multiply(mat4.makeTranslation(3.0, 0.0, 0.0));

  lightSphereG.matrix.multiply(mat4.makeRotationZ( degreesToRadians( angleG ) ));
  lightSphereG.matrix.multiply(mat4.makeTranslation(-3.0, 0.0, 0.0));

  spotLightG.matrix.multiply(mat4.makeRotationZ( degreesToRadians( angleG ) ));
  spotLightG.matrix.multiply(mat4.makeTranslation(-3.0, 0.0, 0.0));

  lightSphereB.matrix.multiply(mat4.makeRotationZ( degreesToRadians( angleB ) ));
  lightSphereB.matrix.multiply(mat4.makeTranslation(0.0, 3.0, 0.0));

  spotLightB.matrix.multiply(mat4.makeRotationZ( degreesToRadians( angleB ) ));
  spotLightB.matrix.multiply(mat4.makeTranslation(0.0, 3.0, 0.0));
  


  if ( keyboard.pressed("D") )
  {
    angleR --;
    spotLightR.lookAt(0,0,0)
  }
  if ( keyboard.pressed("A") )
  {
    angleR ++;
    spotLightR.lookAt(0,0,0)
  }
  if ( keyboard.down("W") )  updateLight(spotLightR,lightSphereR);
  
  if ( keyboard.pressed("J") )
  {
    angleG ++;
    spotLightG.lookAt(0,0,0)
  }
  if ( keyboard.pressed("L") )
  {
    angleG --;
    spotLightG.lookAt(0,0,0)
  }
  if ( keyboard.down("I") )  updateLight(spotLightG,lightSphereG);
  
  if ( keyboard.pressed("left") )
  {
    angleB ++;
    spotLightB.lookAt(0,0,0)
  }
  if ( keyboard.pressed("right") )
  {
    angleB --;
    spotLightB.lookAt(0,0,0)
  }
  if ( keyboard.down("up") )  updateLight(spotLightB,lightSphereB);
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Luzes RGB");
    controls.addParagraph();
    controls.add("Teclas AD movem a luz Vermelha");
    controls.add("Tecla W desativa luz Vermelha");
    controls.add("Teclas JL movem a luz Verde");
    controls.add("Tecla I desativa luz Verde");
    controls.add("Teclas Direita Esquerda movem a luz Azul");
    controls.add("Tecla Cima desativa luz Azul");
    controls.show();
}

function render()
{
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
