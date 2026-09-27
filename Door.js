import * as THREE from 'three';

export class Door {
  constructor(scene, x, z, requiresCard = false) {
    this.requiresCard = requiresCard;
    this.isOpen = false;
    this.isLocked = requiresCard;

    this.group = new THREE.Group();
    this.group.position.set(x, 0, z);

    const doorGeo = new THREE.BoxGeometry(1.6, 2.8, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({ color: requiresCard ? 0x882222 : 0x444444, roughness: 0.6 });
    this.mesh = new THREE.Mesh(doorGeo, doorMat);
    this.mesh.position.set(0.8, 1.4, 0); // Pivot at edge

    this.mesh.userData = { interactive: true, instance: this };
    this.group.add(this.mesh);
    scene.add(this.group);
  }

  interact(player, audioManager) {
    if (this.isLocked) {
      if (player.hasKeycard) {
        this.isLocked = false;
        audioManager.playProceduralSound('click');
      } else {
        audioManager.playProceduralSound('click');
        return 'ACCESS CARD REQUIRED';
      }
    }

    this.isOpen = !this.isOpen;
    this.mesh.rotation.y = this.isOpen ? Math.PI / 2 : 0;
    audioManager.playProceduralSound('door');
    return this.isOpen ? 'PORTA ABERTA' : 'PORTA FECHADA';
  }
}
