import * as THREE from 'three';
import { EnemyAI } from './EnemyAI.js';

export class Enemy {
  constructor(scene, x, z) {
    this.scene = scene;

    // Creepy Humanoid Silhouette
    this.group = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.3, 2.0, 8);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;

    const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Glowing eyes visual trigger
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.0;

    this.group.add(body);
    this.group.add(head);
    this.group.position.set(x, 0, z);

    this.scene.add(this.group);
    this.ai = new EnemyAI(this.group);
  }

  update(playerPos, deltaTime) {
    this.ai.update(playerPos, deltaTime);
  }
}
