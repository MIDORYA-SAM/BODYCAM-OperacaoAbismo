import * as THREE from 'three';
import { AI_STATES } from '../utils/Constants.js';
import { distance2D } from '../utils/MathUtils.js';

export class EnemyAI {
  constructor(enemyMesh) {
    this.mesh = enemyMesh;
    this.state = AI_STATES.PATROL;
    this.targetPos = new THREE.Vector3(0, 0, -20);
    this.speed = 2.0;
  }

  onHeardNoise(noisePos, volume) {
    if (volume > 10.0 && this.state !== AI_STATES.CHASE) {
      this.state = AI_STATES.INVESTIGATE;
      this.targetPos.copy(noisePos);
    }
  }

  update(playerPos, deltaTime) {
    const distToPlayer = distance2D(
      this.mesh.position.x, this.mesh.position.z,
      playerPos.x, playerPos.z
    );

    if (distToPlayer < 12.0) {
      this.state = AI_STATES.CHASE;
    } else if (this.state === AI_STATES.CHASE && distToPlayer > 20.0) {
      this.state = AI_STATES.SEARCH;
    }

    if (this.state === AI_STATES.CHASE) {
      this.targetPos.copy(playerPos);
      this.speed = 3.8;
    } else {
      this.speed = 1.8;
    }

    // Basic Movement Towards Target
    const dir = new THREE.Vector3().subVectors(this.targetPos, this.mesh.position);
    dir.y = 0;
    if (dir.length() > 0.5) {
      dir.normalize();
      this.mesh.position.addScaledVector(dir, this.speed * deltaTime);
      this.mesh.lookAt(this.targetPos.x, this.mesh.position.y, this.targetPos.z);
    }
  }
}
