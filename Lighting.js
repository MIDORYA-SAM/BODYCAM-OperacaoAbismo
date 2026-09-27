import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;

    // Ambient Darkness
    this.ambientLight = new THREE.AmbientLight(0x05050a, 0.4);
    this.scene.add(this.ambientLight);

    // Dynamic Flashlight
    this.flashlight = new THREE.SpotLight(0xffffff, 5, 25, Math.PI / 6, 0.4, 1);
    this.flashlight.castShadow = true;
    this.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.flashlight);
    this.scene.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;

    this.isFlashlightOn = true;
  }

  toggleFlashlight() {
    this.isFlashlightOn = !this.isFlashlightOn;
    this.flashlight.visible = this.isFlashlightOn;
  }

  updateFlashlight(camera, batteryLevel) {
    if (!this.isFlashlightOn) return;

    this.flashlight.position.copy(camera.position);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    this.flashlightTarget.position.copy(camera.position).add(dir.multiplyScalar(5));

    // Low battery flicker simulation
    if (batteryLevel < 20 && Math.random() < 0.1) {
      this.flashlight.intensity = Math.random() * 2;
    } else {
      this.flashlight.intensity = 5 * (batteryLevel / 100);
    }
  }

  addHallwayLight(x, y, z, color = 0xffaa44) {
    const light = new THREE.PointLight(color, 2, 10);
    light.position.set(x, y, z);
    this.scene.add(light);
    return light;
  }
}
