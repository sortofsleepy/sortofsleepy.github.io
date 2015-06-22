var TriMesh = function(width,height){
    width = width !== undefined ? width : 200;
    height = height != undefined ? height : 100;

    //geometry to store vertices
    var geo = new THREE.Geometry();

    //vertices
    var a = new THREE.Vector3(0,0,0);
    var b = new THREE.Vector3(width,0,0);
    var c = new THREE.Vector3(height,height,0);

    geo.vertices.push(a);
    geo.vertices.push(b);
    geo.vertices.push(c);

    geo.faces.push(new THREE.Face3(0,1,2));

    var mat = new THREE.MeshBasicMaterial({
        color:Math.random()*0xeeeeee
    })


    //make the mesh.
    var mesh = new THREE.Mesh(geo,mat);

    //turn off backface culling
    mesh.material.side = THREE.DoubleSide;

    //assign eveyrthing ot the object.
    this.mesh = mesh;
    this.geo = geo;
    this.vertices = [a,b,c];


    this.setCenterRotation(width,height);
}


TriMesh.prototype = {
    getMesh:function(){
        return this.mesh;
    },
    setCenterRotation:function(width,height){
        this.geo.applyMatrix(new THREE.Matrix4().makeTranslation(width/2,0,0));
    },

    setMaterial:function(mat){

    },



    rotate:function(amt){
        this.mesh.rotation.x = Math.cos(amt) * 0.5;

    }
};

/**
 Small extention to the THREE.Mesh class
*/
THREE.Mesh.rotate = function(axis,radians){
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(),radians);

    rotationMatrix.multiply(this.matrix);
    this.matrix = rotationMatrix;

    this.rotation.setFromRotationMatrix(this.matrix);
}
