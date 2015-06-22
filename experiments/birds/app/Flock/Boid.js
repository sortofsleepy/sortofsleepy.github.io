var Boid = function(){
    var left = new TriMesh(10,10);
    var right = new TriMesh(10,10);

    //get a reference to left and right wings
    this.left = left.mesh;
    this.right = right.mesh;

    //mesh to glue everything together
    this.mesh = new THREE.Object3D();

    //add the wings to a THREE.Object3D() so we can manipulate together
    this.mesh.add(left.mesh);
    this.mesh.add(right.mesh);

    /**
     * Basic positional properites
     * @type {THREE.Object3D.position|*}
     */
    this.position = this.mesh.position;
    this.acceleration = new THREE.Vector3(0.2,0.2,0.2);
    this.velocity = new THREE.Vector3(0.0,0.0,0.0);


    /**
     * How fast the flap ought to happen
     * @type {number}
     */
    this.flapSpeed = 2.0;

    /**
     * Mass of the boid
     * @type {number}
     */
    this.mass = 1000.0;

    /**
     * The max speed the boid can go
     * @type {number}
     */
    this.maxspeed = 5.0;

    /**
     * Angle constant to keep track of wing flappiness
     * @type {number}
     */
    this.angle = 0;

    /**
     * The Boid's neighbors
     * @type {Array}
     */
    this.neighbors = [];
    this.steerForce = 0.1;
    this.desiredseperation = 25.0;

    this.goal = null;

};


Boid.prototype = {
    /**========== BASIC FORCE ADDITION ====================*/
    addForce:function(force){
        var z = 0;

        /**
         * If we passed in a Vector3, then we'll use that z value
         */
        if(force.hasOwnProperty("z")){
            z = force.z;
        }

        var v = new THREE.Vector3(force.x,force.y,z);

        v.divideScalar(this.mass);

        this.acceleration.add(v);

    },

    update:function(){
        //update velocity/position
        this.velocity.add(this.acceleration);

        var len = this.velocity.length();

        if(len > this.maxspeed){
            this.velocity.divideScalar(len / this.maxspeed);
        }




        //adds the new position to the mesh
        this.mesh.position.add(this.velocity);


        //reset acceleration
        this.acceleration.set(0,0,0);
    },

    getRotation:function(){
        return this.mesh.rotation;
    },

    run:function(){
        if ( Math.random() > 0.5 ) {

            this.flock();

        }

        this.update();
    },

    addToScene:function(scene){
        scene.add(this.mesh);
    },

    flap:function(){
        this._flapLeft(0.5);
        this._flapRight(0.5);
    },
    /**
     * Sets the position of a boid. Meant to set initial position
     * @param pos{THREE.Vector3} the init position
     */
    setPosition:function(pos){
         this.position = pos;
    },

    /**======= THE FLOCKINGS ================*/
    repulse:function(target){
        var distance = this.position.distanceTo( target );

        if ( distance < 150 ) {

            var steer = new THREE.Vector3();

            steer.subVectors( this.position, target );
            steer.multiplyScalar( 0.5 / distance );

            this.acceleration.add( steer );

        }

    },

    reach:function(target,amount){
        var steer = new THREE.Vector3();

        steer.subVectors( target, this.position );
        steer.multiplyScalar( amount );

        return steer;

    },

    alignment:function(){
        var boid, velSum = new THREE.Vector3(),
            count = 0;
        var numNeighbors = this.neighbors.length;
        for ( var i = 0, il = numNeighbors; i < il; i++ ) {

            if ( Math.random() > 0.6 ) continue;

            boid = this.neighbors[ i ];

            distance = boid.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.desiredseperation ) {

                velSum.add( boid.velocity );
                count++;

            }

        }

        if ( count > 0 ) {

            velSum.divideScalar( count );

            var l = velSum.length();

            if ( l > this.steerForce ) {

                velSum.divideScalar( l / this.steerForce );

            }

        }

        return velSum;

    },

    cohesion:function(){
        var boid, distance,
            posSum = new THREE.Vector3(),
            steer = new THREE.Vector3(),
            count = 0;
        var numNeighbors = this.neighbors.length;
        for ( var i = 0, il = numNeighbors; i < il; i ++ ) {

            if ( Math.random() > 0.6 ) continue;

            boid = this.neighbors[ i ];
            distance = boid.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.desiredseperation ) {

                posSum.add( boid.position );
                count++;

            }

        }

        if ( count > 0 ) {

            posSum.divideScalar( count );

        }

        steer.subVectors( posSum, this.position );

        var l = steer.length();

        if ( l > this.steerForce) {

            steer.divideScalar( l / this.steerForce );

        }

        return steer;
    },

    seperation:function(){
        var boid, distance,
            posSum = new THREE.Vector3(),
            repulse = new THREE.Vector3();

        var numNeighbors = this.neighbors.length;

        for ( var i = 0, il = numNeighbors; i < il; i ++ ) {

            if ( Math.random() > 0.6 ) continue;

            boid = this.neighbors[ i ];
            distance = boid.position.distanceTo( this.position );

            if ( distance > 0 && distance <= this.desiredseperation ) {

                repulse.subVectors( this.position, boid.position );
                repulse.normalize();
                repulse.divideScalar( distance );
                posSum.add( repulse );

            }

        }

        return posSum;
    },
    /**======= USEFUL GETTERS/SETTERS ==================*/

    //gets the left wing
    getLeft:function(){
        return left.mesh;
    },

    //gets the right wing
    getRight:function(){
        return right.mesh;
    },
    updateWings:function(){
        this._flapLeft(50);
        this._flapRight(-50);
    },


    getPosition:function(){
        return this.mesh.position;
    },

    getVelocity:function(){
        return this.velocity;
    },



    /**
     * Checks the boundries to make sure the boid does not pass them
     */
    checkBoundries:function () {
       var _depth = 100;
        if ( this.position.x >   WIDTH ) this.position.x = - WIDTH;
        if ( this.position.x < - WIDTH ) this.position.x =   WIDTH;
        if ( this.position.y >   HEIGHT ) this.position.y = - HEIGHT;
        if ( this.position.y < - HEIGHT ) this.position.y =  HEIGHT;
        if ( this.position.z >  _depth ) this.position.z = - _depth;
        if ( this.position.z < - _depth ) this.position.z =  _depth;

    },

    avoidWalls:function(){
        var _depth = 100;
        var vector = new THREE.Vector3();
        
        vector.set( - WIDTH, this.position.y, this.position.z );
        vector = this.avoid( vector );
        vector.multiplyScalar( 5 );
        this.acceleration.add( vector );

        vector.set( WIDTH, this.position.y, this.position.z );
        vector = this.avoid( vector );
        vector.multiplyScalar( 5 );
        this.acceleration.add( vector );

        vector.set( this.position.x, - HEIGHT, this.position.z );
        vector = this.avoid( vector );
        vector.multiplyScalar( 5 );
        this.acceleration.add( vector );

        vector.set( this.position.x, HEIGHT, this.position.z );
        vector = this.avoid( vector );
        vector.multiplyScalar( 5 );
        this.acceleration.add( vector );

        vector.set( this.position.x, this.position.y, - _depth );
        vector = this.avoid( vector );
        vector.multiplyScalar( 5 );
        this.acceleration.add( vector );

        vector.set( this.position.x, this.position.y, _depth );
        vector = this.avoid( vector );
        vector.multiplyScalar( 5 );
        this.acceleration.add( vector );
    },

    /**========= FLOCKING =============*/

    flock:function(){
        if ( this.goal ) {

            this.acceleration.add( this.reach( this.goal, 0.005 ) );

        }

        this.acceleration.add( this.alignment() );
        this.acceleration.add( this.cohesion() );
        this.acceleration.add( this.seperation());

    },

    avoid:function(target){
        var steer = new THREE.Vector3();

        steer.copy( this.position );
        steer.sub( target );

        steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

        return steer;
    },


    seek:function(target){
      this.target = target;
    },

    /**============= PRIVATEISH FUNCTIONS ===============*/

    _flapLeft:function(amt){
        this.angle += 0.05;
        this.left.rotation.x = Math.sin(this.angle) * this.flapSpeed;
        return this;
    },

    _flapRight:function(amt){
        this.angle += 0.05;
        this.right.rotation.x = -(Math.sin(this.angle) * this.flapSpeed);
        return this;
    }


}; //end boid


/**
 Finds the distance between two vectors.
 Math.sqrt((x * x) - (y*y));
 */
function distance(vec1,vec2){
    return vec1.distanceTo(vec2);
    //return Math.sqrt((vec1.multiply(vec1)) - (vec2.multiply(vec2)));
}

/**


 var dx = mousePos.x - this.position.x;
 var dy = mousePos.y - this.position.y;
 var angle = Math.atan2(dy,dx);

 var vx = Math.cos(angle) * 25.0
 var vy = Math.sin(angle) * 25.0;


 this.mesh.rotation.y = Math.atan2( - this.position.z, this.position.x );
 this.mesh.rotation.z = Math.asin( this.position.y / this.position.length() );

 this.mesh.phase = ( this.mesh.phase + ( Math.max( 0, this.mesh.rotation.z ) + 0.1 )  ) % 62.83;

 var vector = mousePos;

 //vector.z = this.position.z;
 //this.repulse(vector);


 this.position.x += (dx * 0.04);
 this.position.y += (dy * 0.04)


 */