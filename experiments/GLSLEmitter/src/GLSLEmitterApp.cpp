#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "ParticleSystem.h"
#include "Typography.h"
using namespace ci;
using namespace ci::app;
using namespace std;

class GLSLEmitterApp : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void update() override;
	void draw() override;
    
    ParticleSystem system;
    xoio::Typography type;

};

void GLSLEmitterApp::setup()
{
    system.addParticle(9000);
    system.init();
}

void GLSLEmitterApp::mouseDown( MouseEvent event )
{
}

void GLSLEmitterApp::update()
{
    system.updateBuffers();

}

void GLSLEmitterApp::draw()
{
	gl::clear( Color( 0, 0, 0 ) );
       system.draw();
}

CINDER_APP( GLSLEmitterApp, RendererGl )
