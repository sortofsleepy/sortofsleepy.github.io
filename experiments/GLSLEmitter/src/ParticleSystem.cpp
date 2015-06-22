//
//  ParticleSystem.cpp
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#include "ParticleSystem.h"
using namespace std;
using namespace ci;
using namespace ci::app;

ParticleSystem::ParticleSystem():
renderShaderSet(false){

    
    
}

void ParticleSystem::addParticle(int num){
    for(int i = 0;i < num;++i){
        particles.push_back(Particle());
    }
}

void ParticleSystem::init(){
   


    const float azimuth = 256.0f * M_PI / particles.size();
    const float inclination = M_PI / particles.size();
    const float radius = 50.0f;
    center = vec3( app::getWindowCenter(), 0.0f );
    for( int i = 0; i < particles.size(); ++i )
    {	// assign starting values to particles.
        float x = radius * sin( inclination * i ) * cos( azimuth * i );
        float y = radius * cos( inclination * i );
        float z = radius * sin( inclination * i ) * sin( azimuth * i );
        
        auto &p = particles.at( i );
        p.pos = center + vec3( x, y, z );
        p.increment = Rand::randFloat();
        p.home = p.pos;
        p.ppos = p.home; //+ Rand::randVec3f() * 10.0f; // random initial velocity
        p.damping = Rand::randFloat( 0.965f, 0.985f );
        p.color = Color( CM_HSV, lmap<float>( i, 0.0f, particles.size(), 0.0f, 0.66f ), 1.0f, 1.0f );
    }

    //setup some of the basic variables describing the
    //attribute data
    particleObjectSize = sizeof(Particle);
    positionPointer = (const GLvoid*)offsetof(Particle, pos);
    colorPointer = (const GLvoid*)offsetof(Particle, color);
   // lifePointer = (const GLvoid*)offsetof(Particle,life);
    type = GL_FLOAT;
    stride = sizeof(Particle);
    
    //setup some of the buffer data
    bufferSize = particles.size() * sizeof(Particle);
    
    
    //setup buffers
    setupBuffer(GL_ARRAY_BUFFER, bufferSize, particles.data(), GL_STATIC_DRAW);
    
    
    //enable some attributes
    enableAttribute("iPosition", 0);
    enableAttribute("iColor", 1);
    enableAttribute("iPPosition", 2);
    enableAttribute("iHome", 3);
    enableAttribute("iDamping", 4);
    enableAttribute("iIncrement", 5);
    

    
    //point to the data
   
    vertexAttribPointer( 0, 3, GL_FLOAT, GL_FALSE, sizeof(Particle), (const GLvoid*)offsetof(Particle, pos) );
    vertexAttribPointer( 1, 4, GL_FLOAT, GL_FALSE, sizeof(Particle), (const GLvoid*)offsetof(Particle, color) );
    vertexAttribPointer( 2, 3, GL_FLOAT, GL_FALSE, sizeof(Particle), (const GLvoid*)offsetof(Particle, ppos) );
    vertexAttribPointer( 3, 3, GL_FLOAT, GL_FALSE, sizeof(Particle), (const GLvoid*)offsetof(Particle, home) );
    vertexAttribPointer( 4, 1, GL_FLOAT, GL_FALSE, sizeof(Particle), (const GLvoid*)offsetof(Particle, damping) );
      vertexAttribPointer( 5, 1, GL_FLOAT, GL_FALSE, sizeof(Particle), (const GLvoid*)offsetof(Particle, increment) );
    // Listen to mouse events so we can send data as uniforms.
    getWindow()->getSignalMouseDown().connect( [this]( MouseEvent event )
                                              {
                                                  mMouseDown = true;
                                                  mMouseForce = 500.0f;
                                                  mMousePos = vec3( event.getX(), event.getY(), 0.0f );
                                              } );
    getWindow()->getSignalMouseDrag().connect( [this]( MouseEvent event )
                                              {
                                                  mMousePos = vec3( event.getX(), event.getY(), 0.0f );
                                              } );
    getWindow()->getSignalMouseUp().connect( [this]( MouseEvent event )
                                            {
                                                mMouseForce = 0.0f;
                                                mMouseDown = false;
                                            } );
    
    shader = gl::GlslProg::create( gl::GlslProg::Format().vertex( loadAsset( "particle.vert.glsl" ) )

                                       .feedbackFormat( GL_INTERLEAVED_ATTRIBS )
                                       .feedbackVaryings( { "position", "pposition", "home", "color", "damping","increment" } )
                                       .attribLocation( "iPosition", 0 )
                                       .attribLocation( "iColor", 1 )
                                       .attribLocation( "iPPosition", 2 )
                                       .attribLocation( "iHome", 3 )
                                       .attribLocation( "iDamping", 4 )
                                  .attribLocation( "iIncrement", 5 )
                                       );
   renderShader = gl::getStockShader(gl::ShaderDef().color());
}


void ParticleSystem::setShader(string vertex,string fragment,bool forRender){
    
    gl::GlslProg::Format format;
    format.vertex(app::loadAsset(vertex));
    format.fragment(app::loadAsset(fragment));
   
  
    if(!forRender){
        format.feedbackFormat(feedbackFormat);
        //apply attributes to shader
        map<string,int>::iterator it = enabledAttributes.begin();
        for(;it != enabledAttributes.end();++it){
            format.attribLocation(it->first, it->second);
        }
        
        //apply varyings to shader
        format.feedbackVaryings(varyings);
        
        shader = gl::GlslProg::create(format);
        
        //use default shader for rendering
        renderShader = gl::getStockShader(gl::ShaderDef().color());
    }else{
        renderShader = gl::GlslProg::create(format);
    }
}

void ParticleSystem::updateBuffers(){
    gl::ScopedGlslProg prog(shader);
    gl::ScopedState rasterizer( GL_RASTERIZER_DISCARD, true );	// turn off fragment stage
    shader->uniform( "uMouseForce", mMouseForce );
    shader->uniform( "uMousePos", mMousePos );
    shader->uniform("center", center);
    
    // Bind the source data (Attributes refer to specific buffers).
    gl::ScopedVao source( mAttributes[mSourceIndex] );
    // Bind destination as buffer base.
    gl::bindBufferBase( GL_TRANSFORM_FEEDBACK_BUFFER, 0, mBuffer[mDestinationIndex] );
    gl::beginTransformFeedback( GL_POINTS );
    
    // Draw source into destination, performing our vertex transformations.
    gl::drawArrays( GL_POINTS, 0, particles.size() );
    
    gl::endTransformFeedback();
    
    // Swap source and destination for next loop
    std::swap( mSourceIndex, mDestinationIndex );
    

}

void ParticleSystem::draw(){
    
    gl::clear( Color( 0, 0, 0 ) );
    gl::setMatricesWindowPersp( app::getWindowSize() );
    gl::enableDepthRead();
    gl::enableDepthWrite();
    
    gl::ScopedGlslProg render( renderShader);
    gl::ScopedVao vao( mAttributes[mSourceIndex] );
    gl::context()->setDefaultShaderVars();
    gl::drawArrays( GL_POINTS, 0, particles.size() );

}
