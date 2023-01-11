// #region IMPORTS
import * as THREE           from 'three';
import { OrbitControls }    from 'OrbitControls';
import { EffectComposer }   from 'postprocess/EffectComposer.js';
import { RenderPass }       from 'postprocess/RenderPass.js';
export { THREE };

// #endregion

/*
<style>
    body, html { padding:0px; margin:0px; width:100%; height:100%; }
    canvas{ display:block; }
</style>

const App = useThreeWebGL2();
App.scene.add( facedCube( [0,3,0], 6 ) );
App
    .sphericalLook( 45, 35, 40 )
    .renderLoop();
*/


// #region OPTIONS
export function useDarkScene( tjs ){
    // Light
    const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set( 4, 10, 1 );
    tjs.scene.add( light );
    
    tjs.scene.add( new THREE.AmbientLight( 0x404040 ) );
    
    // Floor
    tjs.scene.add( new THREE.GridHelper( 20, 20, 0x0c610c, 0x444444 ) );

    // Renderer
    // tjs.renderer.setClearColor( 0x3a3a3a, 1 );
    return tjs;
};

export async function useVisualDebug( tjs ){
    const ary = await Promise.all([
        import( './meshes/DynLineMesh.js' ),
        import( './meshes/ShapePointsMesh.js' ),
    ]);

    const o = {};
    tjs.scene.add( ( o.ln  = new ary[ 0 ].default ) );
    tjs.scene.add( ( o.pnt = new ary[ 1 ].default ) );
    return o;
}
// #endregion

// #region MAIN
export default function useThreeComposer(){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // RENDERER
    const options = { 
        antialias : true, 
        alpha     : true,
    };

    const canvas    = document.createElement( 'canvas' );
    options.canvas  = canvas;
    options.context = canvas.getContext( 'webgl2' );

    const renderer = new THREE.WebGLRenderer( options );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 0 ); //0x3a3a3a
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    document.body.appendChild( renderer.domElement );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // CORE
    const scene   = new THREE.Scene();    
    const clock   = new THREE.Clock();
    clock.start();

    const camera  = new THREE.PerspectiveCamera( 45, 1.0, 0.01, 5000 );
    camera.position.set( 0, 5, 20 );

    const camCtrl = new OrbitControls( camera, renderer.domElement );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // POST EFFECTS
    const composer = new EffectComposer( renderer );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // METHODS
    let self;   // Need to declare before methods for it to be useable

    const render = ( onPreRender=null, onPostRender=null ) =>{
        const deltaTime   = clock.getDelta();
        const ellapseTime = clock.getElapsedTime();

        if( onPreRender )  onPreRender( deltaTime, ellapseTime );
        
        composer.render(); //renderer.render( scene, camera );
        
        if( onPostRender ) onPostRender( deltaTime, ellapseTime );
        return self;
    };

    const renderLoop = ()=>{
        window.requestAnimationFrame( renderLoop );
        render();
        return self;
    };

    const sphericalLook = ( lon, lat, radius, target=null )=>{
        const phi 	= ( 90 - lat )  * Math.PI / 180;
        const theta = ( lon + 180 ) * Math.PI / 180;

        camera.position.set(
            -(radius * Math.sin( phi ) * Math.sin(theta)),
            radius * Math.cos( phi ),
            -(radius * Math.sin( phi ) * Math.cos(theta))
        );

        if( target ) camCtrl.target.fromArray( target );
        camCtrl.update();
        return self;
    };

    const resize = ( w=0, h=0 )=>{
        const W = w || window.innerWidth;
        const H = h || window.innerHeight;

        renderer.setSize( W, H );           // Update Renderer
        composer.setSize( W, H );

        camera.aspect = W / H;              // Update Camera
        camera.updateProjectionMatrix();

        return self;
    };

    const getRendererSize = ()=>{ return renderer.getSize( new THREE.Vector2() ).toArray(); }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    window.addEventListener( 'resize', ()=>resize() );
    resize();

    return self = {
        renderer,
        scene,
        camera,
        camCtrl,
        composer,

        render,
        renderLoop,
        sphericalLook,
        resize,
        getRendererSize,

        addRenderPass : ( s=null, c=null )=>{ 
            composer.addPass( new RenderPass( s || scene, c || camera ) );
            return self;
        },
    };
}
// #endregion