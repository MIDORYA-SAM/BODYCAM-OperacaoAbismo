import * as THREE from 'three';
import { WEAPON_TYPES } from '../utils/Constants.js';
import { Weapon } from './Weapon.js';

export class Player {
  constructor(cameraRig, scene) {
    this.cameraRig = cameraRig;
    this.position = new THREE.Vector3(0, 1.6, -20);

    this.hp = 100;
    this.stamina = 100;
    this.battery = 100;
    this.hasKeycard = false;

    this.isCrouching = false;
    this.isRunning = false;

    this.weapons = [
      new Weapon(WEAPON_TYPES.PISTOL, cameraRig, scene),
      new Weapon(WEAPON_TYPES.SHOTGUN, cameraRig, scene),
      new Weapon(WEAPON_TYPES.SMG, cameraRig, scene)
    ];
    this.currentWeaponIndex = 0;

    this.stepTimer = 0;
  }

  get currentWeapon() {
    return this.weapons[this.currentWeaponIndex];
  }

  switchWeapon(index) {
    if (index >= 0 && index < this.weapons.length) {
      this.weapons.forEach(w => w.group.visible = false);
      this.currentWeaponIndex = index;
      this.weapons[index].group.visible = true;
    }
  }

  update(input, deltaTime, world, audioManager, onNoiseEmit) {
    // Battery Drain
    if (world.lighting.isFlashlightOn) {
      this.battery = Math.max(0, this.battery - deltaTime * 0.5);
    }

    // Crouching
    this.isCrouching = !!input.keys['ControlLeft'];
    const targetHeight = this.isCrouching ? 1.0 : 1.6;
    this.position.y += (targetHeight - this.position.y) * deltaTime * 10;

    // Movement
    let speed = this.isCrouching ? 2.0 : 4.0;
    this.isRunning = !!input.keys['ShiftLeft'] && !this.isCrouching && this.stamina > 5;

    if (this.isRunning) {
      speed = 7.0;
      this.stamina = Math.max(0, this.stamina - deltaTime * 15);
    } else {
      this.stamina = Math.min(100, this.stamina + deltaTime * 8);
    }

    const moveDir = new THREE.Vector3();
    if (input.keys['KeyW']) moveDir.z -= 1;
    if (input.keys['KeyS']) moveDir.z += 1;
    if (input.keys['KeyA']) moveDir.x -= 1;
    if (input.keys['KeyD']) moveDir.x += 1;

    moveDir.normalize();
    moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraRig.yaw);

    const isMoving = moveDir.lengthSq() > 0;
    if (isMoving) {
      this.position.x += moveDir.x * speed * deltaTime;
      this.position.z += moveDir.z * speed * deltaTime;

      // Footstep Sound & Noise Emission
      this.stepTimer += deltaTime * (this.isRunning ? 2.5 : 1.5);
      if (this.stepTimer > 1.0) {
        this.stepTimer = 0;
        audioManager.playProceduralSound('footstep');
        onNoiseEmit(this.isRunning ? 8.0 : 3.0);
      }
    }

    // Flashlight Toggle
    if (input.keys['KeyF']) {
      input.keys['KeyF'] = false;
      world.lighting.toggleFlashlight();
      audioManager.playProceduralSound('click');
    }

    // Weapon Switching
    if (input.keys['Digit1']) this.switchWeapon(0);
    if (input.keys['Digit2']) this.switchWeapon(1);
    if (input.keys['Digit3']) this.switchWeapon(2);

    // Shooting & Reload
    if (input.keys['Fire']) {
      this.currentWeapon.shoot(audioManager, onNoiseEmit);
    }
    if (input.keys['KeyR']) {
      input.keys['KeyR'] = false;
      this.currentWeapon.reload(audioManager);
    }

    // Camera Rig Sync
    const mouseDelta = input.consumeMouseDelta();
    this.cameraRig.updateLook(mouseDelta.x, mouseDelta.y);
    this.cameraRig.update(this.position, isMoving, this.isRunning, deltaTime);

    world.lighting.updateFlashlight(this.cameraRig.camera, this.battery);
  }
}
