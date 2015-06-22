#version 150 core

uniform float uMouseForce;
uniform vec3  uMousePos;
uniform vec3 center;
in vec3   iPosition;
in vec3   iPPostion;
in vec3   iHome;
in float  iDamping;
in vec4   iColor;
in float iIncrement;

out vec3  position;
out vec3  pposition;
out vec3  home;
out float damping;
out vec4  color;
out float increment;

float dt2 = 1.0 / (60.0 * 60.0);

#define PARTICLE_SIZE 9000
#define M_PI 3.14159

float azimuth = 256.0 * M_PI / PARTICLE_SIZE;
float inclination = M_PI / PARTICLE_SIZE;
float radius = 200.0;

void main()
{
    position =  iPosition;
    pposition = iPPostion;
    damping =   iDamping;
    home =      iHome;
    color =     iColor;
    increment = iIncrement;
 
    if(position.z < 50.0){
        float dx = 1000 - position.z;
        dx *= 0.04f;
        position.z += (dx * increment * increment);

    }else if (position.z > 50.0){
        position.z = -1000.0 * increment;

    }
    
    
   }