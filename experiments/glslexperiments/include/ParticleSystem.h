//
//  ParticleSystem.h
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#ifndef __Lettering__ParticleSystem__
#define __Lettering__ParticleSystem__

#include <vector>
#include "FeedbackBuffer.h"
#include "cinder/Rand.h"
struct Particle
{
    cinder::vec3	pos;
    cinder::vec3	ppos;
    cinder::vec3	home;
    cinder::ColorA  color;
    float increment;
    float	damping;
};


class ParticleSystem : public xoio::FeedbackBuffer{
    
    std::vector<Particle> particles;
    
    //some of the basic variables describing the attribute data
    GLuint particleObjectSize;
    const GLvoid * positionPointer;
    const GLvoid * colorPointer;
    const GLvoid * lifePointer;
    GLint type;
    GLsizei stride;
    
    //setup some of teh properties needed for the buffer
    GLsizeiptr bufferSize;
    
    //shader used for calulatin
    ci::gl::GlslProgRef shader;
    
    //shader used for rendering
    ci::gl::GlslProgRef renderShader;
  
    bool renderShaderSet;
    
    // Mouse state suitable for passing as uniforms to update program
    bool			mMouseDown = false;
    float			mMouseForce = 0.0f;
    ci::vec3			mMousePos = ci::vec3( 0, 0, 0 );
    
    ci::vec3 center;
public:
    ParticleSystem();
    
    /**
     *  Adds at least 1 particle to the system.
     */
    void addParticle(int num=1);
    
    //initialize system and prepare for use
    void init();
    
    
    /**
     *  Initialize shaders with varyings
     */
    void setShader(std::string vertex,std::string fragment,bool forRender=false);
    
    void updateBuffers();
    
    void draw();
};

#endif /* defined(__Lettering__ParticleSystem__) */
