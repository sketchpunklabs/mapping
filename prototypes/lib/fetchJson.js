export default function fetchJson( url ){
    return new Promise( async ( resolve, reject )=>{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Get response
        const res = await fetch( url );
        if( !res.ok ){ reject( res.status ); return; }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Download Binary
        const json = await res.json();
        if( !json ){ reject( 'Unable to download json' ); return; }

        resolve( json );
    });
}