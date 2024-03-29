// in the future can prob do : <script type="importmap" src="/import-map.json"></script>
const prepend = ( document.location.hostname.indexOf( 'localhost' ) === -1 )? '/mapping' : '';

document.body.appendChild(Object.assign(document.createElement('script'), {
type		: 'importmap',
innerHTML	: `
    {"imports":{
        "three"             : "${prepend}/lib/thirdparty/three.module.min.js",
        "OrbitControls"	    : "${prepend}/lib/thirdparty/OrbitControls.js",
        "TransformControls"	: "${prepend}/lib/thirdparty/TransformControls.js",
        "gl-matrix"         : "${prepend}/lib/thirdparty/gl-matrix/index.js",
        "earcut"            : "${prepend}/lib/thirdparty/earcut.js",
        "postprocess/"      : "${prepend}/lib/thirdparty/threePostProcess/"
    }}
`}));