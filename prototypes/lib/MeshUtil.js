import {
    DoubleSide,
    MeshBasicMaterial,
    PlaneGeometry,
    Mesh,
} from 'three';

export default class MeshUtil{

    static quad( mat, size=1, isUp=false ){
        const geo = new PlaneGeometry( size, size, 1, 1 );
        if( isUp ) geo.rotateX( Math.PI * -0.5 );
        //geo.translate( 0.5, 0.0, 0.5 );

        mat = mat || new MeshBasicMaterial( { color:0x00ffff, side: DoubleSide } );
        return new Mesh( geo, mat );
    }

}