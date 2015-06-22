//
//  FeedbackBuffer.h
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#ifndef __Lettering__FeedbackBuffer__
#define __Lettering__FeedbackBuffer__


#include "cinder/gl/gl.h"
#include "cinder/gl/Context.h"
#include "cinder/gl/Shader.h"
#include "cinder/gl/Vbo.h"
#include "cinder/gl/Vao.h"
#include "cinder/gl/GlslProg.h"
#include <vector>
#include <map>
#include <string>

namespace xoio {
    
    class FeedbackBuffer{
        
    protected:
        // Descriptions of particle data layout.
        ci::gl::VaoRef		mAttributes[2];
        // Buffers holding raw particle data on GPU.
        ci::gl::VboRef		mBuffer[2];
        
        // Current source and destination buffers for transform feedback.
        // Source and destination are swapped each frame after update.
        std::uint32_t	mSourceIndex		= 0;
        std::uint32_t	mDestinationIndex	= 1;
        
        //a map of all the attributes we want for the object
        std::map<std::string,int> enabledAttributes;
        
        //vector of all the varyings to pass between vertex and fragment
        std::vector<std::string> varyings;
        
        //format of the feedback
        GLuint feedbackFormat;
        
        //Primative type
        GLuint primativeType;
        
    public:
        FeedbackBuffer();
        
        /**
         *  Initialize buffers
         */
        void setupBuffer(GLenum target,GLsizeiptr allocationSize,const void *data,GLenum usage);
        
        /**
         *  Enable a attribute.
         *  Pass in a name for the 
         *  attribute(which will be used as the varying name as well + the index for it
         */
        void enableAttribute(std::string name,int index);
        
        
        /**
         *  Point data to the right attribute
         */
        void vertexAttribPointer(GLuint index,GLint size,GLenum type,GLboolean normalized,GLsizei stride,const GLvoid * pointer);
        
        
        /**
         *  Adds varying to the composition
         */
        void addVarying(std::string name);
        
        /**
         *  Run ping-ponging between buffers
         */
        virtual void updateBuffers();
   
        
    };
}

#endif /* defined(__Lettering__FeedbackBuffer__) */
