//
//  Typography.h
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#ifndef __Lettering__Typography__
#define __Lettering__Typography__

#include "cinder/gl/Texture.h"
#include "cinder/Text.h"
#include "cinder/Rand.h"
#include "cinder/gl/TextureFont.h"
#include "cinder/Utilities.h"

#include <string>
namespace xoio {
    class Typography{
    protected:
        
        //font object
        ci::Font mFont;
        
        //texture to draw font
        ci::gl::TextureFontRef	mTextureFont;
        
        //size of the font
        int fontSize;
        
        //position at which to start drawing type
        ci::vec3 position;
    public:
        Typography();
        Typography(std::string fontname,int fontsize=12);
        
        /**
         *  Set the bounds at which to draw the type
         *  Note : will override position;
         */
        void setBounds(ci::Rectf bounds);
        
    };
}

#endif /* defined(__Lettering__Typography__) */
