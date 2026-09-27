import * as THREE from 'three';

export class Interaction {
  constructor(cameraRig, scene) {
    this.cameraRig = cameraRig;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 2.5;
    this.currentTarget = null;
  }

  checkInteraction(hud) {
    const origin = this.cameraRig.camera.position;
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.cameraRig.camera.quaternion);

    this.raycaster.set(origin, dir);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData.interactive && obj.parent) {
        obj = obj.parent;
      }

      if (obj && obj.userData.interactive) {
        this.currentTarget = obj;
        hud.showPrompt('[E] INTERAGIR');
        return;
      }
    }

    this.currentTarget = null;
    hud.hidePrompt();
  }

  interact(player, audioManager, missionManager) {
    if (!this.currentTarget) return;

    if (this.currentTarget.userData.instance) {
      this.currentTarget.userData.instance.interact(player, audioManager);
    } else if (this.currentTarget.userData.type === 'KEYCARD') {
      player.hasKeycard = true;
      this.scene.remove(this.currentTarget);
      audioManager.playProceduralSound('click');
      missionManager.advanceObjective(2);
    }
  }
}
