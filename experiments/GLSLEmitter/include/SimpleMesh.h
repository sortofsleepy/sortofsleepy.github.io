//
//  SimpleMesh.h
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#ifndef __Lettering__SimpleMesh__
#define __Lettering__SimpleMesh__
#include <vector>
#include <map>
#include <stdio.h>
#include <string>
#include "cinder/gl/VboMesh.h"
#include "cinder/gl/Batch.h"
#include "cinder/gl/Shader.h"


namespace xoio {
    
    class SimpleMesh {
        
        std::vector<ci::vec3> vertices;
        std::vector<GLushort> indices;
        
        //DYNAMIC_DRAW,STATIC_DRAW,etc.
        GLuint usageStyle;
        
        //GL_LINES,GL_TRIANGLES,etc
        GLuint primativeType;
        
        //layout of mesh
        ci::gl::VboMesh::Layout layout;
        
        //map for all the custom attributes
        std::map<ci::geom::Attrib,std::string>customAttributes;
        
        //have we set a shader?
        bool shaderSet;
        
        //shader to be used for rendering
        ci::gl::GlslProgRef shader;
        
        ci::gl::VboMeshRef vbo;
        
        ci::gl::BatchRef batcher;
        
    public:
        SimpleMesh();
        
        //adds vertice to mesh
        void addVertex(ci::vec3);
        void addVertex(ci::vec2);
        
        /**
         *  Adds a custom attribute to the mesh.
         *  For VboMesh objects, this is limited to 9.
         */
        void addAttribute(std::string name,int slot,int size);
        
        //set the primative type to be used
        void setPrimativeType(GLuint type);
        
        void compile();
        
        void setShader(ci::gl::GlslProgRef shader);
    };
}

#endif /* defined(__Lettering__SimpleMesh__) */
