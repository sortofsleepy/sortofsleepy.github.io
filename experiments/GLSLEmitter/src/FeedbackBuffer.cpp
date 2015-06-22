//
//  FeedbackBuffer.cpp
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#include "FeedbackBuffer.h"

using namespace ci;
using namespace std;

namespace xoio{
    FeedbackBuffer::FeedbackBuffer():feedbackFormat(GL_INTERLEAVED_ATTRIBS),
    primativeType(GL_POINTS){}
    void FeedbackBuffer::setupBuffer(GLenum target,GLsizeiptr allocationSize,const void *data,GLenum usage){
        
        mBuffer[0] = gl::Vbo::create(target,allocationSize,data,usage);
        
        mBuffer[1] = gl::Vbo::create(target,allocationSize,data,usage);
        
        mAttributes[0] = gl::Vao::create();
        mAttributes[1] = gl::Vao::create();
    }
    
    void FeedbackBuffer::enableAttribute(string name,int index){
        enabledAttributes.insert(pair<string,int>(name,index));
    }
    
    void FeedbackBuffer::vertexAttribPointer(GLuint index,GLint size,GLenum type,GLboolean normalized,GLsizei stride,const GLvoid * pointer){
        
        for(int i = 0;i<2;++i){
            gl::ScopedVao vao( mAttributes[i] );
            gl::ScopedBuffer buffer( mBuffer[i] );
            
            std::map<string,int>::iterator it = enabledAttributes.begin();
            
            for(;it != enabledAttributes.end();++it){
                gl::enableVertexAttribArray(it->second);
            }
            
            //pointer with that data
            gl::vertexAttribPointer(index, size, type, normalized, stride, pointer);
        }
    }
    
    
    void FeedbackBuffer::updateBuffers(){
        
    }
    
    void FeedbackBuffer::addVarying(std::string name){
        varyings.push_back(name);
    }

    
    
}