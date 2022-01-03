import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import {initRenderer, 
        initDefaultSpotlight,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians,
        initDefaultDirectionalLighting} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
  //var clock = new THREE.Clock();  
var light = initDefaultDirectionalLighting(scene, new THREE.Vector3(60, 60, 60)); // Use default light
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(-10, 80, 0);
  camera.position.set(0,100,130);
  camera.up.set( 0, 1, 0 );
var objColor = "rgb(200, 129, 0)";





// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(60, 60); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Object Material
var objectMaterial = new THREE.MeshPhongMaterial({color:"rgb(0,255,0)"});
  objectMaterial.side =  THREE.DoubleSide; // Show front and back polygons

//----------------------------------
// Create Extrude Geometry
//----------------------------------
var extrudeSettings =
{
  depth: 5,
  bevelEnabled: false,
};

var extrudeGeometry = new THREE.ExtrudeGeometry(smileShape(), extrudeSettings);
var object = new THREE.Mesh(extrudeGeometry, objectMaterial);
  object.castShadow = true;
//scene.add(object);

object.translateY(4.0);
object.rotateZ(degreesToRadians(180));

buildInterface();
render();

function smileShape()
{
  var smileyShape = new THREE.Shape();
    smileyShape.absarc( 0.0, 0.0, 4.0, 0, Math.PI * 2, false );

  var smileyEye1Path = new THREE.Path();
    smileyEye1Path.absellipse( -1.5, -2.0, 1.0, 1.0, 0, Math.PI * 2, true );

  var smileyEye2Path = new THREE.Path();
    smileyEye2Path.absarc( 1.5, -2.0, 1.0, 0, Math.PI * 2, true );

  var smileyMouthPath = new THREE.Path();
    smileyMouthPath.moveTo( -2.0, 0.0 );
    smileyMouthPath.quadraticCurveTo( 0.0, 2.0, 2.0, 0.0 )
    smileyMouthPath.bezierCurveTo( 3.0, 0.5, 3.0, 1.0, 2.0, 2.0 )
    smileyMouthPath.quadraticCurveTo( 0.0, 4.0, -2.0, 2.0 )
    smileyMouthPath.quadraticCurveTo( -3.5, 1.0, -2.0, 0.0 );

  smileyShape.holes.push( smileyEye1Path );
  smileyShape.holes.push( smileyEye2Path );
  smileyShape.holes.push( smileyMouthPath );

  return smileyShape;
}

// ---------------------- TORRE ---------------------
var torre = buildTorre();
    scene.add(torre);

function buildTorre()
{
    var objectMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)"});
        objectMaterial.side =  THREE.DoubleSide;

    var points = [];
    for( var i = 0; i < 20; i++)
    {
      points.push(new THREE.Vector2(6.8-Math.log(i/10), i/10));
    }
        points.push(new THREE.Vector2(6, 2));
        points.push(new THREE.Vector2(6, 10));
        points.push(new THREE.Vector2(5, 10));
        points.push(new THREE.Vector2(3, 50));


    var segments = 20;
    var phiStart = 0;
    var phiLength = 2 * Math.PI;
    var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    var torre = new THREE.Mesh(latheGeometry, objectMaterial);
        torre.castShadow = true;
    return torre;
}

// ---------------------- MOTOR ---------------------

var cubeMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,0,0)"});


var numPoints = 30;
var objectSize = 10;
var localPoints = generatePoints(numPoints);
var convexGeometry = new ConvexGeometry(localPoints);

var motor = new THREE.Mesh(convexGeometry, cubeMaterial);
motor.position.set(0.0, 50.0, 0.0);
motor.rotateX(Math.PI/2)
torre.add(motor);

function generatePoints(numberOfPoints)
{
  var points = [];
  var maxSize = objectSize;
  for (var i = 0; i < numberOfPoints; i++) {
    var randomX = Math.round(-maxSize + Math.random() * maxSize*2);
    var randomY = Math.round(-15 + Math.random() * maxSize*3); //
    var randomZ = Math.round(-maxSize + Math.random() * maxSize*2);
    points.push(new THREE.Vector3(randomX, randomY, randomZ));
  }

  return points;
}


// ---------------------- PONTA ---------------------
var ponta = buildPonta();
ponta.position.set(0,50,10)
ponta.rotateX(Math.PI/2)
    motor.add(ponta);


function buildPonta()
{
    var pointsPonta = [];
    var numberOfPoints = 7;
    for (var i = 0; i < numberOfPoints; i++) {
        var equacao = -0.3*Math.pow(i,2)+11;
      pointsPonta.push(new THREE.Vector2(i, equacao));
    }

    var objectMaterialPonta = new THREE.MeshPhongMaterial({color:"rgb(255,0,0)"});
        objectMaterialPonta.side =  THREE.DoubleSide;

    var segments = 20;
    var phiStart = 0;
    var phiLength = 2 * Math.PI;
    var latheGeometry = new THREE.LatheGeometry(pointsPonta, segments, phiStart, phiLength);
    var torre = new THREE.Mesh(latheGeometry, objectMaterialPonta);
        torre.castShadow = true;
        
    return torre;
}


// ---------------------- PA ---------------------

var extrudeSettingsPa =
{
  depth: 23,
  bevelEnabled: true,
  steps: 10,
  bevelThickness: 1,
	bevelSize: 0.3,
	bevelOffset: -0.1,
	bevelSegments: 2
};

var shapePa = new THREE.ExtrudeGeometry(buildPa(), extrudeSettingsPa);
var pa1 = new THREE.Mesh(shapePa, objectMaterial);
  pa1.castShadow = true;
  pa1.rotateZ(Math.PI/2);
  pa1.translateX(8.5);
  pa1.translateY(-2.0);
  pa1.translateZ(1.5);
  ponta.add(pa1);
//scene.add(pa1);
var pa2 = new THREE.Mesh(shapePa, objectMaterial);
  pa2.castShadow = true;
  pa2.rotateZ(Math.PI/2);
  pa2.rotateX(degreesToRadians(120))
  pa2.translateX(8.5);
  pa2.translateY(-2.0);
  pa2.translateZ(1.5);
  ponta.add(pa2);

var pa3 = new THREE.Mesh(shapePa, objectMaterial);
  pa3.castShadow = true;
  pa3.rotateZ(Math.PI/2);
  pa3.rotateX(degreesToRadians(-120))
  pa3.translateX(8.5);
  pa3.translateY(-2.0);
  pa3.translateZ(1.5);
  ponta.add(pa3);

function buildPa()
{
    var retanguloPa = new THREE.Shape();
        retanguloPa.lineTo(0.0,1.0)
        retanguloPa.bezierCurveTo(1.0,1.5,-1.0,-1.0,1.0,4.0)
        retanguloPa.lineTo(1.0,3.0)
        retanguloPa.bezierCurveTo(1.0,0.5,-0.1,-1.0,0.0,0.0)

    return retanguloPa;
}



// ---------------------- ROTACAO ---------------------
var rotation = true;
var velocity = 3;
var angle = degreesToRadians(3);

function rotate()
{
  if (rotation)
  {
    angle += degreesToRadians(velocity);

    ponta.matrixAutoUpdate = false;

    var mat4 = new THREE.Matrix4();
  
    ponta.matrix.identity();

    ponta.matrix.multiply(mat4.makeRotationY(angle));
    ponta.matrix.multiply(mat4.makeTranslation(0,10,0));
  }

}


function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewObject = true;
    this.viewAxes = false;
    this.toggle = true;
    this.vel = 3;

    this.onViewObject = function(){
      object.visible = this.viewObject;
    };
    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
    this.toggleRotation = function(){
      rotation = !rotation;
    };
    this.changeVel = function(){
      velocity = this.vel;
      //rotate();
    };
  };

  var gui = new GUI();
  gui.add(controls, 'viewObject', true)
    .name("View Object")
    .onChange(function(e) { controls.onViewObject() });
  gui.add(controls, 'viewAxes', false)
    .name("View Axes")
    .onChange(function(e) { controls.onViewAxes() });
  gui.add(controls, 'toggle')
    .name("Toggle rotation")
    .onChange(function(e) { controls.toggleRotation();});
  gui.add(controls, 'vel', 0.1, 10)
    .name("Velocity")
    .onChange(function(e) { controls.changeVel();});
}

function render()
{
  stats.update();
  trackballControls.update();
  rotate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
