import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Background } from './background.js';
import { Board, Dir } from './board.js';
function elm(id) {
    return document.getElementById(id);
}
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("hello");
    main();
});
const pieceSize = 3;
var width;
var height;
var canvasElm;
var scene;
var camera;
var renderer;
var controls;
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasElm.style.width = width + "px";
    canvasElm.style.height = height + "px";
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    controls.update();
}
function animate(board) {
    board.update();
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(() => { animate(board); });
}
function main() {
    canvasElm = elm("canvas");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, canvasElm.offsetWidth / canvasElm.offsetHeight, 0.1, 1000);
    camera.position.copy(new THREE.Vector3(0, 0, 45));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({ canvas: canvasElm, antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.update();
    const background = new Background();
    scene.add(background.scene());
    const board = new Board("https://brianchoi.net/b15/dist/1.jpg");
    scene.add(board.scene());
    document.addEventListener("keydown", (e) => {
        if (e.keyCode === 38 || e.keyCode === 87) {
            board.move(Dir.UP);
        }
        if (e.keyCode === 40 || e.keyCode === 83) {
            board.move(Dir.DOWN);
        }
        if (e.keyCode === 37 || e.keyCode === 65) {
            board.move(Dir.LEFT);
        }
        if (e.keyCode === 39 || e.keyCode === 68) {
            board.move(Dir.RIGHT);
        }
    });
    document.addEventListener("click", (e) => {
        let mouse = new THREE.Vector3(e.clientX, e.clientY, 0);
        mouse.x = (mouse.x - width / 2) / (width / 2);
        mouse.y = (mouse.y - height / 2) / (-height / 2);
        mouse.unproject(camera);
        mouse.sub(camera.position).normalize();
        const distance = -camera.position.z / mouse.z;
        const mouseWorld = camera.position.clone();
        mouseWorld.add(mouse.multiplyScalar(distance));
        board.click(mouseWorld);
        e.stopPropagation();
    });
    window.onresize = () => { resize(); };
    resize();
    animate(board);
}
