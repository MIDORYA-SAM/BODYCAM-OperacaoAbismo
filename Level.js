import * as THREE from 'three';

export class Level {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.buildSubterraneanComplex();
  }

  buildSubterraneanComplex() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.5 });
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.9 });

    // Floor & Ceiling
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);

    const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3;
    this.scene.add(ceiling);

    // Helper to create walls
    const addWall = (x, z, w, d) => {
      const geo = new THREE.BoxGeometry(w, 3, d);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, 1.5, z);
      this.scene.add(mesh);

      const box = new THREE.Box3().setFromObject(mesh);
      this.colliders.push(box);
    };

    // Perimeter
    addWall(0, -30, 60, 1);
    addWall(0, 30, 60, 1);
    addWall(-30, 0, 1, 60);
    addWall(30, 0, 1, 60);

    // Corridor and Room Walls
    addWall(-10, -10, 1, 40); // Main hallway
    addWall(10, 0, 1, 40);
    addWall(0, 10, 20, 1);
  }
}
