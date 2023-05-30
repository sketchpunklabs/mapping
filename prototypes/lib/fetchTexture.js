import { Texture, ClampToEdgeWrapping, RepeatWrapping } from 'three';
import fetchImage from './fetchImage.js';

export default async function fetchTexture( url, flipY=true, isRepeat=false ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Download image
    const img = await fetchImage( url );
    if( !img ) return null;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Make it a texture
    const tex       = new Texture( img );
    tex.wrapT       = tex.wrapS = ( isRepeat )? RepeatWrapping : ClampToEdgeWrapping;
    tex.flipY       = flipY;
    tex.needsUpdate = true; // Needed, else it may render as black
    return tex;
}