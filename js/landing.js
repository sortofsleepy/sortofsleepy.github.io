(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Detect = _interopRequire(require("./Detect.js"));

var Background = _interopRequire(require("./Background.js"));

var site = document.querySelector("#SITE");
var background = new Background();
background.render();
document.body.appendChild(background.renderer.domElement);

/////// HEADER ///////
var text = document.querySelectorAll("header #title .component h1");
//vary the direction that they're hidden
for (var i = 0; i < text.length; ++i) {
    var variance = Math.random() * 2;

    if (variance > 1) {
        text[i].style.top = 20 + "px";
    } else {
        text[i].style.top = -20 + "px";
    }
}
TweenMax.staggerTo(text, 1, {
    top: 0,
    ease: Power4.easeOut
}, 0.2);

/////// NAV ///////
var navItems = document.querySelectorAll("#nav .nav-item span");
var navHover = document.querySelectorAll("#nav .nav-item .nav-hover");

for (var i = 0; i < navItems.length; ++i) {
    var variance = Math.random() * 2;

    navItems[i].style.top = 103 + "px";

    navItems[i].addEventListener("mouseover", function () {
        var hover = this.parentNode.children[0];
        TweenMax.to(hover, 0.8, {
            left: 0,
            width: 100 + "%",
            ease: Power4.easeOut
        });
    });

    navItems[i].addEventListener("mouseout", function () {
        var hover = this.parentNode.children[0];

        TweenMax.to(hover, 0.8, {
            left: 300,
            width: 0 + "%",
            ease: Power4.easeOut,
            onComplete: function onComplete() {
                hover.style.left = -40 + "px";
            }
        });

        hover.style.left = -40 + "px";
    });
}

TweenMax.staggerTo(navItems, 1, {
    top: 7,
    ease: Power4.easeOut
}, 0.2);

/// MOBILE MESSAGE ////
if (Detect.isMobileOS()) {
    var message = document.createElement("h3");
    message.id = "mobile-message";

    message.innerHTML = "Joseph Chow is a developer currently residing in the San Francisco Bay Area and in the process of rebuilding this site, while also looking for new work." + "<br/><br/>While it's understandable to you to be looking at this site from a mobile device, sadly, to show off some of what I'm capable" + " of and what I'd like to be doing, it really is better to be looking at this on your desktop.";

    site.appendChild(message);
} else {
    var message = document.createElement("h3");
    message.id = "desktop-message";
    message.innerHTML = "Joseph Chow is a developer currently residing in the San Francisco Bay Area." + "I'm currently open to new opportunities, though outside of the product/start-up space. Always happy to travel and see new places" + " While the site is being rebuilt, here are some links you can check out in the meantime.";

    site.appendChild(message);
    var links = [{
        name: "LinkedIn",
        url: "http://www.linkedin.com/in/sortofsleepy"
    }, {
        name: "Bitbucket",
        url: "http://www.bitbucket.org/sortofsleepy"
    }, {
        name: "Twitter",
        url: "http://www.twitter.com/sortofsleepy"
    }, {
        name: "Vsco",
        url: "http://sortofsleepy.vsco.co"
    }, {
        name: "Old (very tiny) site",
        url: "http://xoio.co"
    }];
    var linkList = document.createElement("ul");
    linkList.id = "link-list";
    for (var i = 0; i < links.length; ++i) {
        var a = document.createElement("a");
        a.href = links[i].url;
        a.target = "_blank";
        a.innerHTML = links[i].name;
        a.className = "external-link";

        var listItem = document.createElement("li");
        listItem.appendChild(a);

        linkList.appendChild(listItem);
    }

    site.appendChild(linkList);
}

},{"./Background.js":2,"./Detect.js":4}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var PCloud = _interopRequire(require("./PCloud.js"));

var Background = (function () {
    function Background() {
        _classCallCheck(this, Background);

        var renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        var scene = new THREE.Scene();

        //renderer.setClearColor(0xffffff,1);
        renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", function () {});

        var size = 1024;
        var array = new Float32Array(size * size * 4);

        var positionsTexture = new THREE.DataTexture(array, size, size, THREE.RGBAFormat, THREE.FloatType);
        positionsTexture.minFilter = THREE.NearestFilter;
        positionsTexture.magFilter = THREE.NearestFilter;
        positionsTexture.generateMipmaps = false;
        positionsTexture.needsUpdate = true;

        var geometry = new THREE.IcosahedronGeometry(150, 1);

        var material = new THREE.MeshBasicMaterial({
            color: 0 });

        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this._buildFacePositions(geometry);
    }

    _createClass(Background, {
        _buildFacePositions: {
            value: function _buildFacePositions(geometry) {
                var size = 1024;
                //build face origins positions
                var data = new Float32Array(size * size * 3);
                var point = new THREE.Vector3();
                var facesLength = geometry.faces.length;

                for (var i = 0, l = data.length; i < l; i += 3) {

                    var face = geometry.faces[Math.floor(Math.random() * facesLength)];

                    var vertex1 = geometry.vertices[face.a];
                    var vertex2 = geometry.vertices[Math.random() > 0.5 ? face.b : face.c];

                    point.subVectors(vertex2, vertex1);
                    point.multiplyScalar(Math.random());
                    point.add(vertex1);

                    data[i] = point.x;
                    data[i + 1] = point.y;
                    data[i + 2] = point.z;
                }

                //build cloud
                var cloud = new PCloud(this.renderer);
                cloud.setData(data);
                cloud.buildOutput(this.scene);

                this.cloud = cloud;
            }
        },
        render: {
            value: function render() {
                var renderer = this.renderer;
                var scene = this.scene;
                var camera = this.camera;
                var cloud = this.cloud;
                animate();
                function animate() {
                    window.requestAnimationFrame(animate);

                    var time = Date.now() * 0.001;

                    camera.position.x = -Math.cos(time * 0.1);
                    camera.position.z = Math.sin(time * 0.1);
                    camera.lookAt(scene.position);

                    cloud.setTimer(time);
                    cloud.updateSim();
                    renderer.render(scene, camera);
                }
            }
        }
    });

    return Background;
})();

module.exports = Background;

},{"./PCloud.js":5}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var count = 0;

var Composer = (function () {
    function Composer(renderer, options) {
        _classCallCheck(this, Composer);

        //build the options.
        this.options = options !== undefined ? this._buildOptions(options, renderer) : {
            width: 720,
            height: 720,
            size: 720,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        };

        if (options === undefined) {
            this.buildType = "three";
        }

        //size of the texture to store data
        this.size = 720;

        //store size doubled
        this.s2 = this.size * this.size;

        //the processing passes to run on the item
        this.passes = [];

        //reference to the simulation program to apply values to
        this.simulation = null;

        //the uniform in the simulation thats set to get new values
        this.receiver = null;

        //counter to help swap between buffers
        this.counter = 0;

        //global uniforms for every type of pass
        this.gUniforms = {
            timer: {
                type: "f",
                value: 0
            }
        };

        //const variable used to figure out which uniform to set the render target to.
        this._renderTargetDestination = "destination";

        if (renderer instanceof THREE.WebGLRenderer) {
            this._buildThree(renderer);
        }
    }

    _createClass(Composer, {
        addPass: {

            /**
             *  Adds a pass to run onto the stack.
             *  @param name a name for the pass which gets used as a id internally
             *  @param source the fragment shader source for the pass
             *  @param uniforms uniforms that are a part of the shader. Note - the destination that is supposed to be
             *  receiving the calculated texture should have the property "destination" as part of it's object.
             */

            value: function addPass(name, source, uniforms) {
                var pass = {};

                if (this.buildType === "three") {
                    pass.shader = new THREE.ShaderMaterial({
                        vertexShader: this._getPassthru(),
                        fragmentShader: source,
                        uniforms: uniforms
                    });
                    for (var i in uniforms) {
                        if (uniforms[i].hasOwnProperty(this._renderTargetDestination)) {
                            pass.destination = pass.shader.uniforms[i];
                        }
                    }
                }
                this.passes.push(pass);
            }
        },
        update: {

            /**
             *  Does all the calculatin and updates render targets appropriately.
             *  TODO implement some kind of flag switching so that we don't have to referer to
             *  a specific buffer. Complicated in javascript because !flag converts variable to boolean.
             */

            value: function update() {
                //update global uniforms
                //  this.gUniforms.timer.value = Date.now() * 0.0001;

                for (var i = 0; i < this.passes.length; ++i) {
                    var pass = this.passes[i];

                    if (this.counter % 2 === 0) {
                        pass.destination.value = this.rt_1;
                        this.runPass(this.program, this.rt_2);
                        this.renderShader.uniforms.map.value = this.rt_2;
                    } else {
                        pass.destination.value = this.rt_2;
                        this.runPass(this.program, this.rt_1);
                        this.renderShader.uniforms.map.value = this.rt_1;
                    }

                    this.counter++;
                }
            }
        },
        addPostProcessing: {

            /**
             *  Adds a post-processing effect
             *  @param effect the post processing effect to add.
             */

            value: function addPostProcessing(effect) {}
        },
        setSimulation: {

            //set the simulation shader to use

            value: function setSimulation(shader) {
                this.simulation = shader;
            }
        },
        setOutput: {
            value: function setOutput(shader) {
                this.renderShader = shader;
            }
        },
        runPass: {

            //runs a pass against the specified target

            value: function runPass(shader, target) {
                this.mesh.material = shader;
                this.renderer.render(this.scene, this.camera, target, false);
            }
        },
        _buildThree: {

            ////// THREE JS SPECIFIC STUFF ///////////

            value: function _buildThree(renderer) {

                var camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
                var scene = new THREE.Scene();
                var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1));
                var renderer = renderer;
                var size = this.size;
                scene.add(mesh);

                this.renderer = renderer;
                this.mesh = mesh;
                this.camera = camera;
                this.scene = scene;

                var rtTexturePos = new THREE.WebGLRenderTarget(size, size, {
                    minFilter: THREE.NearestFilter,
                    magFilter: THREE.NearestFilter,
                    format: THREE.RGBAFormat,
                    type: THREE.FloatType,
                    stencilBuffer: false
                });

                var rtTexturePos2 = rtTexturePos.clone();

                this.rt_1 = rtTexturePos;
                this.rt_2 = rtTexturePos2;
            }
        },
        _buildOptions: {

            /////////// INTERNAL //////////////
            /**
             *  Build out the options object a little bit more, filing in
             *  any missing attributes with the defaults
             */

            value: function _buildOptions(options, renderer) {
                if (renderer instanceof THREE.WebGLRenderer) {
                    //options for the buffering
                    var defaults = {
                        width: 720,
                        height: 720,
                        wrapS: THREE.RepeatWrapping,
                        wrapT: THREE.RepeatWrapping,
                        minFilter: THREE.NearestFilter,
                        magFilter: THREE.NearestFilter,
                        format: THREE.RGBAFormat,
                        stencilBuffer: false
                    };
                    for (var a in defaults) {
                        if (!options.hasOwnProperty(a)) {
                            options[a] = defaults[a];
                        }
                    }

                    this.buildType = "three;";
                }
            }
        },
        _getPassthru: {

            /**
             *  Generates a pass-thur vertex shader.
             */

            value: function _getPassthru() {

                //still need to check for build type because
                //Three.js provides some variables when constructing ShaderMaterial(s)
                if (this.buildType === "three") {
                    return ["varying vec2 vUv;", "void main(){", "vUv = vec2(uv.x, 1.0 - uv.y);", "gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz,1.0);", "}"].join("\n");
                }
            }
        },
        _canUseWebGL2: {

            /**
             *  Tests for the capabilities to use WebGL2
             */

            value: function _canUseWebGL2() {
                var canvas = document.createElement("canvas");
                // Try creating a WebGL 2 context first
                var gl = canvas.getContext("webgl2", { antialias: false });
                if (!gl) {
                    gl = canvas.getContext("experimental-webgl2", { antialias: false });
                }
                var isWebGL2 = !!gl;
                if (isWebGL2) {
                    console.log("I can haz flag, so WebGL 2 is yes!");
                    return gl;
                } else {
                    return false;
                }
            }
        }
    });

    return Composer;
})();

module.exports = Composer;

},{}],4:[function(require,module,exports){
"use strict";

var Detect = (function () {

    var api = {

        BROWSER_UNKNOWN: "BROWSER_UNKNOWN",
        BROWSER_CHROME: "Chrome",
        BROWSER_OMNI_WEB: "OmniWeb",
        BROWSER_SAFARI: "Safari",
        BROWSER_OPERA: "Opera",
        BROWSER_ICAB: "iCab",
        BROWSER_KONQUEROR: "Konqueror",
        BROWSER_FIREFOX: "Firefox",
        BROWSER_CAMINO: "Camino",
        BROWSER_NETSCAPE: "Netscape",
        BROWSER_EXPLORER: "Explorer",
        BROWSER_MOZILLA: "Mozilla",

        OS_UNKNOWN: "OS_UNKNOWN",
        OS_WINDOWS_PHONE: "Windows Phone",
        OS_WINDOWS: "Windows",
        OS_MAC: "Mac",
        OS_IPHONE_IPOD: "iPhone/iPod",
        OS_IPAD: "iPad",
        OS_ANDROID: "Android",
        OS_LINUX: "Linux",

        VERSION_UNKNOWN: -1,

        getData: function getData() {
            var parent = this;
            return {
                browser: detect.browser,
                version: detect.version,
                os: detect.OS,
                isMobile: parent.isMobileOS()
            };
        },
        /**
         * Gets the current browser name
         *
         * @method getBrowser
         * @return {String} A value represneted by a browserDetectService.BROWSER_XXXX constant
         */
        getBrowser: function getBrowser() {
            return detect.browser;
        },

        /**
         * Gets the current browser's version number
         *
         * @method getVersion
         * @return {Number} Version number (float). browserDetectService.VERSION_UNKNOWN if not available.
         */
        getVersion: function getVersion() {
            return detect.version;
        },

        /**
         * Gets the current browser's operating system
         *
         * @method getOS
         * @return {String} A value represneted by a browserDetectService.OS_XXXX constant
         */
        getOS: function getOS() {
            return detect.OS;
        },

        /**
         * If the app is running within a mobile OS, true will be returned. This uses a
         * generalization of what is considered to be mobile OS.
         *
         * @method isMobileOS
         * @return {Boolean} true if we're running on what we interpret to be a mobile platform.
         */
        isMobileOS: function isMobileOS() {
            switch (api.getOS()) {
                case api.OS_ANDROID:
                case api.OS_IPAD:
                case api.OS_IPHONE_IPOD:
                case api.OS_WINDOWS_PHONE:
                    return true;
                    break;

                default:
                    return false;
            }
        }
    };

    /**
     * Detect based on http://www.quirksmode.org/js/detect.html
     * with the addition of a few OS objects and integration of ID constants.
     * @param {Object} detect
     */
    var detect = {
        init: function init() {
            this.browser = this.searchString(this.dataBrowser) || api.BROWSER_UNKNOWN;
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || api.VERSION_UNKNOWN;
            this.OS = this.searchString(this.dataOS) || api.OS_UNKNOWN;
        },
        searchString: function searchString(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) {
                        return data[i].identity;
                    }
                } else if (dataProp) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function searchVersion(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) {
                return;
            }return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: api.BROWSER_CHROME
        }, { string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: api.BROWSER_OMNI_WEB
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: api.BROWSER_SAFARI,
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: api.BROWSER_OPERA,
            versionSearch: "Version"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: api.BROWSER_ICAB
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: api.BROWSER_KONQUEROR
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: api.BROWSER_FIREFOX
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: api.BROWSER_CAMINO
        }, { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: api.BROWSER_NETSCAPE
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: api.BROWSER_EXPLORER,
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: api.BROWSER_MOZILLA,
            versionSearch: "rv"
        }, { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: api.BROWSER_NETSCAPE,
            versionSearch: "Mozilla"
        }],
        dataOS: [{
            string: navigator.userAgent,
            subString: "Windows Phone",
            identity: api.OS_WINDOWS_PHONE
        }, {
            string: navigator.platform,
            subString: "Win",
            identity: api.OS_WINDOWS
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: api.OS_MAC
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: api.OS_IPHONE_IPOD
        }, {
            string: navigator.userAgent,
            subString: "iPad",
            identity: api.OS_IPAD
        }, {
            string: navigator.userAgent,
            subString: "Android",
            identity: api.OS_ANDROID
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: api.OS_LINUX
        }]
    };
    detect.init();

    return api;
}).call(undefined);

try {
    if (module !== undefined) {
        module.exports = Detect;
    }
} catch (e) {}

},{}],5:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Composer = _interopRequire(require("./Composer.js"));



var PCloud = (function (_Composer) {
    function PCloud(renderer, options) {
        _classCallCheck(this, PCloud);

        _get(Object.getPrototypeOf(PCloud.prototype), "constructor", this).call(this, renderer, options);

        /*
         var material = new THREE.ShaderMaterial( {
         uniforms: {
         tPositions: { type: "t", value: null },
         tOrigins: { type: "t", value: null },
         opacity: { type: "f", value: 0 },
         timer: { type: "f", value: 0 }
         },
         vertexShader: glslify("./shaders/pass.vert.glsl"),
         fragmentShader:glslify("./shaders/simulation.glsl"),
         });
         material.uniforms.opacity.value = 1.0;
         this.program = material;*/

        this.addPass("curl", "#define GLSLIFY 1\n\n uniform float opacity;\n\n\t\t\t uniform sampler2D tPositions;\n\t\t\t uniform sampler2D tOrigins;\n\n\t\t\t uniform float timer;\n\n\t\t\t varying vec2 vUv;\n\n\t\t\t float rand(vec2 co){\n                 return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n\t\t\t }\n\n\t\t\t void main() {\n\n\t\t\t \tvec4 pos = texture2D( tPositions ,vUv );\n        vec4 oPos = texture2D( tOrigins ,vUv );\n\n\n\t\t\t \tif ( rand( vUv + timer ) > 0.99 || pos.w <= 0.0 ) {\n\n\t\t\t \t\tpos.xyz = texture2D( tOrigins ,vUv ).xyz;\n\t\t\t \t\tpos.w = opacity;\n\n\t\t\t \t} else {\n\n\t\t\t \t\tif ( pos.w <= 0.0 ) discard;\n\n\t\t\t \t\tfloat x = pos.x + timer * 5.0;\n\t\t\t \t\tfloat y = pos.y;\n\t\t\t \t\tfloat z = pos.z + timer * 4.0;\n\n\t\t\t \t\tpos.x += sin( y * 0.033 ) * cos( z * 0.037 ) * 0.4;\n\t\t\t \t\tpos.y += sin( x * 0.035 ) * cos( x * 0.035 ) * 0.4;\n\t\t\t \t\tpos.z += sin( x * 0.037 ) * cos( y * 0.033 ) * 0.4;\n\t\t\t \t\tpos.w -= 0.00001;\n\n\t\t\t \t}\n\n\t\t\t \tgl_FragColor = pos;\n\n\t\t\t }\n", {
            tPositions: { type: "t", value: null, destination: true },
            tOrigins: { type: "t", value: null },
            opacity: { type: "f", value: 1 },
            timer: { type: "f", value: 0 }
        });

        this.program = this.passes[this.passes.length - 1].shader;
    }

    _inherits(PCloud, _Composer);

    _createClass(PCloud, {
        setPositionsTexture: {
            value: function setPositionsTexture(texture) {
                this.program.uniforms.tPositions.value = texture;
                //this.program.uniforms.t_pos.value = texture;
                return this.program;
            }
        },
        setTimer: {
            value: function setTimer(time) {
                this.program.uniforms.timer.value = time;
            }
        },
        setData: {
            value: function setData(data) {
                var size = this.size;
                var originsTexture = new THREE.DataTexture(data, size, size, THREE.RGBFormat, THREE.FloatType);
                originsTexture.minFilter = THREE.NearestFilter;
                originsTexture.magFilter = THREE.NearestFilter;
                originsTexture.generateMipmaps = false;
                originsTexture.needsUpdate = true;
                this.origins = originsTexture;
                this.program.uniforms.tOrigins.value = originsTexture;
            }
        },
        buildOutput: {
            value: function buildOutput(scene) {
                var size = this.size;
                var geometry = new THREE.BufferGeometry();
                var attribute = new THREE.BufferAttribute(new Float32Array(size * size * 3), 3);
                geometry.addAttribute("position", attribute);
                var positions = geometry.getAttribute("position").array;
                for (var i = 0, j = 0, l = positions.length / 3; i < l; i++, j += 3) {
                    positions[j] = i % size / size;
                    positions[j + 1] = Math.floor(i / size) / size;
                }
                var particleMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        map: { type: "t", value: null },
                        size: { type: "f", value: size },
                        pointColor: { type: "v3", value: new THREE.Vector3(0.1, 0.25, 0.5) }

                    },
                    vertexShader: document.getElementById("vs-render").textContent,
                    fragmentShader: document.getElementById("fs-render").textContent,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    // depthTest: false,
                    transparent: true

                });
                this.renderShader = particleMaterial;
                var mesh = new THREE.PointCloud(geometry, particleMaterial);
                scene.add(mesh);

                return particleMaterial;
            }
        },
        updateSim: {
            value: function updateSim(time) {
                this.program.uniforms.timer.value = performance.now();
                this.update();
            }
        }
    });

    return PCloud;
})(Composer);

module.exports = PCloud;

},{"./Composer.js":3}]},{},[1]);

//# sourceMappingURL=landing.js.map