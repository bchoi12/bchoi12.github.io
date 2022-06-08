import * as THREE from 'three'

export class Piece {
	private _num : number;
	private _mesh : THREE.Mesh;

	private _pos : THREE.Vector3;
	private _moveFrom : THREE.Vector3;
	private _moveStart : number;
	private _moveTime : number;

	private _jiggle : boolean;
	private _jiggleDir : number;
	private _stopJiggle : number;

	constructor(texture : THREE.Texture, size : number) {
		const material = new THREE.MeshStandardMaterial({map: texture});
		let geometry = new THREE.PlaneGeometry(size, size);
		this._mesh = new THREE.Mesh(geometry, material);

		this._pos = new THREE.Vector3();
		this._moveFrom = new THREE.Vector3();
		this._moveStart = 0;
		this._moveTime = 0;

		this._jiggle = false;
		this._jiggleDir = 1;
		this._stopJiggle = 0;
	}

	update() : void {
		const ts = Date.now() - this._moveStart;
		if (ts < this._moveTime) {
			const x = ts / this._moveTime;
			const weight = 2.4 * x * x - 1.4 * x;

			const moveFrom = this._moveFrom.clone();
			moveFrom.lerp(this._pos, weight);
			this._mesh.position.copy(moveFrom);
		} else if (ts < this._moveTime + 100) {
			this._mesh.position.copy(this._pos);
		}

		if (this._jiggle) {
			this._mesh.rotation.z += 0.03 * this._jiggleDir;

			if (this._mesh.rotation.z >= 0.2) {
				this._jiggleDir = -1;
			}
			if (this._mesh.rotation.z <= -0.2) {
				this._jiggleDir = 1;
			}

			if (Date.now() >= this._stopJiggle) {
				this._mesh.rotation.x = 0;
				this._mesh.rotation.y = 0;
				this._mesh.rotation.z = 0;
				this._jiggle = false;
			}
		}

	}

	mesh() : THREE.Mesh {
		return this._mesh;
	}

	jiggle(millis : number) : void {
		this._jiggle = true;
		this._stopJiggle = Date.now() + millis;
	}

	move(pos : THREE.Vector3, millis : number) : void {
		this._moveFrom = this._pos
		this._pos = pos.clone();

		if (typeof this._mesh === 'undefined') {
			return;
		}

		if (millis <= 0) {
			this._mesh.position.copy(pos);
			return;
		}

		this._moveStart = Date.now();
		this._moveTime = millis;
	}

	show() : void {
		// @ts-ignore
		this._mesh.material.opacity = 1;
	}

	hide() : void {
		this._mesh.visible = false;
		// @ts-ignore
		this._mesh.material.transparent = true;
		// @ts-ignore
		this._mesh.material.opacity = 0;
	}

	private randomRange(min : number, max : number) : number {
		return Math.random() * (max - min) + min;
	}
}