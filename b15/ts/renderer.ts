import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { Background } from './background.js'
import { Board, Dir } from './board.js'
import { today } from './today.js'


export class Renderer {

	private _width : number;
	private _height : number;
	private _canvasElm : HTMLElement;
	private _scene : THREE.Scene;
	private _camera : THREE.PerspectiveCamera;
	private _renderer : THREE.WebGLRenderer;
	private _controls : OrbitControls;

	private _board : Board;
	private _background : Background;

	constructor() {
		this._canvasElm = this.elm("canvas");
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(30, this._canvasElm.clientWidth / this._canvasElm.clientHeight, 0.1, 1000);
		this._camera.position.copy(new THREE.Vector3(0, 0, 45));
		this._camera.lookAt(new THREE.Vector3(0, 0, 0));
		
		this._renderer = new THREE.WebGLRenderer({canvas: this._canvasElm, antialias: true});
		this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this._controls = new OrbitControls(this._camera, this._renderer.domElement);
		this._controls.enabled = true;

		this._background = new Background();
		this._scene.add(this._background.scene());

		this._board = new Board("https://brianchoi.net/b15/dist/1.jpg");
		this._scene.add(this._board.scene());

		document.addEventListener("keydown", (e) => {
			let dir = Dir.UNKNOWN;
			if (e.keyCode === 38 || e.keyCode === 87) {
				dir = Dir.UP;
			} else if (e.keyCode === 40 || e.keyCode === 83) {
				dir = Dir.DOWN;
			} else if (e.keyCode === 37 || e.keyCode === 65) {
				dir = Dir.LEFT;
			} else if (e.keyCode === 39 || e.keyCode === 68) {
				dir = Dir.RIGHT;
			}

			if (dir !== Dir.UNKNOWN) {
				this._board.move(dir);
			}
		});

		document.addEventListener("click", (e) => {
			let mouse = new THREE.Vector3(e.clientX, e.clientY, 0);
			mouse.x = (mouse.x - this._width / 2) / (this._width / 2);
			mouse.y = (mouse.y - this._height / 2) / (-this._height / 2);

			mouse.unproject(this._camera);
			mouse.sub(this._camera.position).normalize();

			const distance = -this._camera.position.z / mouse.z;
			const mouseWorld = this._camera.position.clone();
			mouseWorld.add(mouse.multiplyScalar(distance));
			this._board.click(mouseWorld);

			e.stopPropagation();
		});

		this.resize();
		window.onresize = () => { this.resize(); };
	}

	start() : void {
		this.animate();
	}

	private animate() : void {
		this._board.update();
		this._background.update();
		this._renderer.toneMappingExposure = today.isNight() ? 0.4 : 1.0;
		this._renderer.render(this._scene, this._camera);
		this._controls.update();
		requestAnimationFrame(() => { this.animate(); });
	}

	private resize() {
		this._canvasElm.style.width = 100 + "vw";
		this._canvasElm.style.height = 100 + "vh";

		this._width = this._canvasElm.clientWidth;
		this._height = this._canvasElm.clientHeight;

		this._renderer.setSize(this._width, this._height);
		this._renderer.setPixelRatio(window.devicePixelRatio);
		this._camera.aspect = this._width / this._height;
		this._camera.updateProjectionMatrix();

		this._controls.update();
	}

	private elm(id : string) : HTMLElement {
		return document.getElementById(id);
	}
}