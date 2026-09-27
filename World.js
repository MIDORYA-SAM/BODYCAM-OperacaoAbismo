import { Level } from './Level.js';
import { Lighting } from './Lighting.js';
import { Door } from './Door.js';
import { Props } from './Props.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.level = new Level(scene);
    this.lighting = new Lighting(scene);

    this.doors = [
      new Door(scene, 0, 10, true) // Security sector locked door
    ];

    Props.createCrate(scene, -3, -5);
    Props.createCrate(scene, -4, -5);
    this.keycardMesh = Props.createKeycard(scene, 5, -8);

    // Hallway environment lights
    this.lighting.addHallwayLight(0, 2.5, -15, 0xffaa33);
    this.lighting.addHallwayLight(0, 2.5, 5, 0x3366ff);
  }
}
