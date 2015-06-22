//
//  SimpleMesh.cpp
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#include "SimpleMesh.h"

using namespace ci;
using namespace std;

namespace xoio{
    
    SimpleMesh::SimpleMesh():
    usageStyle(GL_STATIC_DRAW),
    primativeType(GL_LINES),
    shaderSet(false){
        //automatically assign default attribs
        layout.attrib(geom::POSITION, 3);
        layout.attrib(geom::COLOR, 4);
    }
    
    void SimpleMesh::addVertex(ci::vec3 vec){
        vertices.push_back(vec);
        indices.push_back(indices.size() + 1);
    }
    
    void SimpleMesh::addVertex(ci::vec2 vec){
        vertices.push_back(ci::vec3(vec,0.0));
        //push back a indicie as well
        indices.push_back(indices.size() + 1);
    }
    
    void SimpleMesh::addAttribute(std::string name,int slot,int size){
        switch (slot) {
            case 0:
                layout.attrib(geom::CUSTOM_0, size);
                customAttributes.insert(pair<geom::Attrib,std::string>(geom::CUSTOM_0,name));
                break;
                
            case 1:
                layout.attrib(geom::CUSTOM_1, size);
                customAttributes.insert(pair<geom::Attrib,std::string>(geom::CUSTOM_1,name));
                break;
                
            case 2:
                layout.attrib(geom::CUSTOM_2, size);
                customAttributes.insert(pair<geom::Attrib,std::string>(geom::CUSTOM_2,name));
                break;
            default:
                break;
        }


    }
    
    void SimpleMesh::setShader(gl::GlslProgRef shader){
        this->shader = shader;
    }
    
    void SimpleMesh::setPrimativeType(GLuint type){
        primativeType = type;
    }
    
    void SimpleMesh::compile(){
        vbo = gl::VboMesh::create(vertices.size(), primativeType, {layout});
        
        //buffer included data onto the GPU
        vbo->bufferAttrib(geom::POSITION, vertices.size() * sizeof(vec3), vertices.data());
        //vbo->bufferAttrib(geom::COLOR, colors);
        
        //setup mapping of custom attribs
        gl::Batch::AttributeMapping mapping(customAttributes);
        
        //! load data onto BatchRef with the shader included as part of a BufferedObject
        batcher = gl::Batch::create(vbo,shader,mapping);

    }
    
}; //end namespace