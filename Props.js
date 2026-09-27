import * as THREE from 'three';

export class Props {
  static createCrate(scene, x, z) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x554433, roughness: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.5, z);
    scene.add(mesh);
    return mesh;
  }

  static createKeycard(scene, x, z) {
    const geo = new THREE.BoxGeometry(0.3, 0.02, 0.2);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00aaff, roughness: 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.8, z);
    mesh.userData = { interactive: true, type: 'KEYCARD' };
    scene.add(mesh);
    return mesh;
  }
}
