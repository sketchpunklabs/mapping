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
export default class FetchBatch{
    // #region MAIN
    queue        = [];          // List of items to download
    listComplete = [];          // List of items that are done
    asyncLimit   = 2;           // How many active downloads
    onDownload   = null;        // Callback for each download
    onComplete   = null;        // Callback when all the downloads are done
    _abortStack  = new Map();   // Save Abort Controllers, Also doubles as how many fetches are currently active
    _itemCount   = 0;           // How many items in the batch
    _doneCount   = 0;           // How many items done being processed
    _isRunning   = false;       // Is Downloading queue currently running
    // #endregion

    // #region METHODS
    getSize(){ return this.queue.length; };

    abort(){
        for( const v of this._abortStack.values() ) v.abort();
        this._abortStack.clear();
        return this;
    }

    /** type = buffer | json */
    add( url, type, extra=null ){
        if( !this._isRunning ){
            this.queue.push( { url, type, extra, payload:null } );   // Save to the queue
            this._itemCount++;
        }
        return this;
    }

    start(){
        if( this._isRunning ) return this;
        this._isRunning = true;

        const min = Math.min( this.asyncLimit, this.queue.length );
        for( let i = 0; i < min; i++ ){
            this._next( this.queue.shift() );
        }

        return this;
    }
    // #endregion

    async _next( itm ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if( !itm ){
            if( this._doneCount === this._itemCount ){
                this._isRunning = false;
                if( this.onComplete ) this.onComplete( this.listComplete );
            }
            return;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const abortId   = nanoID( 12 );
        const abortCtrl = new AbortController();
        this._abortStack.set( abortId, abortCtrl );

        try{
            const res = await fetch( itm.url, { signal: abortCtrl.signal } );
            if( res.status === 200 ){
                let payload;

                switch( itm.type ){
                    case 'buffer'   : itm.payload = await res.arrayBuffer();    break;
                    case 'json'     : itm.payload = await res.json();           break;
                }

                this.listComplete.push( itm );
                if( this.onDownload ) this.onDownload( itm );
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
        this._doneCount++;
        this._abortStack.delete( abortId );
        this._next( this.queue.shift() );
    }
}