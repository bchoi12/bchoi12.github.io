import * as THREE from 'three';
var State;
(function (State) {
    State[State["UNKNOWN"] = 0] = "UNKNOWN";
    State[State["DISABLED"] = 1] = "DISABLED";
    State[State["WAITING"] = 2] = "WAITING";
    State[State["LAUNCHING"] = 3] = "LAUNCHING";
    State[State["EXPLODING"] = 4] = "EXPLODING";
})(State || (State = {}));
export class Firework {
    constructor() {
        this._materialSize = 0.2;
        this._minScale = 1.0;
        this._maxScale = 10.0;
        this._launchTime = 1500;
        this._explodeTime = 1000;
        let geometry = new THREE.BufferGeometry();
        let points = [];
        let colors = [];
        for (let i = 0; i < 33; ++i) {
            points.push(this.randomRange(-1, 1));
            points.push(this.randomRange(-1, 1));
            points.push(this.randomRange(-1, 1));
            colors.push(Math.random());
            colors.push(Math.random());
            colors.push(Math.random());
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
        this._mesh = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: this._materialSize,
            opacity: 1.0,
            vertexColors: true,
            transparent: true,
        }));
        this._startPos = new THREE.Vector3(0, -30, -30);
        this._state = State.DISABLED;
        this._launchStarted = Date.now();
        this._explodeStarted = Date.now();
    }
    enable() {
        this._state = State.WAITING;
        const light = new THREE.PointLight(0xff0000, 3, 100);
        this._mesh.add(light);
    }
    mesh() {
        return this._mesh;
    }
    update() {
        switch (this._state) {
            case State.WAITING:
                this._mesh.position.copy(this._startPos);
                this._launchStarted = Date.now();
                this._state = State.LAUNCHING;
                break;
            case State.LAUNCHING:
                this._mesh.position.y += 0.6;
                if (Date.now() - this._launchStarted >= this._launchTime) {
                    this._explodeStarted = Date.now();
                    this._state = State.EXPLODING;
                }
                break;
            case State.EXPLODING:
                this._mesh.scale.x += 0.5;
                this._mesh.scale.y += 0.5;
                this._mesh.scale.z += 0.5;
                if (Date.now() - this._explodeStarted >= this._explodeTime) {
                    this._mesh.scale.x = this._minScale;
                    this._mesh.scale.y = this._minScale;
                    this._mesh.scale.z = this._minScale;
                    this._mesh.material.size = this._materialSize;
                    this._state = State.WAITING;
                }
                break;
        }
    }
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}
