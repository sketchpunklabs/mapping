import { Texture, ClampToEdgeWrapping, RepeatWrapping } from 'three';
import fetchImage from './fetchImage.js';

export default function fetchAsyncTexture( url, flipY=true, isRepeat=false ){
    const tex       = new Texture();
    tex.wrapT       = tex.wrapS = ( isRepeat )? ClampToEdgeWrapping : RepeatWrapping;
    tex.flipY       = flipY;

    fetchImage( url ).then( ( img )=>{
        tex.image       = img;
        tex.needsUpdate = true;
    });

    return tex;
}

