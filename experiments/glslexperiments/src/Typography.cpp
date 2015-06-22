//
//  Typography.cpp
//  Lettering
//
//  Created by Joseph Chow on 3/2/15.
//
//

#include "Typography.h"
using namespace ci;
using namespace std;

namespace xoio{
    Typography::Typography(std::string fontname,int fontsize){
        fontSize = fontsize;
        mFont = ci::Font( "Times New Roman", 24 );
        mTextureFont = gl::TextureFont::create(mFont);
    }
    
    Typography::Typography(){}
}