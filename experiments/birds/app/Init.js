var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

/**
 * Set up renderer
 * @type {THREE.WebGLRenderer}
 */
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff,1);

/**
 * Set up scene
 * @type {THREE.Scene}
 */
var scene = new THREE.Scene();

/**
 * Setup camera
 * @type {THREE.PerspectiveCamera}
 */
camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 800;

/**
 * Sets up the size of the renderer
 */
renderer.setSize(window.innerWidth,window.innerHeight);

/**
 * Append <canvas> to body
 */
document.getElementsByTagName("body")[0].appendChild(renderer.domElement);

//item that constantly keeps track of mousePos
var mousePos = new THREE.Vector2();

window.addEventListener("mousemove",function(e){
    mousePos.x = e.clientX - (window.innerWidth/2);
    mousePos.y = e.clientY - (window.innerHeight/2);

    //need to flip y position
    mousePos.y *= -1;
});

window.addEventListener("onresize",function(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
})

function rotate(object,axis,radians){
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // new code for Three.js r50+:
    object.rotation.setFromRotationMatrix(object.matrix);
}