(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Background = function() {
	this.particleColor = "";
	this.backgroundColor = "";
	this.renderer = Pixi.Renderer(window.innerWidth,window.innerHeight);
	this.renderer.view.style.background = "#ffffff";
	var segments = window.location.href.split("?")[1];

	if(segments === undefined){
		var url = window.location.href + "?bgcolor=0x333333&particlecolor=0xffffff/";
		segments = url.split("?")[1];
	}

	segments = segments.split("/")[0];
	var params = segments.split("&");
	var _g1 = 0;
	var _g = params.length;
	while(_g1 < _g) {
		var i = _g1++;
		var param = params[i].split("=");
		if(param[0] == "bgcolor") this.backgroundColor = param[1];
		if(param[0] == "particlecolor") this.particleColor = param[1];
	}
	this.stage = Pixi.Stage(this.backgroundColor);
	window.document.querySelector("body").appendChild(this.renderer.view);
	this.system = new ParticleSystem(200,this.stage,this.particleColor);
	this.system.addForce();
	this.events();
	this.run();
};
Background.prototype = {
	events: function() {
		var _g = this;
		var resize = function(e) {
			_g.renderer.view.width = window.innerWidth;
			_g.renderer.view.height = window.innerHeight;
		};
		var mousemove = function(e1) {
			_g.mouseX = (e1.clientX - window.innerWidth / 2) * 0.5;
			_g.mouseY = (e1.clientY - window.innerHeight / 2) * 0.5;
		};
		window.addEventListener("mousemove",mousemove);
		window.addEventListener("resize",resize);
	}
	,run: function() {
		this.requestAnimationFrame($bind(this,this.run));
		this.system.draw();
		this.renderer.render(this.stage);
	}
	,requestAnimationFrame: function(method) {
		var requestAnimationFrame = ($_=window,$bind($_,$_.requestAnimationFrame));
		if(requestAnimationFrame == null) requestAnimationFrame = function(method1) {
			window.setTimeout(method1,16.6666666666666679);
		};
		requestAnimationFrame(method);
	}
};
var base = {};
base.DisplayObject = function() {
	this.boundries = { x : 0, y : 0};
	this.frictionAir = 0.01;
	this.friction = 0.1;
	this.restitution = 0;
	this.density = 0.001;
	this.sleepThreshold = 60;
	this.motion = 0;
	this.isSleeping = false;
	this.isStatic = false;
	this.angularVelocity = 0;
	this.angularSpeed = 0;
	this.speed = 0;
	this.torque = 0;
	this.force = { };
	this.mass = 10.0;
	this.acceleration = new math.Vector();
	this.velocity = new math.Vector();
	this.position = new math.Vector();
};
base.DisplayObject.prototype = {
	addForce: function(force) {
		var copy = force.clone();
		copy.divideScalar(this.mass);
		this.acceleration.add(copy);
	}
	,update: function() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.checkBoundries();
		this.acceleration.reset();
	}
	,setBoundries: function(xBounds,yBounds) {
		this.boundries.x = xBounds;
		this.boundries.y = yBounds;
	}
	,checkBoundries: function() {
		if(this.position.x > this.boundries.x) {
			this.position.x = this.boundries.x;
			this.velocity.x *= -1;
		} else if(this.position.x < 0) {
			this.velocity.x *= -1;
			this.position.x = 0;
		}
		if(this.position.y > this.boundries.y) {
			this.position.y = this.boundries.y;
			this.velocity.y *= -1;
		} else if(this.position.y < 0) {
			this.velocity.y *= -1;
			this.position.y = 0;
		}
	}
	,getVelocity: function() {
		return this.velocity;
	}
	,distanceCheck: function(target) {
	}
};
var Particle = function(x,y,radius,color) {
	if(radius == null) radius = 4;
	if(y == null) y = 10;
	if(x == null) x = 10;
	this.maxforce = 2;
	this.maxspeed = 0.5;
	var _g = this;
	base.DisplayObject.call(this);
	this.graphics = new PIXI.Graphics;
	this.lineGraphics = new PIXI.Graphics;
	if(color) this.particleColor = color; else this.particleColor = 65280;
	this.radius = radius;
	this.graphics.beginFill(this.particleColor);

	this.lineGraphics.lineStyle(2,65280,1);

	this.graphics.drawCircle(x,y,radius);
	this.setBoundries(window.innerWidth,window.innerHeight);
	this.position.x = Std.random(window.innerWidth);
	this.position.y = Std.random(window.innerHeight);
	var resize = function(e) {
		_g.setBoundries(window.innerWidth,window.innerHeight);
	};
	window.addEventListener("resize",resize);
};
Particle.__super__ = base.DisplayObject;
Particle.prototype = $extend(base.DisplayObject.prototype,{
	setColor: function(color) {
		this.graphics.beginFill(color);
	}
	,setNeighbors: function(neighbors) {
		this.neighbors = neighbors;
	}
	,flock: function() {
		var sep = this.seperate();
		sep.multiplyScalar(1.5);
		this.addForce(sep);
	}
	,addTo: function(stage) {
		stage.addChild(this.graphics);
		this.stage = stage;
	}
	,draw: function() {
		this.update();
		this.graphics.position.x = this.position.x;
		this.graphics.position.y = this.position.y;
	}
	,seperate: function() {
		var desiredseperation = 25.0;
		var steer = new math.Vector();
		var count = 0;
		this.stage.addChild(this.lineGraphics);
		var _g1 = 0;
		var _g = this.neighbors.length;
		while(_g1 < _g) {
			var i = _g1++;
			var other = this.neighbors[i];
			var d = math.Vector.dist(this.position,other.position);
			if(d < 50) {
				this.lineGraphics.clear();
				this.lineGraphics.lineStyle(2,65280,1);
				this.lineGraphics.moveTo(this.position.x + this.radius + 4,this.position.y + this.radius + 5);
				this.lineGraphics.lineTo(other.position.x + this.radius + 4,other.position.y + this.radius + 5);
			} else if(d > 1200) this.lineGraphics.clear();
			if(d > 0 && d < desiredseperation) {
				var diff = math.Vector.sub(this.position,other.position);
				diff.normalize();
				diff.divideScalar(d);
				steer.add(diff);
				count++;
			}
		}
		if(count > 0) steer.divideScalar(count);
		if(steer.mag() > 0) {
			steer.normalize();
			steer.multiplyScalar(this.maxspeed);
			steer.subtract(this.velocity);
			steer.limit(this.maxforce);
		}
		return steer;
	}
});
var ParticleSystem = function(num,stage,color) {
	this.children = [];
	var _g = 0;
	while(_g < num) {
		var i = _g++;
		var particle = new Particle(10,10,4,color);
		particle.addTo(stage);
		this.children.push(particle);
	}
	var _g1 = 0;
	var _g2 = this.children.length;
	while(_g1 < _g2) {
		var i1 = _g1++;
		var child = this.children[i1];
		child.setNeighbors(this.children);
	}
};
ParticleSystem.prototype = {
	setColor: function(color) {
		var _g1 = 0;
		var _g = this.children.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.children[i].setColor(color);
		}
	}
	,addForce: function() {
		var _g1 = 0;
		var _g = this.children.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.children[i].addForce(new math.Vector(Math.cos(Std.random(99)),Std.random(99),0));
		}
	}
	,draw: function() {
		var _g1 = 0;
		var _g = this.children.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.children[i].flock();
			this.children[i].draw();
		}
	}
};
var Pixi = function() { };
Pixi.Renderer = function(width,height,options) {
	return new PIXI.autoDetectRenderer(width,height,options);
};
Pixi.Stage = function(color) {
	return new PIXI.Stage(color);
};
var Runner = function() { };
Runner.main = function() {
	var background = new Background();
};
var Std = function() { };
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var math = {};
math.Vector = function(x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
};
math.Vector.sub = function(v1,v2) {
	var vec = new math.Vector(v1.x - v2.x,v1.y - v2.y,v1.z - v2.z);
	return vec;
};
math.Vector.dist = function(vec1,vec2) {
	var x = vec2.x - vec1.x;
	var y = vec2.y - vec1.y;
	var z = vec2.z - vec1.z;
	return Math.sqrt(x * x + y * y + z * z);
};
math.Vector.prototype = {
	clone: function() {
		return new math.Vector(this.x,this.y,this.z);
	}
	,copy: function(vec) {
		this.x = vec.x;
		this.y = vec.y;
		this.z = vec.z;
		return this;
	}
	,add: function(vec) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
	}
	,subtract: function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
		return this;
	}
	,multiply: function(vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		this.z *= vec.z;
		return this;
	}
	,multiplyScalar: function(val) {
		this.x *= val;
		this.y *= val;
		this.z *= val;
	}
	,divide: function(vec) {
		this.x /= vec.x;
		this.y /= vec.y;
		this.z /= vec.z;
		return this;
	}
	,divideScalar: function(val) {
		this.x /= val;
		this.y /= val;
		this.z /= val;
	}
	,reset: function() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	,distance: function(vec) {
		var x = vec.x - this.x;
		var y = vec.y - this.y;
		var z = vec.z - this.z;
		return Math.sqrt(x * x + y * y + z * z);
	}
	,distanceSquared: function(vec) {
		var x = vec.x - this.x;
		var y = vec.y - this.y;
		var z = vec.z - this.z;
		return x * x + y * y + z * z;
	}
	,normalize: function() {
		var x = this.x;
		var y = this.y;
		var z = this.z;
		var len = x * x + y * y + z * z;
		if(len > 0) {
			len = 1 / Math.sqrt(len);
			this.x *= len;
			this.y *= len;
			this.z *= len;
		}
		return this;
	}
	,lerp: function(vec,t) {
		this.x = this.x + t * (vec.x - this.x);
		this.y = this.y + t * (vec.y - this.y);
		this.z = this.z + t * (vec.z - this.z);
		return this;
	}
	,rotateX: function(vec,rot) {
		var p = [];
		var r = [];
		p[0] = this.x - vec.x;
		p[1] = this.y - vec.y;
		p[2] = this.z - vec.z;
		r[0] = p[0];
		r[1] = p[1] * Math.cos(rot) - p[2] * Math.sin(rot);
		r[2] = p[1] * Math.sin(rot) + p[2] * Math.cos(rot);
		this.x = r[0];
		this.y = r[1];
		this.z = r[2];
		return this;
	}
	,rotateY: function(vec,rot) {
		var p = [];
		var r = [];
		p[0] = this.x - vec.x;
		p[1] = this.y - vec.y;
		p[2] = this.z - vec.z;
		r[0] = p[2] * Math.sin(rot) + p[0] * Math.cos(rot);
		r[1] = p[1];
		r[2] = p[2] * Math.cos(rot) - p[0] * Math.sin(rot);
		this.x = r[0];
		this.y = r[1];
		this.z = r[2];
		return this;
	}
	,rotateZ: function(vec,rot) {
		var p = [];
		var r = [];
		p[0] = this.x - vec.x;
		p[1] = this.y - vec.y;
		p[2] = this.z - vec.z;
		r[0] = p[0] * Math.cos(rot) - p[1] * Math.sin(rot);
		r[1] = p[0] * Math.sin(rot) + p[1] * Math.cos(rot);
		r[2] = p[2];
		this.x = r[0];
		this.y = r[1];
		this.z = r[2];
		return this;
	}
	,limit: function(max) {
		if(this.magSq() > max * max) {
			this.normalize();
			this.multiplyScalar(max);
		}
	}
	,mag: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,magSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	,str: function() {
		return "vec3(" + this.x + ", " + this.y + ", " + this.z + ")";
	}
};
math._Vector = {};
math._Vector.Vec3_Impl_ = function() { };
math._Vector.Vec3_Impl_._new = function() {
	return new math.Vector();
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
Runner.main();
})();
