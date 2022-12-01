export default function CanvasOffscreen( w=256, h=256, pixelReading=true ){
    // #region MAIN
    const WIDTH   = w;
    const HEIGHT  = h;
    const canvas  = new OffscreenCanvas( w, h );
    const ctx     = canvas.getContext( '2d', { willReadFrequently:pixelReading } );
    const self    = { canvas, ctx, };
    // #endregion

    // #region METHODS
    self.loadImage = ( img )=>{ ctx.drawImage( img, 0, 0, WIDTH, HEIGHT ); return self; }

    self.pixelAtUV = ( u, v )=>{
      const x  = Math.min( WIDTH-1, Math.max( Math.floor( WIDTH * u ), 0 ) );
      const y  = Math.min( HEIGHT-1, Math.max( Math.floor( HEIGHT * ( 1.0 - v ) ), 0 ) );
      const px = ctx.getImageData( x, y, 1, 1 ).data;
      return px;
    };
    // #endregion

    return self;
}