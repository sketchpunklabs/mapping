function nanoID( t=21 ){
    const r = crypto.getRandomValues( new Uint8Array( t ) );
    let n, e = '';
    for( ;t--; ){
        n  = 63 & r[ t ];
        e += ( n < 36 )? n.toString( 36 ) : 
             ( n < 62 )? ( n - 26 ).toString( 36 ).toUpperCase() : 
             ( n < 63 )? '_' : '-';
    }
    return e;
}

/*
    const fetchQueue = new FetchQueue();
    fetchQueue.push( 
        'http://blabla.bin', 
        'buffer', 
        ( payload, url, extra )=>{}, 
        'extraDataForCallback'
    );
*/
export default class FetchQueue{
    // #region MAIN
    queue       = [];           // List of items to download
    asyncLimit  = 2;            // How many active downloads
    _abortStack = new Map();    // Save Abort Controllers, Also doubles as how many fetches are currently active
    // #endregion

    // #region METHODS
    getSize(){ return this.queue.length; };

    abort(){
        for( const v of this._abortStack.values() ) v.abort();
        this._abortStack.clear();
        return this;
    }

    clearQueue(){ this.queue.length = 0; return this; }

    /** type = buffer | json */
    push( url, type, cb, extra=null ){
        this.queue.push( { url, type, cb, extra } );   // Save to the queue
        this._next();                                  // Start download process if one hasn't started
        return this;
    }
    // #endregion

    async _next(){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( this._abortStack.size >= this.asyncLimit || this.queue.length === 0 ) return;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const abortId   = nanoID( 12 );
        const abortCtrl = new AbortController();
        this._abortStack.set( abortId, abortCtrl );

        let itm;
        try{
            itm = this.queue.shift();
            const res = await fetch( itm.url, { signal: abortCtrl.signal } );
            if( res.status === 200 ){
                let payload;

                switch( itm.type ){
                    case 'buffer'   : payload = await res.arrayBuffer();    break;
                    case 'json'     : payload = await res.json();           break;
                }

                itm.cb( payload, itm.url, itm.extra );
            }else{
                console.error( 'Error Downloading: %s for %s', res.status, itm.url );
            }
        }catch( ex ){
            if( ex.name !== 'AbortError' ){
                console.error( 'Error downloading arraybuffer/json :', ex.message );
                console.error( '---', itm.url );
                console.error( '--- stack trace', ex.stack );
            }
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Download the next item on the queue.
        this._abortStack.delete( abortId );
        this._next();
    }
}