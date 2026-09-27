import * as THREE from 'three';
import { GAME_STATES } from '../utils/Constants.js';
import { CameraRig } from './Camera.js';
import { Input } from './Input.js';
import { Player } from './Player.js';
import { World } from '../world/World.js';
import { Enemy } from './Enemy.js';
import { Interaction } from './Interaction.js';
import { MissionManager } from './MissionManager.js';
import { HUD } from '../ui/HUD.js';
import { Menu } from '../ui/Menu.js';
import { BodyCamEffects } from '../effects/BodyCamEffects.js';
import { AudioManager } from '../audio/AudioManager.js';
import { MobileControls } from './MobileControls.js';

export class Game {
  constructor() {
    this.state = GAME_STATES.MENU;

    // Core Setup
    this.container = document.getElementById('game-container');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.08);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Systems Initialization
    this.cameraRig = new CameraRig();
    this.input = new Input();
    this.audioManager = new AudioManager();
    this.hud = new HUD();
    this.missionManager = new MissionManager();
    this.bodyCamEffects = new BodyCamEffects(document.getElementById('bodycam-canvas'));
    this.mobileControls = new MobileControls(this.input);

    this.world = new World(this.scene);
    this.player = new Player(this.cameraRig, this.scene);
    this.enemy = new Enemy(this.scene, 0, -10);
    this.interaction = new Interaction(this.cameraRig, this.scene);

    this.menu = new Menu(() => this.start());

    this.lastTime = performance.now();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  start() {
    this.audioManager.init();
    this.input.requestPointerLock(this.renderer.domElement);
    this.state = GAME_STATES.PLAYING;
    this.animate();
  }

  emitNoise(volume) {
    if (this.enemy) {
      this.enemy.ai.onHeardNoise(this.player.position, volume);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    if (this.state === GAME_STATES.PLAYING) {
      this.player.update(
        this.input,
        deltaTime,
        this.world,
        this.audioManager,
        (vol) => this.emitNoise(vol)
      );

      this.enemy.update(this.player.position, deltaTime);
      this.interaction.checkInteraction(this.hud);

      if (this.input.keys['KeyE']) {
        this.input.keys['KeyE'] = false;
        this.interaction.interact(this.player, this.audioManager, this.missionManager);
      }

      this.hud.update(this.player, this.missionManager.getCurrentObjective());
    }

    this.renderer.render(this.scene, this.cameraRig.camera);
    this.bodyCamEffects.render(now);
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
