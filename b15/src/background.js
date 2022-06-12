import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { today } from './today.js';
export class Background {
    constructor() {
        this._scene = new THREE.Scene();
        const sky = new Sky();
        sky.scale.setScalar(4000);
        const uniforms = sky.material.uniforms;
        this.setUniforms(uniforms);
        const sun = new THREE.Vector3();
        sun.setFromSphericalCoords(1, this.sunAngle(), 0.97 * Math.PI);
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
        for (let i of [-1, 1]) {
            const spotLight = new THREE.SpotLight(0xffffff, today.isNight() ? 2.0 : 0.3);
            spotLight.position.set(12 * i, 20, 12);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 0.1;
            spotLight.shadow.camera.far = 100;
            spotLight.shadow.camera.fov = 30;
            spotLight.target.position.copy(new THREE.Vector3());
            this._scene.add(spotLight);
            this._scene.add(spotLight.target);
        }
    }
    scene() {
        return this._scene;
    }
    update() {
    }
    setUniforms(uniforms) {
        const night = today.isNight();
        uniforms['turbidity'].value = 2;
        uniforms['rayleigh'].value = 1.0;
        uniforms['mieCoefficient'].value = 0.1;
        uniforms['mieDirectionalG'].value = night ? 1 : 0.9999;
    }
    sunAngle() {
        if (today.isNight()) {
            return 4 * Math.PI / 9;
        }
        const hours = today.currentHours();
        const minutesSinceSunrise = 60 * (hours - today.sunrise()) + new Date().getMinutes();
        const percent = minutesSinceSunrise / ((today.sunset() - today.sunrise()) * 60);
        return Math.PI / 2 * percent;
    }
}
