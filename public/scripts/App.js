/**
 * A very simple Vector definition with support up to
 * 3 values.
 *
 * By Joseph Chow
 * @param x x value
 * @param y y value
 * @param z z value
 * @returns {Vector}
 * @constructor
 */

var Vector = function(x,y,z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.stablize();
    return this;
};

Vector.prototype = {
    add:function(newVector){
        this.x += newVector.x;
        this.y += newVector.y;
        this.z += newVector.z;

        this.stablize();

        return this;
    },

    subtract:function(newVector,_return){
        if(_return){
            var x = this.x - newVector.x;
            var y = this.y - newVector.y;
            var z = this.z - newVector.z;
            var v = new Vector(x,y,z);

            v.stablize();

            return v
        }else{
            this.x -= newVector.x;
            this.y -= newVector.y;
            this.z -= newVector.z;

            this.stablize();
            return this;
        }
    },
    multiply:function(newVector){
        this.x *= newVector.x;
        this.y *= newVector.y;
        this.z *= newVector.z;

        this.stablize();

        return this;
    },

    divide:function(newVector){
        this.x /= newVector.x;
        this.y /= newVector.y;
        this.z /= newVector.z;

        this.stablize();
        return this;
    },

    addScalar:function(scalar){
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;

        this.stablize();
        return this;
    },

    subScalar:function(scalar){
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;

        this.stablize();
        return this;
    },

    multiplyScalar:function(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        this.stablize();

        return this;
    },

    divideScalar:function(scalar){
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;

        this.stablize();
        return this;
    },

    normalize:function(){
        var iLen = 1/this.length();
        this.x *= iLen;
        this.y *= iLen;
        this.z *= iLen;

        return this;
    },

    /**
     Ensures that all slots have a value and
     aren't null or undefined.
     */
    stablize:function(){
        var Vector = [this.x,this.y,this.z];

        for(var i = 0;i<Vector.length;i++){
            if((Vector[i] === null)||(Vector[i] === undefined)){
                Vector[i] = 0;
            }
        }

    },

    copy:function(){
        return new Vector(this.x,this.y,this.z);
    },

    clone:function(){
        return new Vector(this.x,this.y,this.z);
    },

    length:function(){
        return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z + this.z));
    },
    lengthSquared:function(){

        var sqrd =  Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z + this.z));
        sqrd *= sqrd;
        return sqrd;
    },

    toClipspace:function(){

    }


};//end prototype

/*
 Returns the distance between two vectors.
 */
Vector.dist = function(_v1,_v2){
    var dx = _v1.x - _v2.x;
    var dy = _v1.y - _v2.y;
    var dz = _v1.z - _v2.z;



    var total = ((dx * dx) + (dy * dy) + (dz * dz));

    return Math.sqrt(total);
}

/*============= FLOCK OBJECT =================*/

        var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

    var System = function(num,sketch){
        var num = num !== undefined ? num : 10;
        this.sketch = sketch;
        this.particles = [];
        this.pool;
        this.addParticles(num);
    };

    System.prototype = {
        addParticles:function(num,_x,_y){
            var pool = this.pool;
            var particles = this.particles;
            for(var i = 0;i<num;++i){

                particle = new Particle( _x, _y, random( 5, 40 ));

                particle.ctx = this.sketch;
                particle.wander = random( 0.5, 2.0 );
                particle.color = random( COLOURS );
                particle.drag = random( 0.9, 0.99 );

                theta = random( TWO_PI );
                force = random( 2, 8 );

                particle.vx = sin( theta ) * force;
                particle.vy = cos( theta ) * force;

                //set the neighbors
                particle.neighbors = particles;

                particles.push( particle );
            }
        },

        update:function(){
            var particlelen = this.particles.length;
            for(var i = 0;i<particlelen;++i){
                if(this.particles[i] !== undefined && (!this.particles[i].alive)){
                    this.particles.splice(i,1)[0];
                }else{
                    if(this.particles[i] !== undefined){
                        this.particles[i].update();
                    }
                }
            }
        },


        draw:function(){
            var particlelen = this.particles.length;

            for(var i = 0;i<particlelen;++i){
                this.particles[i].draw();
            }
        }

    }

/** =========== PARTICLE ==================*/
    var Particle = function(x,y,radius,sketch){
            this.alive = true;
            this.ctx = sketch;
            this.radius = radius || 10;
            this.wander = 0.15;
            this.theta = random( TWO_PI );
            this.drag = 0.92;
            this.color = '#fff';
            this.neighbors = [];


            this.pos = new Vector();
            this.x = x || 0.0;
            this.y = y || 0.0;

            this.pos.x = this.x;
            this.pos.y = this.y;

            this.vel = new Vector();
    }

    Particle.prototype = {
        setup:function(){

        },
        update:function(){
            this.theta += random(-0.5,0.5) * this.wander;

            this.vel.x = random(TWO_PI) * this.drag;
            this.vel.y = random(TWO_PI) * this.drag;

            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            this.radius *= 0.96;
            this.alive = this.radius > 0.5;
        },


        align:function(){

        },



        /**
         Pass Sketch.js instance here
        */
        draw:function(){

            ctx = this.ctx;
            ctx.beginPath();
            ctx.arc( this.pos.x, this.pos.y, this.radius, 0, TWO_PI );
        //    ctx.endPath();


            ctx.fillStyle = this.color;
            ctx.fill();
        }

    }


    var MAX_PARTICLES = 280;

    var particles = [];
    var pool = [];

    var sketch = Sketch.create({
        container: document.getElementById( 'sketch' )
    });

    var mouse_down = false;

    var system = new System(200,sketch);

    sketch.setup = function(){
    // Set off some initial particles.
            var i, x, y;


    }

    sketch.update = function(){
        system.update();
    }

    sketch.draw = function(){

        sketch.globalCompositionOperation = "lighter";
        system.draw();
    }

    sketch.mousedown = function(){
        mouse_down = true;
    }

    sketch.mouseup = function(){
        mouse_down = false;
    }
    sketch.mousemove = function(){
        if(!mouse_down){
            var touch,max;

            for ( i = 0, n = sketch.touches.length; i < n; i++ ) {
                touch = sketch.touches[i];
                max = random(1,4);
                for(j = 0;j<max;++j){
                    system.addParticles(20,touch.x,touch.y);
                }
            }
        }

    }

    var canvas = document.getElementById("sketch");
    window.addEventListener("resize",function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })
