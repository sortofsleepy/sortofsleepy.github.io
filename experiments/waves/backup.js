

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
camera.position.z = 3050;

//resolution of the grid
var resolution = 10.0;

var cols = window.innerWidth / resolution;
var rows = window.innerHeight / resolution;


var attributes = {

    size:        { type: 'f', value: null },
    customColor: { type: 'c', value: null }

};

uniforms = {

    color:     { type: "c", value: new THREE.Color( 0xffffff ) },
    texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "spark1.png" ) }

};

var shaderMaterial = new THREE.ShaderMaterial( {

    uniforms:       uniforms,
    attributes:     attributes,
    vertexShader:   document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

    blending:       THREE.AdditiveBlending,
    depthTest:      false,
    transparent:    true

});




var particles = 0;
var vectors = [];
for(var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
        var x = i * resolution;
        var y = j * resolution;
        var z = j * resolution;

        vectors.push(x);
        vectors.push(y);
        vectors.push(z);
        particles++;
    }
}
var n = 1000, n2 = n / 2; // particles spread in the cube

var geometry = new THREE.BufferGeometry();
var positions = new Float32Array(particles * 3);
var colors = new Float32Array(particles * 3);

var color = new THREE.Color();


var values_size = new Float32Array(particles * 3);

for(var i = 0;i<positions.length;++i){

    values_size[ i ] = 20;
    values_size[ i + 1] = 20;
    values_size[ i + 2] = 20;


    positions[ i ]     = vectors[i];
    positions[ i + 1 ] = vectors[i + 1];
    positions[ i + 2 ] = vectors[i + 2];

    // colors

    var vx = ( vectors[i] / n ) + 0.5;
    var vy = ( vectors[i + 1] / n ) + 0.5;
    var vz = ( vectors[i + 2] / n ) + 0.5;

    color.setRGB( vx, vy, vz );

    colors[ i ]     = color.r;
    colors[ i + 1 ] = color.g;
    colors[ i + 2 ] = color.b;
}

geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

geometry.computeBoundingSphere();

//

var material = new THREE.PointCloudMaterial( { size: 15, vertexColors: THREE.VertexColors } );

particleSystem = new THREE.PointCloud( geometry,material );
scene.add( particleSystem );

particleSystem.position.x = (window.innerWidth / 2) * -1;
particleSystem.position.y = (window.innerHeight / 2) * -1;
particleSystem.rotation.x = 300;



/**======== wave formula ============*/
var waveOrigin = new THREE.Vector3(0,window.innerHeight/2, 0);
var waveWidth = cols * rows;
var wavePeriod = 2;
var waveAmplitude = 3;
var dx = ((3.14 * 3.14) / wavePeriod) * resolution;
var theta = 0.0;


animate();

function animate() {

    requestAnimationFrame( animate );

    theta += 0.02;
    var xTemp = theta;

    var time = Date.now() * 0.001;
    for(var i = 0;i<positions.length;++i){

        positions[ i + 1 ] += (Math.sin(xTemp) * waveAmplitude);

    }


    geometry.getAttribute("position").needsUpdate = true;


    render();
    // stats.update();

}

function render() {

    var time = Date.now() * 0.001;

    for(var i = 0; i < cols; ++i) {
        for (var j = 0; j < rows; ++j) {
            var index = i * j;

            var x = waveOrigin.x + i * resolution;
            var y = waveOrigin.y + positions[index + 1];
            var z = positions[index + 2];

            //positions[index] = x;
            // positions[index + 1] = y;
            positions[index + 2] = z;
        }
    }
    geometry.getAttribute("position").needsUpdate = true;


    var size = geometry.attributes.size.array;

    for( var i = 0; i < particles; i++ ) {

        size[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );

    }

    geometry.attributes.size.needsUpdate = true;

    // particleSystem.rotation.x = time * 0.25;
    // particleSystem.rotation.y = time * 0.5;


    renderer.render( scene, camera );

}
