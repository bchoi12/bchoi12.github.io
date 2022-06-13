import * as THREE from 'three'

export class Piece {
	// https://htmlcolorcodes.com/colors/shades-of-purple/
	private readonly _purpleMaterials : Array<THREE.Material> = [
		// byzantium
		new THREE.MeshStandardMaterial({color: 0x702963, shadowSide: THREE.FrontSide}),
		// bright purple
		new THREE.MeshStandardMaterial({color: 0xBF40BF, shadowSide: THREE.FrontSide}),
		// light violet
		new THREE.MeshStandardMaterial({color: 0xCF9FFF, shadowSide: THREE.FrontSide}),		
		// orchid
		new THREE.MeshStandardMaterial({color: 0xDA70D6, shadowSide: THREE.FrontSide}),
		// purple		
		new THREE.MeshStandardMaterial({color: 0x800080, shadowSide: THREE.FrontSide}),
		// plum
		new THREE.MeshStandardMaterial({color: 0x673147, shadowSide: THREE.FrontSide})];

	private _size : number;
	private _sizeZ : number;
	private _mesh : THREE.Mesh;

	private _pos : THREE.Vector3;
	private _moveFrom : THREE.Vector3;
	private _moveStart : number;
	private _moveTime : number;
	private _weightFn : any;

	private _jiggle : boolean;
	private _jiggleDir : number;
	private _stopJiggle : number;

	private _show : boolean;

	constructor(texture : THREE.Texture, size : number) {
		this._size = size;
		this._sizeZ = size;

		const material = new THREE.MeshStandardMaterial({map: texture});
		const geometry = new THREE.PlaneGeometry(size, size);
		this._mesh = new THREE.Mesh(geometry, material);
		this._mesh.castShadow = true;
		this._mesh.receiveShadow = true;

		this._pos = new THREE.Vector3();
		this._moveFrom = new THREE.Vector3();
		this._moveStart = 0;
		this._moveTime = 0;

		this._jiggle = false;
		this._jiggleDir = 1;
		this._stopJiggle = 0;

		this._show = false;

		this.addSides();
	}

	update() : void {
		const ts = Date.now() - this._moveStart;
		if (ts < this._moveTime) {
			const x = ts / this._moveTime;
			const weight = this._weightFn(x);

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

		if (this._show && this._mesh.material.opacity < 1) {
			this._mesh.material.opacity += 0.01;
		}

	}

	mesh() : THREE.Mesh {
		return this._mesh;
	}

	jiggle(millis : number) : void {
		this._jiggle = true;
		this._stopJiggle = Date.now() + millis;
	}

	move(pos : THREE.Vector3, millis : number = 0, weightFn : any = (x) => { return 2.4 * x * x - 1.4 * x}) : void {
		this._moveFrom = this._pos
		this._pos = pos.clone();

		if (typeof this._mesh === 'undefined') {
			return;
		}

		if (millis <= 0) {
			this._mesh.position.copy(pos);
			return;
		}

		this._weightFn = weightFn;
		this._moveStart = Date.now();
		this._moveTime = millis;
	}

	show() : void {
		this._mesh.visible = true;
		this._show = true;
	}

	hide() : void {
		this._mesh.visible = false;
		this._mesh.material.transparent = true;
		this._mesh.material.opacity = 0;
	}

	private addSides() : void {
		const material = new THREE.MeshStandardMaterial({color: 0xff0000});
		const geometry = new THREE.PlaneGeometry(this._size, this._size);

		const back = new THREE.Mesh(geometry, this.randomMaterial());
		back.rotation.y = Math.PI;
		back.position.z = -this._sizeZ;
		back.receiveShadow = true;
		this._mesh.add(back);

		const left = new THREE.Mesh(new THREE.PlaneGeometry(this._sizeZ, this._size), this.randomMaterial());
		left.rotation.y = 3 * Math.PI / 2;
		left.position.z = -this._sizeZ / 2;
		left.position.x = -this._size / 2; 
		left.receiveShadow = true;
		this._mesh.add(left);

		const right = new THREE.Mesh(new THREE.PlaneGeometry(this._sizeZ, this._size), this.randomMaterial());
		right.rotation.y = Math.PI / 2;
		right.position.z = -this._sizeZ / 2;
		right.position.x = this._size / 2; 
		right.receiveShadow = true;
		this._mesh.add(right);

		const up = new THREE.Mesh(new THREE.PlaneGeometry(this._size, this._sizeZ), this.randomMaterial());
		up.rotation.x = 3 * Math.PI / 2;
		up.position.z = -this._sizeZ / 2;
		up.position.y = this._size / 2; 
		up.receiveShadow = true;
		this._mesh.add(up);

		const down = new THREE.Mesh(new THREE.PlaneGeometry(this._size, this._sizeZ), this.randomMaterial());
		down.rotation.x = Math.PI / 2;
		down.position.z = -this._sizeZ / 2;
		down.position.y = -this._size / 2; 
		down.receiveShadow = true;
		this._mesh.add(down);
	}

	private randomRange(min : number, max : number) : number {
		return Math.random() * (max - min) + min;
	}

	private randomMaterial() : THREE.MeshStandardMaterial {
		const random = Math.random();
		for (let i = 0; i < this._purpleMaterials.length; ++i) {
			if (random <= (i + 1) / this._purpleMaterials.length) {
				return this._purpleMaterials[i];
			}
		}
		return this._purpleMaterials[0];
	} 
}