import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
export class Background {
    constructor() {
        this._scene = new THREE.Scene();
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
        this._scene.add(sky);
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x565656, 1.2);
        this._scene.add(hemisphereLight);
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
        this._scene.add(sunLight);
        this._scene.add(sunLight.target);
    }
    scene() {
        return this._scene;
    }
}
