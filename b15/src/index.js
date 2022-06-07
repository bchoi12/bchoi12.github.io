import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
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
function animate() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(() => { animate(); });
}
var Helper;
(function (Helper) {
    function getNumber(row, col) {
        return row * 4 + col;
    }
    Helper.getNumber = getNumber;
    function getPos(row, col) {
        return new THREE.Vector2(3 * col - 1.5 * pieceSize, (2 - row) * 3 - 0.5 * pieceSize);
    }
    Helper.getPos = getPos;
    function valid(row, col) {
        return row >= 0 && col >= 0 && row <= 3 && col <= 3;
    }
    Helper.valid = valid;
})(Helper || (Helper = {}));
class Board {
    constructor(url) {
        this.scene = new THREE.Scene();
        this.url = url;
        this.pieces = new Map();
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                if (i === 3 && j === 3) {
                    continue;
                }
                this.addPiece(i, j);
            }
        }
    }
    addPiece(row, col) {
        new THREE.TextureLoader().load(this.url, (texture) => {
            let piece = new Piece(row, col, texture);
            this.pieces.set(piece.num, piece);
            this.scene.add(piece.mesh);
        });
    }
    moveAll(horizontal, vertical) {
        for (const [cur, piece] of this.pieces.entries()) {
            const row = piece.row;
            const col = piece.col;
            if (!Helper.valid(row + vertical, col + horizontal)) {
                continue;
            }
            const num = Helper.getNumber(row + vertical, col + horizontal);
            if (!this.pieces.has(num)) {
                console.log(num + " " + horizontal + " " + vertical);
                this.pieces.set(num, this.pieces.get(Number(cur)));
                this.pieces.delete(Number(cur));
                this.pieces.get(num).move(row + vertical, col + horizontal);
                return true;
            }
        }
        return false;
    }
    move(row, col) {
        const cur = Helper.getNumber(row, col);
        if (!this.pieces.has(cur)) {
            return false;
        }
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                if (i === 0 && j === 0) {
                    continue;
                }
                if (!Helper.valid(row + i, col + j)) {
                    continue;
                }
                const num = Helper.getNumber(row + i, col + j);
                if (!this.pieces.has(num)) {
                    this.pieces.set(num, this.pieces.get(cur));
                    this.pieces.delete(cur);
                    this.pieces.get(num).move(row + i, col + j);
                    return true;
                }
            }
        }
        return false;
    }
}
class Piece {
    constructor(row, col, texture) {
        this.row = row;
        this.col = col;
        this.num = Helper.getNumber(row, col);
        let geometry = new THREE.PlaneGeometry(pieceSize, pieceSize);
        let uvPositions = [];
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length / 3; i++) {
            let [x, y] = [vertices[3 * i], vertices[3 * i + 1]];
            const u = (x + pieceSize / 2) / pieceSize;
            const v = (y + pieceSize / 2) / pieceSize;
            uvPositions.push(0.25 * u + col / 4);
            uvPositions.push(0.25 * v + (3 - row) / 4);
        }
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvPositions, 2));
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: texture }));
        this.move(row, col);
    }
    move(row, col) {
        if (typeof this.mesh === 'undefined') {
            return;
        }
        this.row = row;
        this.col = col;
        const pos = Helper.getPos(row, col);
        this.mesh.position.x = pos.x;
        this.mesh.position.y = pos.y;
    }
    correct() {
        return Helper.getNumber(this.row, this.col) === this.num;
    }
}
function main() {
    canvasElm = elm("canvas");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, canvasElm.offsetWidth / canvasElm.offsetHeight, 0.1, 1000);
    camera.position.copy(new THREE.Vector3(0, 0, 40));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({ canvas: canvasElm, antialias: true });
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
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x565656, 1.2);
    scene.add(hemisphereLight);
    const sunLight = new THREE.DirectionalLight(0xfdfbfd, 2.0);
    const sunLightOffset = uniforms['sunPosition'].value.clone();
    sunLightOffset.multiplyScalar(86);
    sunLight.position.copy(sunLightOffset);
    sunLight.castShadow = true;
    const side = 10;
    sunLight.shadow.camera = new THREE.OrthographicCamera(-side, side, side, -side, 0.1, 500);
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.00018;
    scene.add(sunLight);
    scene.add(sunLight.target);
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 })));
    const board = new Board("https://brianchoi.net/b15/dist/1.jpg");
    scene.add(board.scene);
    document.addEventListener("keydown", (e) => {
        if (e.keyCode === 38 || e.keyCode === 87) {
            board.moveAll(0, -1);
        }
        if (e.keyCode === 40 || e.keyCode === 83) {
            board.moveAll(0, 1);
        }
        if (e.keyCode === 37 || e.keyCode === 65) {
            board.moveAll(-1, 0);
        }
        if (e.keyCode === 39 || e.keyCode === 68) {
            board.moveAll(1, 0);
        }
    });
    window.onresize = () => { resize(); };
    resize();
    animate();
}
