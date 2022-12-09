export default function fetchArrayBuffer( url ){
    return new Promise( async ( resolve, reject )=>{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Get response
        const res = await fetch( url );
        if( !res.ok ){ reject( res.status ); return; }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Download Binary
        const payload = await res.arrayBuffer();
        if( !payload ){ reject( 'Unable to download arraybuffer' ); return; }

        resolve( payload );
    });
}