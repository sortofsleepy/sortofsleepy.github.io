var flock = new Flock(scene);
flock.addBoids(100);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.getElementsByTagName("body")[0].appendChild(stats.domElement);



for ( var i = 0; i < flock.size(); i ++ ) {

    var boid = this.flock.boids[ i ];
    var mesh = boid.mesh;

    mesh.position.x = Math.random() * 400 - 200;
    mesh.position.y = Math.random() * 400 - 200;
    mesh.position.z = Math.random() * 400 - 200;
   // boid.addForce(Math.random() * 2 - 1)

}
render();
function render(){
    window.requestAnimationFrame(render);
    flock.render();
    stats.update();
    renderer.render(scene,camera);
}