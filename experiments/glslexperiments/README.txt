This is a Cinder application that creates a GLSL animated particle emiter using 
Transform Feedback.

Not much too it and it needs a bit of tweaking but I was really happy to finally get something CLOSE to 
working, theres a lot to keep track of writing OpenGL even with a framework ! :)

This is using Cinder's "glNext" codebase, which at the time of this writing is in a state of flux, 
but the current api is stable enough to use for experiements at the very least and at the time of this writing, 
should still work with the code.

The Xcode project is included. To build you'll have to download and build the glNext branch of Cinder. 
A guide can be found here
http://libcinder.org/docs/welcome/GitSetup.html

I have things set up on my computer where Cinder should be placed in your documents folder and the project source should be placed in 
a folder call "apps" within your documents folder.

You can of course change this around. 
===============
HOWEVER, for simplicity - I've also included a built "app" :)
It can be found under 
xcode/build/Debug/