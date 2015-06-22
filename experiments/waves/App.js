
var renderer, scene, camera, stats;

var particleSystem, uniforms, geometry;

var resolution = 9.0;
var cols = window.innerWidth / resolution;
var rows = window.innerHeight / resolution;

var particles = cols * rows;
particles *= 3;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var controls;

var composer,pass;
var blur = new WAGNER.CircularBlurPass();
var chromaticaberration = new WAGNER.ChromaticAberrationPass();
var bloom = new WAGNER.MultiPassBloomPass();
var noise = new WAGNER.NoisePass();
var vectors = [];
for(var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
        var x = (i * resolution);
        var y = (j * resolution);
        var z = (j * resolution);

        vectors.push(x);
        vectors.push(y);
        vectors.push(z);

    }
}

for(var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
        var x = (i * resolution);
        var y = (j * resolution);
        var z = (j * resolution);

        vectors.push(x);
        vectors.push(y);
        vectors.push(z);

    }
}

for(var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
        var x = (i * resolution);
        var y = (j * resolution);
        var z = (j * resolution);

        vectors.push(x);
        vectors.push(y);
        vectors.push(z);

    }
}


for(var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
        var x = (i * resolution);
        var y = (j * resolution);
        var z = (j * resolution);

        vectors.push(x);
        vectors.push(y);
        vectors.push(z);

    }
}

for(var i = 0; i < cols; ++i) {
    for (var j = 0; j < rows; ++j) {
        var x = (i * resolution);
        var y = (j * resolution);
        var z = (j * resolution);

        vectors.push(x);
        vectors.push(y);
        vectors.push(z);

    }
}





/**======== wave formula ============*/
var waveOrigin = new THREE.Vector3(-1,0, 0);
var waveWidth = cols * rows;

var wavePeriod = 5;
var waveAmplitude = 3;
var dx = ((3.14 * 3.14) / wavePeriod) * resolution;
var theta = 0.0;


init();
animate();
function init() {

    camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
    camera.position.z = 300;

    controls = new THREE.TrackballControls(camera);
    scene = new THREE.Scene();

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


    var radius = 200;

    geometry = new THREE.BufferGeometry();

    positions = new Float32Array( particles * 3);
    values_color = new Float32Array( particles * 3);
    values_size = new Float32Array( particles );

    var color = new THREE.Color();

    for( var v = 0; v < particles; v++ ) {

        values_size[ v ] = 2
        positions[ v * 3 + 0 ] = vectors[ v * 3 + 0 ]
        positions[ v * 3 + 1 ] = vectors[ v * 3 + 1 ]
        positions[ v * 3 + 2 ] = vectors[ v * 3 + 2 ]

        color.setHSL( v / particles, Math.random() * 1.0, 0.5 );

        values_color[ v * 3 + 0 ] = color.r;
        values_color[ v * 3 + 1 ] = color.g;
        values_color[ v * 3 + 2 ] = color.b;

    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( values_color, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

    particleSystem = new THREE.PointCloud( geometry, shaderMaterial );

    particleSystem.position.x = (window.innerWidth / 2) * -1
    scene.add( particleSystem );

    renderer = new THREE.WebGLRenderer();

    composer = new WAGNER.Composer(renderer);
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( WIDTH, HEIGHT );

    WAGNER.vertexShadersPath = 'vertex-shaders';
    WAGNER.fragmentShadersPath = 'fragment-shaders';

    pass = new WAGNER.ASCIIPass();
    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    theta += 0.02;
    var xTemp = theta;

    for( var v = 0; v < particles; v++ ) {


       // positions[ v * 3 + 0 ] = vectors[ v * 3 + 0 ]
        positions[ v * 3 + 1 ] = (Math.sin(xTemp) * waveAmplitude);
       // positions[ v * 3 + 2 ] = vectors[ v * 3 + 2 ]



        xTemp += dx;
    }
    geometry.getAttribute("position").needsUpdate = true;

    controls.update();
    render();
    stats.update();

}

function render() {

    var time = Date.now() * 0.005;

   // particleSystem.rotation.z = 0.01 * time;

    var size = geometry.attributes.size.array;

    for( var i = 0; i < particles; i++ ) {

        size[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );

    }

    geometry.attributes.size.needsUpdate = true;

    composer.reset();
    composer.render( scene, camera );

    composer.pass(noise);
    composer.pass(chromaticaberration);
    composer.pass(bloom);


    composer.toScreen();

    //renderer.render( scene, camera );

}


