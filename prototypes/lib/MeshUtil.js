import {
    DoubleSide,
    MeshBasicMaterial,
    PlaneGeometry, BufferGeometry, BufferAttribute,
    Mesh,
} from 'three';

export default class MeshUtil{

    static quad( mat, size=1, isUp=false, isCenter=true ){
        const geo = new PlaneGeometry( size, size, 1, 1 );
        if( isUp ) geo.rotateX( Math.PI * -0.5 );
        
        if( !isCenter ){
            if( isUp ) geo.translate( size*0.5, 0.0, size*0.5 );
            else       geo.translate( size*0.5, size*0.5, 0.0 );
        }
        //

        mat = mat || new MeshBasicMaterial( { color:0x00ffff, side: DoubleSide } );
        return new Mesh( geo, mat );
    }

    static geo( { vertices=null, indices=null, normal=null, uv=null, color=null, skinWeight=null, skinIndex=null, skinSize=4 } = props ){
        const geo = new BufferGeometry();
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Data must be a TypeArray
        if( !( vertices instanceof Float32Array ) )          vertices = new Float32Array( vertices );
        if( color   && !( color instanceof Float32Array ) )  color    = new Float32Array( color );
        if( normal  && !( normal instanceof Float32Array ) ) normal   = new Float32Array( normal );
        if( uv      && !( uv instanceof Float32Array ) )     uv       = new Float32Array( uv );
        if( indices && !( indices instanceof Uint16Array ) ) indices  = new Uint16Array( indices );
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        geo.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
    
        if( indices )    geo.setIndex( new BufferAttribute( indices, 1 ) );
        if( normal )     geo.setAttribute( 'normal', new BufferAttribute( norm, 3 ) );
        if( uv )         geo.setAttribute( 'uv', new BufferAttribute( uv, 2 ) );
        if( color )      geo.setAttribute( 'color', new BufferAttribute( color, 3 ) );
        if( skinWeight ) geo.setAttribute( 'skinWeight', new BufferAttribute( skinWeight, skinSize ) );
        if( skinIndex )  geo.setAttribute( 'skinIndex',  new BufferAttribute( skinIndex,  skinSize ) );
    
        return geo;
    }

    static flipTriangleIndices( indices ){
        let tmp;
        for( let i=0; i < indices.length; i+=3 ){
            tmp            = indices[ i ]; 
            indices[ i ]   = indices[ i+2 ]; 
            indices[ i+2 ] = tmp;         
        }
    }

    static reverseVertexLoop( vertices ){
        const rtn = new Float32Array( vertices.length );
        let ii    = 0;
        for( let i = vertices.length-1; i >= 0; i -= 3 ){
            rtn[ ii+0 ] = vertices[ i-2 ];
            rtn[ ii+1 ] = vertices[ i-1 ];
            rtn[ ii+2 ] = vertices[ i-0 ];
            ii += 3;
        }
        return rtn;
    }

    static swopYZ( vertices ){
        let tmp;
        for( let i=0; i < vertices.length; i+=3 ){
            tmp             = vertices[ i+1 ]; // Y
            vertices[ i+1 ] = vertices[ i+2 ]; // Z >> Y
            vertices[ i+2 ] = tmp;          // Y >> Z
        }
    }

    static rotateVertsXN90( vertices ){
        let tmp;
        for( let i=0; i < vertices.length; i+=3 ){
            tmp             = vertices[ i+1 ]; // Y
            vertices[ i+1 ] = vertices[ i+2 ]; // Z >> Y
            vertices[ i+2 ] = -tmp;          // Y >> Z
        }
    }


    static isVertLoopClockwise( verts, useY=true ){
        let sum = 0;
        const a = ( useY )? 1 : 2;
        const b = a + 3;
        for( let i=0; i < verts.length-3; i +=3 ){
            sum += ( verts[i+3] - verts[i+0] ) * 
                   ( verts[i+b] + verts[i+a] );
        }
        return !!( sum > 0 );
    }
}