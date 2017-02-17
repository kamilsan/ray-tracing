# Ray Tracing
This is a basic recursive ray tracing that currently allows you to render scenes with multiple lights and objects. Every object has its own material, that specify things such as albedo, reflectivity index and emittance. It can use **SSAA** if desired (Box filter), with as many samples as you want. **Lambert's BRDF** is used.

Indirect illumination uses Monte Carlo estimator with **Importance Sampling (cosine weighted)**. Path lenghts can be chosen (MC_DEPTH), as well as number of samples (MC_SAMPLES).

Area light samples are uniformly distributed. Multiple Importance Sampling is **NOT** used.

Renderable objects' types are listed below:
* Sphere
* Plane
* Ellipse
* Rectangle

Here are available light types:
* Directional Light
* Point Light
* Spot Light
* Area Light (emissive object)

Example:
```javascript
//Init scene without ambient light color
var scene = new Scene(new Vector(0.0, 0.0, 0.0));
var camera = new Camera(new Vector(0, 0, -1), new Vector(0, 0, 1),
                        new Vector(0, 1, 0));

//Define materials
var sphereMaterial = new Material(
    new Vector(1.0, 1.0, 1.0), //color
    0.01, //diffuse factor
    0.99, //reflectivity index
    new Vector(0, 0, 0) //emittance
);
var sphereMaterial2 = new Material(
    new Vector(0.5, 1.0, 0.5),
    1 / Math.PI,
    0,
    new Vector(0, 0, 0)
);
var sphereMaterial3 = new Material(
    new Vector(1.0, 0.5, 0.5),
    1 / Math.PI,
    0,
    new Vector(0, 0, 0)
);
var planeMaterial = new Material(
    new Vector(1.0, 1.0, 1.0),
    1 / Math.PI,
    0.0,
    new Vector(0, 0, 0)
);
var lightMaterial = new Material(
  new Vector(1, 1, 1),
  1 / Math.PI,
  0,
  new Vector(150, 150, 167)
);

//Adding objects to the scene
scene.addObject(new Plane(
    new Vector(0, -1, 0), //position
    new Vector(0, 1, 0), //normal
    planeMaterial //material
));
scene.addObject(new Sphere(
    new Vector(-0.2, -0.5, 1), //center
    0.5, //radius
    sphereMaterial
));
scene.addObject(new Sphere(
    new Vector(0.8, -0.5, 0.2),
    0.5,
    sphereMaterial2
));
scene.addObject(new Sphere(
    new Vector(-1.5, -0.5, 1),
    0.5,
    sphereMaterial3
));

//Adding area light
scene.addObject(new Rectangle(
  new Vector(-0.4, 1.999999, -0.3),
  new Vector(0, -1, 0),
  new Vector(1, 0, 0),
  0.8,
  0.6,
  lightMaterial
));

var renderer = new RayTracer.Renderer(window.innerWidth,
                                      window.innerHeight);
renderer.SSAA = true;
renderer.SSAA_SAMPLES = 16;
renderer.RECURSION_DEPTH = 6;
renderer.MC_DEPTH = 2;
renderer.MC_SAMPLES = 6;
renderer.AREA_LIGHT_SAMPLES = 12;

var canvas = renderer.render(scene, camera);
document.body.appendChild(canvas);
```

Work in progress.
