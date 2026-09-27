import * as THREE from 'three';
import { WEAPON_TYPES } from '../utils/Constants.js';

export class Weapon {
  constructor(typeConfig, cameraRig, scene) {
    this.config = typeConfig;
    this.cameraRig = cameraRig;
    this.scene = scene;

    this.clip = typeConfig.maxClip;
    this.reserve = typeConfig.reserveAmmo;
    this.lastShotTime = 0;

    this.createPlaceholderMesh();
  }

  createPlaceholderMesh() {
    this.group = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.1, 0.12, 0.4);
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0.2, -0.2, -0.4);
    this.group.add(this.mesh);

    this.cameraRig.camera.add(this.group);
  }

  shoot(audioManager, onNoiseEmit) {
    const now = performance.now() / 1000;
    if (now - this.lastShotTime < this.config.fireRate) return false;
    if (this.clip <= 0) {
      audioManager.playProceduralSound('click');
      return false;
    }

    this.clip--;
    this.lastShotTime = now;

    audioManager.playProceduralSound('gunshot');
    this.cameraRig.addRecoil(this.config.recoil);

    onNoiseEmit(this.config.noise);
    return true;
  }

  reload(audioManager) {
    const needed = this.config.maxClip - this.clip;
    if (needed > 0 && this.reserve > 0) {
      const amount = Math.min(needed, this.reserve);
      this.clip += amount;
      this.reserve -= amount;
      audioManager.playProceduralSound('click');
    }
  }
}
