//Copyright (c) 2016 Kamil All Rights Reserved.

"use strict";

////////////////////
// Math
////////////////////

function Vector(x, y, z)
{
  this._x = x;
  this._y = y;
  this._z = z;
}

Vector.prototype =
{
  constructor: Vector,

  get x() { return this._x; },
  get y() { return this._y; },
  get z() { return this._z; },

  set x(value) { this._x = value; },
  set y(value) { this._y = value; },
  set z(value) { this._z = value; },

  lengthSq: function()
  {
    return this._x * this._x + this._y * this._y + this._z * this._z;
  },
  length: function()
  {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
  },
  normalize: function()
  {
    var len = this.length();
    if(len !== 0)
    {
      var l = 1 / len;
      this._x *= l;
      this._y *= l;
      this._z *= l;
    }
    return this;
  },
  dot: function(other)
  {
    return this._x * other.x + this._y * other.y + this._z * other.z;
  },
  cross: function(other)
  {
    return new Vector(
      this._y * other.z - this._z * other.y,
      this._z * other.x - this._x * other.z,
      this._x * other.y - this._y * other.x
    );
  },
  clamp: function(min, max)
  {
    if(this._x > max)
      this._x = max;
    else if(this._x < min)
      this._x = min;
    if(this._y > max)
      this._y = max;
    else if(this._y < min)
      this._y = min;
    if(this._z > max)
      this._z = max;
    else if(this._z < min)
      this._z = min;

    return this;
  },

  add: function(other)
  {
    this._x += other.x;
    this._y += other.y;
    this._z += other.z;
    return this;
  },
  sub: function(other)
  {
    this._x -= other.x;
    this._y -= other.y;
    this._z -= other.z;
    return this;
  },
  mul: function(r)
  {
    this._x *= r;
    this._y *= r;
    this._z *= r;
    return this;
  },
  div: function(r)
  {
    this._x /= r;
    this._y /= r;
    this._z /= r;
    return this;
  },

  clone: function()
  {
    return new Vector(this._x, this._y, this._z);
  },

  toString: function()
  {
    return "X: " + this._x + " Y: " + this._y + " Z: " + this._z;
  }
};


Vector.add = function(a, b)
{
  return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
};
Vector.sub = function(a, b)
{
  return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
};
Vector.mul = function(a, r)
{
  return new Vector(a.x * r, a.y * r, a.z * r);
};
Vector.div = function(a, r)
{
  return new Vector(a.x / r, a.y / r, a.z / r);
};
Vector.componetesMul = function(a, b) //useful for operations with colors
{
  return new Vector(a.x * b.x, a.y * b.y, a.z * b.z);
};
Vector.dot = function(a, b)
{
  return a.x * b.x + a.y * b.y + a.z * b.z;
};
Vector.cross = function(a, b)
{
  return new Vector(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
};
Vector.reflect = function(i, n)
{
  return Vector.sub(i, Vector.mul(n, 2*Vector.dot(i, n)));
};


function Ray(origin, direction)
{
  this._origin = origin.clone();
  this._direction = direction.clone().normalize();
}

Ray.prototype =
{
  constructor: Ray,

  get origin() { return this._origin; },
  get direction() { return this._direction; },

  set origin(value) { this._origin = value; },
  set direction(value) { this._direction = value.normalize(); },

  getPoint: function(t)
  {
    return this._origin.clone().add(this._direction.clone().mul(t));
  }
};

////////////////////
// Scene elements
////////////////////

function Camera(position, forward, up)
{
  this._position = position;
  this._forward = forward.clone().normalize();
  this._right = Vector.cross(up.clone().normalize(), this._forward);
  this._up = Vector.cross(this._forward, this._right);
}

Camera.prototype =
{
  constructor: Camera,

  get position() { return this._position; },
  get forward() { return this._forward; },
  get up() { return this._up; },
  get right() { return this._right; },

  set position(value) { this._position = value; },

  getCameraRay: function(x, y)
  {
    var direction = new Vector(x * this._right.x + y * this._up.x + this._forward.x,
                              x * this._right.y + y * this._up.y + this._forward.y,
                              x * this._right.z + y * this._up.z + this._forward.z);

    return new Ray(this._position.clone(), direction);
  }
};

function Scene(ambient)
{
  this._ambient = ambient;

  this._objects = [];
  this._lights = [];
}

Scene.prototype =
{
  constructor: Scene,

  get ambient() { return this._ambient; },
  get objects() { return this._objects; },
  get lights() { return this._lights; },

  set ambient(value) { this._ambient = value; },

  addObject: function(obj)
  {
    this._objects.push(obj);
  },

  addLight: function(light)
  {
    this._lights.push(light);
  }
};

////////////////////
// Material
////////////////////
function Material(color, kDiffuse, kSpecular, specularPower, kReflection)
{
  this._color = color;
  this._kDiffuse = kDiffuse;
  this._kSpecular = kSpecular;
  this._specularPower = specularPower;
  this._kReflection = kReflection;
}

Material.prototype =
{
  constructor: Material,

  get color() { return this._color; },
  get diffuseFactor() { return this._kDiffuse; },
  get specularFactor() { return this._kSpecular; },
  get specularPower() { return this._specularPower; },
  get reflectionFactor() { return this._kReflection; },

  set color(value) { this._color = value; },
  set diffuseFactor(value) { this._kDiffuse = value; },
  set specularFactor(value) { this._kSpecular = value; },
  set specularPower(value) { this._specularPower = value; },
  set reflectionFactor(value) { this._kReflection = value; }
};


function Attenuation(quadratic, linear, constant)
{
  this._quadratic = quadratic;
  this._linear = linear;
  this._constant = constant;
}

Attenuation.prototype =
{
  get quadratic() { return this._quadratic; },
  get linear() { return this._linear; },
  get constant() { return this._constant; },

  set quadratic(value) { this._quadratic = value; },
  set linear(value) { this._linear = value; },
  set constant(value) { this._constant = value; }
};

Attenuation.Default = new Attenuation(1, 0, 1);


/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            Lights
//   inherits form Light class and have virtual methods:
//  - { diffuse, specular } calcLighting(Vector intersectionPoint, Vector normal, Vector toEye),
//  - Ray getShadowRay(Vector intersectionPoint)
//  - bool isInShadow(Ray shadowRay, float t)
//  - float intensity (getter)
/////////////////////////////////////////////////////////////////////////////////////////////////////
function DirectionalLight(direction, color, intensity)
{
  this._direction = direction.normalize();
  this._color = color;
  this._intensity = intensity;
}

DirectionalLight.prototype =
{
  constructor: DirectionalLight,

  get direction() { return this._direction; },
  get color() { return this._color; },
  get intensity() { return this._intensity; },

  set direction(value) { this._direction = value.normalize; },
  set color(value) { this._color = value; },
  set intensity(value) { this._intensity = value; },


  //TODO:Probably change name
  calcLighting: function(intersectionPoint, normal, toEye)//virtual
  {
    var diffuse = Math.max(Vector.dot(this._direction.clone().mul(-1), normal), 0);
    var specular = 0;
    if(diffuse > 0)
    {
      var halfVector = toEye.clone().sub(this._direction).normalize();//toEye + (-direction)
      specular = Math.max(Vector.dot(halfVector, normal), 0.0);
    }

    return { diffuse: diffuse, specular: specular, attenuation: 1 };
  },

  getShadowRay: function(intersectionPoint)//virtual
  {
    return new Ray(intersectionPoint.clone().add(this._direction.clone().mul(-0.00000001)),
                            this._direction.clone().mul(-1));
  },

  isInShadow: function(shadowRay, t)//virtual
  {
    if(t <= 0) return false;
    return true;
  }
};

function PointLight(position, color, intensity, attenuation)
{
  this._position = position;
  this._color = color;
  this._intensity = intensity;
  this._attenuation = attenuation;
}

PointLight.prototype =
{
  constructor: PointLight,

  get position() { return this._position; },
  get color() { return this._color; },
  get intensity() { return this._intensity; },
  get attenuation() { return this._attenuation; },

  set position(value) { this._position = value; },
  set color(value) { this._color = value; },
  set intensity(value) { this._intensity = value; },
  set attenuation(value) { this._attenuation = value; },


  //TODO:Probably change name
  calcLighting: function(intersectionPoint, normal, toEye)//virtual
  {
    var toLight = Vector.sub(this._position, intersectionPoint);
    var length = toLight.length();
    toLight.div(length);//normalize

    var attenuation = 1 / (this._attenuation.quadratic * length * length +
                      this._attenuation.linear * length +
                      this._attenuation.constant);

    var lambertian = Vector.dot(toLight, normal);
    var specular = 0;
    var diffuse = 0;
    if(lambertian > 0)
    {
      diffuse = Math.max(lambertian, 0);
      var halfVector = Vector.add(toEye, toLight).normalize();
      specular = Math.max(Vector.dot(halfVector, normal), 0);
    }

    return { diffuse: diffuse, specular: specular, attenuation: attenuation };
  },

  getShadowRay: function(intersectionPoint)//virtual
  {
    var toLight = Vector.sub(this._position, intersectionPoint);
    return new Ray(intersectionPoint.clone().add(toLight.clone().normalize().mul(0.00000001)),
                            toLight);
  },

  isInShadow: function(shadowRay, t)//virtual
  {
    if(t <= 0) return false;
    var distSq = Vector.sub(this._position, shadowRay.origin).lengthSq();
    if(t * t < distSq) return true;
    else return false;
  }
};

function SpotLight(position, direction, angle, color, intensity, attenuation)
{
  this._position = position;
  this._direction = direction.normalize();
  this._cutoffAngle = angle;
  this._color = color;
  this._intensity = intensity;
  this._attenuation = attenuation;

  this._cosAngle = Math.cos(angle);
}

SpotLight.prototype =
{
  constructor: SpotLight,

  get position() { return this._position; },
  get direction() { return this._direction; },
  get cutoffAngle() { return this._cutoffAngle; },
  get color() { return this._color; },
  get intensity() { return this._intensity; },
  get attenuation() { return this._attenuation; },

  set position(value) { this._position = value; },
  set direction(value) { this._direction = value.normalize(); },
  set cutoffAngle(value) { this._cutoffAngle = value; this._cosAngle = Math.cos(value); },
  set color(value) { this._color = value; },
  set intensity(value) { this._intensity = value; },
  set attenuation(value) { this._attenuation = value; },


  //TODO:Probably change name
  calcLighting: function(intersectionPoint, normal, toEye)//virtual
  {
    var toLight = Vector.sub(this._position, intersectionPoint);
    var length = toLight.length();
    toLight.div(length);

    var attenuation = 1 / (this._attenuation.quadratic * length * length +
                      this._attenuation.linear * length +
                      this._attenuation.constant);
    var diffuse = Math.max(Vector.dot(toLight, this._direction.clone().mul(-1)), 0.0);
    var specular = 0;
    if(diffuse < this._cosAngle)
    {
      diffuse = 0;
    }
    else
    {
      diffuse = (diffuse - this._cosAngle) / this._cosAngle;

      var halfVector = Vector.add(toEye, toLight).normalize();
      specular = Math.max(Vector.dot(halfVector, normal), 0.0);
    }

    return { diffuse: diffuse, specular: specular, attenuation: attenuation };
  },

  getShadowRay: function(intersectionPoint)//virtual
  {
    var toLight = Vector.sub(this._position, intersectionPoint);
    return new Ray(intersectionPoint.clone().add(toLight.clone().normalize().mul(0.00000001)),
                            toLight);
  },

  isInShadow: function(shadowRay, t)//virtual
  {
    if(t <= 0) return false;
    var distSq = Vector.sub(this._position, shadowRay.origin).lengthSq();
    if(t * t < distSq) return true;
    else return false;
  }
};
////////////////////////////////////////////////////////
//                     Objects
//Classes that would be inherited from Object class
//they should have this virtual methods:
//  - Vector getNormalAt(Vector point)
//  - float  intersects(Ray ray)
//They also have to have material with its getter
///////////////////////////////////////////////////////
function Sphere(center, radius, material)
{
  this._center = center;
  this._radius = radius;
  this._material = material;
}

Sphere.prototype =
{
  constructor: Sphere,

  get center() { return this._center; },
  get radius() { return this._radius; },
  get material() { return this._material; },

  set center(value) { this._center = value; },
  set radius(value) { this._radius = value; },
  set material(value) { this._material = value; },

  intersects: function(ray)
  {
    var centerToOrigin = ray.origin.clone().sub(this._center);
    var b = 2 * Vector.dot(ray.direction, centerToOrigin);
    var c = Vector.dot(centerToOrigin, centerToOrigin) - this._radius * this._radius;
    var delta = b*b - 4*c;
    if(delta < 0)
      return -1;

    delta = Math.sqrt(delta);
    var t1 = (-b - delta) / 2;
    var t2 = (-b + delta) / 2;
    return (t1 < t2 ? t1 : t2);
  },
  getNormalAt: function(point)
  {
    return point.clone().sub(this._center).div(this._radius);
  }
};

function Plane(point, normal, material)
{
  this._point = point;
  this._normal = normal;
  this._material = material;
}

Plane.prototype =
{
  constructor: Plane,

  get point() { return this._point; },
  get normal() { return this._normal; },
  get material() { return this._material; },

  set point(value) { this._point = value; },
  set normal(value) { this._normal = value; },
  set material(value) { this._material = value; },

  intersects: function(ray)//virtual
  {
    var t = -1;
    var denominator = Vector.dot(this._normal, ray.direction);
    if(denominator !== 0)
    {
      t = -Vector.dot(this._normal, Vector.sub(ray.origin, this._point)) / denominator;
    }
    return t;
  },

  getNormalAt: function(point)//it is a virtual method
  {
    return this._normal;
  }
};

//Experimental
function Ellipse(center, normal, tangent, horizontalRadius, verticalRadius, material)
{
  this._center = center;

  //Gram-Schmidt orthonormalization
  this._normal = normal.clone().normalize();
  this._tangent = tangent.clone().sub(this._normal.clone().mul(Vector.dot(tangent, this._normal))).normalize();

  this._horizontalRadiusSq = horizontalRadius * horizontalRadius;
  this._verticalRadiusSq = verticalRadius * verticalRadius;
  this._material = material;
}

Ellipse.prototype =
{
  constructor: Ellipse,

  get center() { return this._center; },
  get normal() { return this._normal; },
  get tangent() { return this._tangent; },
  get horizontalRadius() { return Math.sqrt(this._horizontalRadiusSq); },
  get verticalRadius() { return Math.sqrt(this._verticalRadiusSq); },
  get material() { return this._material; },

  set center(value) { this._center = value; },
  set normal(value) { this._normal = value; },
  set tangent(value) { this._tangent = value; },
  set horizontalRadius(value) { this._horizontalRadiusSq = value * value; },
  set verticalRadius(value) { this._verticalRadiusSq = value * value; },
  set material(value) { this._material = value; },

  intersects: function(ray)//virtual
  {
    var t = -1;
    var denominator = Vector.dot(this._normal, ray.direction);
    if(denominator !== 0)
    {
      t = -Vector.dot(this._normal, Vector.sub(ray.origin, this._center)) / denominator;

      var intersectionPoint = ray.getPoint(t);
      var distVector = intersectionPoint.clone().sub(this._center);
      var distXSq = distVector.dot(this._tangent);
      distXSq *= distXSq;
      var distYSq = distVector.lengthSq() - distXSq;//Pythagoras
      var d = distXSq / this._horizontalRadiusSq + distYSq / this._verticalRadiusSq;
      if(d > 1)
        t = -1;//reject
    }
    return t;
  },

  getNormalAt: function(point)//it is a virtual method
  {
    return this._normal;
  }
};

//Function used in sampling
function getSampleVector(r1, r2)
{
  var sinTheta = Math.sqrt(1 - r1 * r1);//r1 = cos(theta)
  var phi = 2 * Math.PI * r2;
  var x = sinTheta * Math.cos(phi);
  var z = sinTheta * Math.sin(phi);
  return new Vector(x, r1, z);
}
//As above
function createCoordinationSystem(normal)
{
  var tangent;
  if(Math.abs(normal.x) > Math.abs(normal.y))
      tangent = (new Vector(normal.z, 0, -normal.x)).div(normal.z * normal.z + normal.x * normal.x);
  else
      tangent = (new Vector(0, -normal.z, normal.y)).div(normal.z * normal.z + normal.y * normal.y);
  var bitangent = normal.cross(tangent);

  return { tangent: tangent, bitangent: bitangent };
}

//The name of the game!
//TODO: Probably I should put more stuff in it and name this more fancy then just "RayTracer"
var RayTracer = {};
RayTracer.traceRay = function(ray, scene, camera, depth, mcDepth, samples)
{
  var color = new Vector(0, 0, 0);

  //Depth test - finding closest object
  var minT = 1e12, currentT;
  var object = null;
  for(var i = 0; i < scene.objects.length; ++i)
  {
    currentT = scene.objects[i].intersects(ray);
    if(currentT > 0 && currentT < minT)
    {
      minT = currentT;
      object = scene.objects[i];
    }
  }

  if(object !== null)
  {
    var intersectionPoint = ray.getPoint(minT);
    var normal = object.getNormalAt(intersectionPoint);

    var toEye = camera.position.clone().sub(intersectionPoint).normalize();

    if(object.material.reflectionFactor > 0 && depth > 0)
    {
      var viewReflected = Vector.reflect(toEye.clone().mul(-1), normal);
      //below: small bias to prevent self intersection
      var reflectionRay = new Ray(intersectionPoint.clone().add(viewReflected.clone().mul(0.00000001)), viewReflected);
      var reflectionColor = RayTracer.traceRay(reflectionRay, scene, camera, depth - 1, mcDepth, samples);
      color.add(reflectionColor.mul(object.material.reflectionFactor));
    }

    color.add(Vector.componetesMul(object.material.color, scene.ambient));

    //Path tracing below!
    //It is using Monte Carlo for estimating integral in rendering equation
    var indirectLighting = new Vector(0, 0, 0);
    if(mcDepth > 0 && samples > 0)
    {
      var basis = createCoordinationSystem(normal);
      var cosTheta;
      var sampleVector, sampleTransformed, mcRay;
      for(var i = 0; i < samples; ++i)
      {
        cosTheta = Math.random();//This value will be used to genarate random sample and in rendering equation
        sampleVector = getSampleVector(cosTheta, Math.random());
        sampleTransformed = new Vector(sampleVector.x * basis.tangent.x + sampleVector.y * normal.x + sampleVector.z * basis.bitangent.x,
                                       sampleVector.x * basis.tangent.y + sampleVector.y * normal.y + sampleVector.z * basis.bitangent.y,
                                       sampleVector.x * basis.tangent.z + sampleVector.y * normal.z + sampleVector.z * basis.bitangent.z);
        mcRay = new Ray(intersectionPoint.clone().add(sampleTransformed.clone().mul(0.000001)), sampleTransformed);
        indirectLighting.add(RayTracer.traceRay(mcRay, scene, camera, depth, mcDepth - 1, samples).mul(cosTheta));
      }
      indirectLighting.mul(2 / samples);//x/(1/2pi)/pi = 2xpi/pi = 2x
      color.add(Vector.componetesMul(object.material.color, indirectLighting).mul(object.material.diffuseFactor));
    }

    //Direct illumination
    for(var n = 0; n < scene.lights.length; ++n)
    {
      var shadowRay = scene.lights[n].getShadowRay(intersectionPoint);
      var inShadow = false;
      //Searching for objects occluding light
      for(var i = 0; i < scene.objects.length; ++i)
      {
        var t = scene.objects[i].intersects(shadowRay);
        if(scene.lights[n].isInShadow(shadowRay, t))
        {
          inShadow = true;
          break;
        }
      }
      if(!inShadow)
      {
        var lighting = scene.lights[n].calcLighting(intersectionPoint, normal, toEye);

        color.add(Vector.componetesMul(scene.lights[n].color, object.material.color).mul(
          lighting.diffuse * lighting.attenuation * scene.lights[n].intensity * object.material.diffuseFactor / Math.PI));
        color.add(Vector.mul(scene.lights[n].color, scene.lights[n].intensity *
          object.material.specularFactor * lighting.attenuation * Math.pow(lighting.specular, object.material.specularPower)));
      }
    }
    //color.clamp(0.0, 1.0);
  }
  return color;
};

RayTracer.Renderer = function(width, height)
{
  this._width = width;
  this._height = height;

  this._aspectRatio = width / height;
  this._halfWidth = width / 2;
  this._halfHeight = height / 2;

  this._SSAA = false;
  this._SSAA_SAMPLES = 16;
  this._RECURSION_DEPTH = 8;
  this._MC_DEPTH = 1;
  this._MC_SAMPLES = 32;

  //Experimental!
  this._postprocess = function(color, x, y, width, height) {};
}

RayTracer.Renderer.prototype =
{
  constructor: RayTracer.Renderer,

  get width() { return this._width; },
  get height() { return this._height; },
  get postprocess() { return this._postprocess; },//Experimental!
  get SSAA() { return this._SSAA; },
  get SSAA_SAMPLES() { return this._SSAA_SAMPLES; },
  get RECURSION_DEPTH() { return this._RECURSION_DEPTH; },
  get MC_DEPTH() { return this._MC_DEPTH; },
  get MC_SAMPLES() { return this._MC_SAMPLES; },

  set width(value)
  {
    this._width = value;
    this._aspectRatio = this._width / this._height;
    this._halfWidth = this._width / 2;
  },
  set height(value)
  {
    this._height = value;
    this._aspectRatio = this._width / this._height;
    this._halfHeight = this._height / 2;
  },
  set postprocess(value) { this._postprocess = value; },//Experimental!
  set SSAA(value) { this._SSAA = value; },
  set SSAA_SAMPLES(value) { this._SSAA_SAMPLES = value; },
  set RECURSION_DEPTH(value) { this._RECURSION_DEPTH = value; },
  set MC_DEPTH(value) { this._MC_DEPTH = value; },
  set MC_SAMPLES(value) { this._MC_SAMPLES = value; },

  render: function(scene, camera)
  {
    var canvas = document.createElement("canvas");
    var width = canvas.width = this._width;
    var height = canvas.height = this._height;

    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, width, height);

    var cameraRay;
    var scaledX, scaledY;
    for(var y = 0; y < height; ++y)
    {
      for(var x = 0; x < width; ++x)
      {
        var i = (y * width + x) * 4;
        var color = new Vector(0, 0, 0);
        if(i % 200 === 0)
          document.title = "Ray Tracing - " + (100 * i / (width * height * 4)).toFixed(2).toString() + "%";
        if(this._SSAA)
        {
          for(var n = 0; n < this._SSAA_SAMPLES; ++n)
          {
            var jitterX = Math.random() - 0.5;
            var jitterY = Math.random() - 0.5;

            scaledX = this._aspectRatio * (x - this._halfWidth + jitterX) / this._halfWidth;
            scaledY = -(y - this._halfHeight + jitterY) / this._halfHeight;

            cameraRay = camera.getCameraRay(scaledX, scaledY);
            color = color.add(RayTracer.traceRay(cameraRay, scene, camera, this._RECURSION_DEPTH, this._MC_DEPTH, this._MC_SAMPLES));

            this._postprocess(color, x, y, this._width, this._height);
          }
          color.mul(255 / this._SSAA_SAMPLES);
        }
        else
        {
          scaledX = this._aspectRatio * (x - this._halfWidth) / this._halfWidth;
          scaledY = -(y - this._halfHeight) / this._halfHeight;

          cameraRay = camera.getCameraRay(scaledX, scaledY);
          color = RayTracer.traceRay(cameraRay, scene, camera, this._RECURSION_DEPTH, this._MC_DEPTH, this._MC_SAMPLES);

          this._postprocess(color, x, y, this._width, this._height);
          color.mul(255);
        }

        imageData.data[i] = Math.round(color.x);
        imageData.data[i + 1] = Math.round(color.y);
        imageData.data[i + 2] = Math.round(color.z);
        imageData.data[i + 3] = 255;
      }
    }
    context.putImageData(imageData, 0, 0);

    return canvas;
  }
};
