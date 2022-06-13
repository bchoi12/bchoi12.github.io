import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { today } from './today.js';
export class Background {
    constructor() {
        this._scene = new THREE.Scene();
        this._sky = new Sky();
        this._sky.scale.setScalar(4000);
        this._sunPos = new THREE.Vector3();
        this._scene.add(this._sky);
        this._hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x565656, 1.2);
        this._scene.add(this._hemisphereLight);
        this._sunLight = new THREE.DirectionalLight(0xfdfbfd, 2.0);
        const side = 10;
        this._sunLight.castShadow = true;
        this._sunLight.shadow.camera = new THREE.OrthographicCamera(-side, side, side, -side, 0.1, 500);
        this._sunLight.shadow.mapSize.width = 1024;
        this._sunLight.shadow.mapSize.height = 1024;
        this._sunLight.shadow.bias = -0.00018;
        this._scene.add(this._sunLight);
        this._scene.add(this._sunLight.target);
        this._spotLights = new Array();
        for (let i of [-1, 1]) {
            const spotLight = new THREE.SpotLight(0xffffff, 2.0);
            spotLight.position.set(12 * i, 20, 12);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 0.1;
            spotLight.shadow.camera.far = 100;
            spotLight.shadow.camera.fov = 30;
            spotLight.target.position.copy(new THREE.Vector3());
            this._spotLights.push(spotLight);
            this._scene.add(spotLight);
            this._scene.add(spotLight.target);
        }
        this.updateSky();
        this._fireworks = new Array();
    }
    scene() {
        return this._scene;
    }
    update() {
        this.updateSky();
        this._fireworks.forEach((firework) => {
            firework.update();
        });
    }
    updateSky() {
        const night = today.isNight();
        let uniforms = this._sky.material.uniforms;
        uniforms['turbidity'].value = 1;
        uniforms['rayleigh'].value = 1.0;
        uniforms['mieCoefficient'].value = 0.1;
        uniforms['mieDirectionalG'].value = night ? 1 : 0.9999;
        this._sunPos.setFromSphericalCoords(1, this.sunAngle(), 0.97 * Math.PI);
        uniforms['sunPosition'].value.copy(this._sunPos);
        const sunLightOffset = uniforms['sunPosition'].value.clone();
        sunLightOffset.multiplyScalar(86);
        this._sunLight.position.copy(sunLightOffset);
        this._sunLight.intensity = today.isNight() ? 0.3 : 2.0;
        this._spotLights.forEach((spotLight) => {
            spotLight.intensity = today.isNight() ? 2.0 : 0.3;
        });
    }
    sunAngle() {
        if (today.isNight()) {
            return 4 * Math.PI / 9;
        }
        const hours = today.currentHours();
        const minutesSinceSunrise = 60 * (hours - today.sunrise()) + new Date().getMinutes();
        const percent = minutesSinceSunrise / ((today.sunset() - today.sunrise()) * 60);
        return Math.PI / 2 * 2 * Math.abs(0.5 - percent);
    }
}
