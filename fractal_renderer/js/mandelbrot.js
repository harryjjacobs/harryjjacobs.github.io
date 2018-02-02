const ZOOM_RES = 10;
const PAN_SENS = 0.005;

var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var zoom = 3;
var pan = new THREE.Vector2(0, 0);

window.onload = function() {
	init();
	render();
};

window.addEventListener('wheel', function(e) {
  if (e.deltaY < 0) {
    zoom-=zoom/ZOOM_RES;
  }
  if (e.deltaY > 0) {
    zoom+=zoom/ZOOM_RES;
  }
  console.log(zoom);
});

var startX = 0;
var startY = 0;
var mouseDown = false;
window.addEventListener('mousedown', function(e) {
	startX = e.clientX - pan.x/PAN_SENS/zoom;
	startY = e.clientY + pan.y/PAN_SENS/zoom;
	mouseDown = true;
});

window.addEventListener('mouseup', function(e) {
	mouseDown = false;
});


window.addEventListener('mousemove', function(e) {
	if (mouseDown) {
		pan = new THREE.Vector2(-(startX - e.clientX) * PAN_SENS * zoom, (startY - e.clientY) * PAN_SENS * zoom); // make panning more sensitive when at an increased zoom
	}
});

function init() {

	var width = window.innerWidth;
	var height = window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.PlaneGeometry(2, 2, 0);

	// set the material to a material using our shader
	material = new THREE.ShaderMaterial( {

		uniforms: {

			zoom: { type: 'f', value: zoom },
			maxIterations: { type: 'f', value: 128 },
			pan: { value: pan }

		},

		vertexShader: document.getElementById( 'vertexShader' ).innerHTML,

		fragmentShader: document.getElementById( 'fragmentShader' ).innerHTML

	});

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	document.body.appendChild( renderer.domElement );

}

function render (delta) {
	requestAnimationFrame(render);
	mesh.material.uniforms.zoom.value = zoom;
	mesh.material.uniforms.pan.value = pan;
	renderer.render(scene, camera);
}