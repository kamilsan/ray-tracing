# Ray Tracer
This is a basic recursive ray tracer that currently allows you to render a scenes with multiple ligts and objects. Every object has its own material, that specify things such as color, reflectivity index, etc. It can use **SSAA** if desired, with as many samples as you wish. Currently used lighting model is **Blinn-Phong** model.

Renderable objects' types are listed below:
* Sphere
* Plane
* Ellipse

Here are available light types:
* Directional Light
* Point Light
* Spot Light

Example:
```javascript
//Init scene with ambient light color
var scene = new Scene(new Vector(0.02, 0.02, 0.02));
var camera = new Camera(new Vector(0, 0, -1), new Vector(0, 0, 1),
                        new Vector(0, 1, 0));

//Define materials
var sphereMaterial = new Material(
    new Vector(1.0, 1.0, 1.0), //color
    0.01, //diffuse factor
    0.0, //specular factor
    124, //specular power
    0.99 //reflectivity index
);
var sphereMaterial2 = new Material(
    new Vector(0.5, 1.0, 0.5),
    1 / Math.PI,
    0.05,
    32,
    0
);
var sphereMaterial3 = new Material(
    new Vector(1.0, 0.5, 0.5),
    1 / Math.PI,
    0.05,
    32,
    0
);
var planeMaterial = new Material(
    new Vector(1.0, 1.0, 1.0),
    1 / Math.PI,
    0.05,
    32,
    0.0
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

//Adding ligths
scene.addLight(new PointLight(
    new Vector(0, 1, 0.5), //position
    new Vector(1, 1, 1), //color
    6, //intensity
    Attenuation.Default
));
scene.addLight(new DirectionalLight(
    new Vector(0, -1, 1), //direction
    new Vector(1, 1, 1), //color
    1, //intensity
    Attenuation.Default
));

var renderer = new RayTracer.Renderer(window.innerWidth,
                                      window.innerHeight);
renderer.SSAA = true;
renderer.SSAA_SAMPLES = 16;
renderer.RECURSION_DEPTH = 16;

var canvas = renderer.render(scene, camera);
document.body.appendChild(canvas);
```

Work in progress.
