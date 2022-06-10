import * as THREE from 'three';
export class Piece {
    constructor(texture, size) {
        this._size = size;
        const material = new THREE.MeshStandardMaterial({ map: texture });
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
    update() {
        const ts = Date.now() - this._moveStart;
        if (ts < this._moveTime) {
            const x = ts / this._moveTime;
            const weight = 2.4 * x * x - 1.4 * x;
            const moveFrom = this._moveFrom.clone();
            moveFrom.lerp(this._pos, weight);
            this._mesh.position.copy(moveFrom);
        }
        else if (ts < this._moveTime + 100) {
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
    mesh() {
        return this._mesh;
    }
    jiggle(millis) {
        this._jiggle = true;
        this._stopJiggle = Date.now() + millis;
    }
    move(pos, millis) {
        this._moveFrom = this._pos;
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
    show() {
        this._show = true;
    }
    hide() {
        this._mesh.material.transparent = true;
        this._mesh.material.opacity = 0;
    }
    addSides() {
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const geometry = new THREE.PlaneGeometry(this._size, this._size);
        const back = new THREE.Mesh(geometry, material);
        back.position.z = -1;
        back.rotation.y = Math.PI;
        this._mesh.add(back);
    }
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}
