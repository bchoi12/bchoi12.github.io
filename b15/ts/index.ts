import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

function elm(id : string) : HTMLElement {
	return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', (event) => {
	console.log("hello");

	main();
});

const texture = new THREE.TextureLoader().load("1.jpg");
const material = new THREE.MeshStandardMaterial( {map: texture, color: 0xbb4444 } );

var width : number;
var height : number;
var canvasElm : HTMLElement;
var scene : THREE.Scene;
var camera : THREE.Camera;
var renderer : THREE.WebGLRenderer;
var controls : OrbitControls;

function resize() {
	width = window.innerWidth;
	height = window.innerHeight;

	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);

	canvasElm.style.width = width + "px";
	canvasElm.style.height = height + "px";

	camera.aspect = width / height;

	controls.update();
}

function animate() {
	renderer.render(scene, camera);
	controls.update();
	requestAnimationFrame(() => { animate(); });
}

function main() : void {
	canvasElm = elm("canvas");
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(30, canvasElm.offsetWidth / canvasElm.offsetHeight, 0.1, 1000);
	camera.position.copy(new THREE.Vector3(0, 0, -40));
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	renderer = new THREE.WebGLRenderer({canvas: canvasElm, antialias: true});
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.0;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	const sky = new Sky();
	sky.scale.setScalar(4000);
	const uniforms = sky.material.uniforms;
	uniforms['turbidity'].value = 20;
	uniforms['rayleigh'].value = 0.2;
	uniforms['mieCoefficient'].value = 0.00003;
	uniforms['mieDirectionalG'].value = 0.999;

	const sun = new THREE.Vector3();
	sun.setFromSphericalCoords(1, 1.45, 0.93 * Math.PI);
	uniforms['sunPosition'].value.copy(sun);
	scene.add(sky);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x232323, 1.2);
	scene.add(hemisphereLight);

	const sunLight = new THREE.DirectionalLight(0xfdfbfd, 2.0);
	const sunLightOffset = uniforms['sunPosition'].value.clone();
	sunLightOffset.multiplyScalar(86);
	sunLight.position.copy(sunLightOffset);
	sunLight.castShadow = true;
	
	const side = 10;
	sunLight.shadow.camera = new THREE.OrthographicCamera(-side, side, side, -side, 0.1, 500 );
	sunLight.shadow.mapSize.width = 1024;
	sunLight.shadow.mapSize.height = 1024;
	sunLight.shadow.bias = -0.00018;

	scene.add(sunLight);
	scene.add(sunLight.target);

	scene.add(new THREE.Mesh(new THREE.SphereGeometry(3, 20, 12), material))

	window.onresize = () => { resize(); };
	resize();
	animate();
}