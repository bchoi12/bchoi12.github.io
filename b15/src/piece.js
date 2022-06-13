import * as THREE from 'three';
export class Piece {
    constructor(texture, size) {
        this._purpleMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x702963, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0xBF40BF, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0xCF9FFF, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0xDA70D6, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0x800080, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0x673147, shadowSide: THREE.FrontSide })
        ];
        this._size = size;
        this._sizeZ = size;
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
            const weight = this._weightFn(x);
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
    move(pos, millis = 0, weightFn = (x) => { return 2.4 * x * x - 1.4 * x; }) {
        this._moveFrom = this._pos;
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
    show() {
        this._mesh.visible = true;
        this._show = true;
    }
    hide() {
        this._mesh.visible = false;
        this._mesh.material.transparent = true;
        this._mesh.material.opacity = 0;
    }
    addSides() {
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const geometry = new THREE.PlaneGeometry(this._size, this._size);
        const back = new THREE.Mesh(geometry, this.randomMaterial());
        back.rotation.y = Math.PI;
        back.position.z = -this._sizeZ;
        back.castShadow = true;
        back.receiveShadow = true;
        this._mesh.add(back);
        const left = new THREE.Mesh(new THREE.PlaneGeometry(this._sizeZ, this._size), this.randomMaterial());
        left.rotation.y = 3 * Math.PI / 2;
        left.position.z = -this._sizeZ / 2;
        left.position.x = -this._size / 2;
        left.castShadow = true;
        left.receiveShadow = true;
        this._mesh.add(left);
        const right = new THREE.Mesh(new THREE.PlaneGeometry(this._sizeZ, this._size), this.randomMaterial());
        right.rotation.y = Math.PI / 2;
        right.position.z = -this._sizeZ / 2;
        right.position.x = this._size / 2;
        right.castShadow = true;
        right.receiveShadow = true;
        this._mesh.add(right);
        const up = new THREE.Mesh(new THREE.PlaneGeometry(this._size, this._sizeZ), this.randomMaterial());
        up.rotation.x = 3 * Math.PI / 2;
        up.position.z = -this._sizeZ / 2;
        up.position.y = this._size / 2;
        up.castShadow = true;
        up.receiveShadow = true;
        this._mesh.add(up);
        const down = new THREE.Mesh(new THREE.PlaneGeometry(this._size, this._sizeZ), this.randomMaterial());
        down.rotation.x = Math.PI / 2;
        down.position.z = -this._sizeZ / 2;
        down.position.y = -this._size / 2;
        down.castShadow = true;
        down.receiveShadow = true;
        this._mesh.add(down);
    }
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    randomMaterial() {
        const random = Math.random();
        for (let i = 0; i < this._purpleMaterials.length; ++i) {
            if (random <= (i + 1) / this._purpleMaterials.length) {
                return this._purpleMaterials[i];
            }
        }
        return this._purpleMaterials[0];
    }
}
