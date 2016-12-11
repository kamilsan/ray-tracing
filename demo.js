"use strict";

window.onload = webLoad;

function vignetting(color, x, y, width, height)
{
  var min = 0.7;
  var max = 1;

  var halfWidth = width * 0.5;
  var halfHeight = height * 0.5;

  var relX = x - halfWidth;
  var relY = y - halfHeight;

  halfWidth *= 1.2;//bigger range of light region
  halfHeight *= 1.2;

  var dist = relX * relX / (halfWidth * halfWidth) + relY * relY / (halfHeight * halfHeight);
  if(dist < 1)
  {
    var oneMinusDist = 1 - dist;
    var ratio = oneMinusDist * oneMinusDist * (max - min) + min;
    color.x *= ratio;
    color.y *= ratio;
    color.z *= ratio;
  }
  else
  {
    color.x *= min;
    color.y *= min;
    color.z *= min;
  }
}

function webLoad()
{
  var sphereMaterial = new Material(
    new Vector(1.0, 1.0, 1.0),
    0.01,
    0.0,
    124,
    0.99
  );
  var wallMaterial1 = new Material(
    new Vector(1.0, 0.5, 0.5),
    1 / Math.PI,
    0.01,
    64,
    0.0
  );
  var wallMaterial2 = new Material(
    new Vector(0.5, 0.5, 1.0),
    1 / Math.PI,
    0.01,
    64,
    0.0
  );
  var floorMaterial = new Material(
    new Vector(1.0, 1.0, 1.0),
    1 / Math.PI,
    0.01,
    64,
    0.0
  );

  var scene = new Scene(new Vector(0.02, 0.02, 0.02));
  var camera = new Camera(new Vector(0, 0, -1), new Vector(0, 0, 1), new Vector(0, 1, 0));

  scene.addObject(new Plane(
    new Vector(-2, 0, 1),
    new Vector(1, 0, 0),
    wallMaterial1
  ));
  scene.addObject(new Plane(
    new Vector(2, 0, 1),
    new Vector(-1, 0, 0),
    wallMaterial2
  ));
  scene.addObject(new Plane(
    new Vector(0, -1, 0),
    new Vector(0, 1, 0),
    floorMaterial
  ));
  scene.addObject(new Plane(
    new Vector(0, 0, 2),
    new Vector(0, 0, -1),
    floorMaterial
  ));
  scene.addObject(new Plane(
    new Vector(0, 0, -2),
    new Vector(0, 0, 1),
    floorMaterial
  ));
  scene.addObject(new Plane(
    new Vector(0, 2, 0),
    new Vector(0, -1, 0),
    floorMaterial
  ));
  scene.addObject(new Sphere(
    new Vector(-0.8, -0.5, 0.8),
    0.5,
    sphereMaterial
  ));
  scene.addObject(new Sphere(
    new Vector(0.6, -0.5, 0.3),
    0.5,
    sphereMaterial
  ));
  scene.addLight(new PointLight(
    new Vector(0, 0.9, 0),
    new Vector(1, 1, 1),
    35,
    Attenuation.Default
  ));

  var renderer = new RayTracer.Renderer(window.innerWidth, window.innerHeight);
  renderer.SSAA = false;
  renderer.SSAA_SAMPLES = 8;
  renderer.RECURSION_DEPTH = 4;
  renderer.MC_DEPTH = 1;
  renderer.MC_SAMPLES = 216;
  //renderer.postprocess = vignetting;

  var time = Date.now();

  var canvas = renderer.render(scene, camera);

  var deltaTime = (Date.now() - time) / 1000;
  console.log("Rendered in " + deltaTime.toFixed(3) + "s");

  document.body.appendChild(canvas);
}
