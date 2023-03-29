import * as THREE from 'three';

export default class TextureCanvas{

    constructor( w=256, h=256 ){
        this.canvas        = document.createElement( 'canvas' );
        this.canvas.width  = w;
        this.canvas.height = h;
        this.width         = w;
        this.height        = h;

        this.ctx = this.canvas.getContext( '2d' );;
        this.texture = new THREE.CanvasTexture( this.canvas );
    }

    appendToBody(){
        document.body.append( this.canvas );
        return this;
    }

    useUVWrapping(){
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        return this;
    }

    gen(){
        const ctx = this.ctx;
        const w   = this.width;
        const h   = this.height;

        const bigLineWidth   = 0.04;
        const smallLineWidth = 0.01;
        const linesCount     = 5;

        
        ctx.fillStyle = '#000000';
        ctx.clearRect( 0, 0, w, h );
        ctx.fillRect( 0, 0, w, h );
      
        // Big Lines
        ctx.globalAlpha = 1.0; //terrain.texture.smallLineAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect( 0, 0, w, Math.round( h * bigLineWidth ) ); 
      
        // Small Lines
        const smallLinesCount = linesCount - 1;
      
        for (let i = 0; i < smallLinesCount; i++) {
            ctx.fillRect(
                0,
                Math.round( h / linesCount) * ( i + 1 ),
                w,
                Math.round( h * smallLineWidth )
            ); 
        }

        this.texture.needsUpdate = true;


    }
}
