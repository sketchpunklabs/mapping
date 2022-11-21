export default function fetchImage( url ){
    return new Promise( async ( resolve, reject )=>{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Get response
        const res = await fetch( url );
        if( !res.ok ){ reject( res.status ); return; }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Download Binary
        const blob = await res.blob();
        if( !blob ){ reject( 'Unable to download image blob' ); return; }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Convert to image
        const obj  = URL.createObjectURL( blob );
        const img  = new Image();
    
        img.crossOrigin	 = 'anonymous';
        img.onload       = ()=>{ URL.revokeObjectURL( obj ); resolve( img ); };
        img.onerror      = ()=>{ URL.revokeObjectURL( obj ); reject( 'Error loading object url into image' ); };
        img.src          = obj;
    });
}