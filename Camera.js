import * as THREE from 'three';
import { lerp } from '../utils/MathUtils.js';

export class CameraRig {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.pitch = 0;
    this.yaw = 0;

    this.bobTimer = 0;
    this.recoilOffset = { pitch: 0, yaw: 0 };

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  updateLook(deltaX, deltaY, sensitivity = 0.002) {
    this.yaw -= deltaX * sensitivity;
    this.pitch -= deltaY * sensitivity;
    this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
  }

  addRecoil(amount) {
    this.recoilOffset.pitch += amount;
    this.recoilOffset.yaw += (Math.random() - 0.5) * amount;
  }

  update(position, isMoving, isRunning, deltaTime) {
    this.recoilOffset.pitch = lerp(this.recoilOffset.pitch, 0, deltaTime * 10);
    this.recoilOffset.yaw = lerp(this.recoilOffset.yaw, 0, deltaTime * 10);

    const targetPitch = this.pitch + this.recoilOffset.pitch;
    const targetYaw = this.yaw + this.recoilOffset.yaw;

    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.y = targetYaw;
    this.camera.rotation.x = targetPitch;

    let bobX = 0;
    let bobY = 0;

    if (isMoving) {
      const speed = isRunning ? 12 : 7;
      this.bobTimer += deltaTime * speed;
      bobY = Math.sin(this.bobTimer) * (isRunning ? 0.08 : 0.04);
      bobX = Math.cos(this.bobTimer * 0.5) * (isRunning ? 0.05 : 0.02);
    } else {
      this.bobTimer += deltaTime * 2;
      bobY = Math.sin(this.bobTimer) * 0.008; // subtle breathing
    }

    this.camera.position.set(
      position.x + bobX,
      position.y + bobY,
      position.z
    );
  }
}
