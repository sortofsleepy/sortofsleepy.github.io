/**
 * Flock
 * @param scene{THREE.Scene} a Three.js scene to render stuff onto
 * @constructor
 */
var Flock = function(scene){
    this.scene = scene !== undefined ? scene : false;

    this.boids = [];
};


Flock.prototype = {
    /**
     * Adds boids to a scene
     * @param num{Number} number of boids to enter
     */
    addBoids:function(num){
        for(var i = 0;i<num;++i){
            this.boids.push(new Boid());
        }

        this._prepare();
    },

    size:function(){
        return this.boids.length;
    },

    /**
     * Prepares the flock by adding all the boids to a scene
     * @private
     */
    _prepare:function(){

        var boidlen = this.boids.length;
        for(var i = 0;i<boidlen;++i){
            this.scene.add(this.boids[i].mesh);

            this.boids[i].neighbors = this.boids;


        }
    },

    flock:function(){
        var boidlen = this.boids.length;
        for(var i = 0;i<boidlen;++i){
           this.boids[i].flock();

        }
    },

    /**
     * Keep this here to run in the draw method in case we need
     * something like flapping to occur
     */
    render:function(){
        var boidlen = this.boids.length;
        for(var i = 0;i<boidlen;++i){
           this.boids[i].run();
           this.boids[i].flap();

            this.boids[i].getRotation().y = Math.atan2( - this.boids[i].velocity.z, this.boids[i].velocity.x );
            this.boids[i].getRotation().z = Math.asin( this.boids[i].velocity.y / this.boids[i].velocity.length() );

            this.boids[i].mesh.phase = ( this.boids[i].mesh.phase + ( Math.max( 0, this.boids[i].getRotation().z ) + 0.1 )  ) % 62.83;

        }
    }
};//end proto