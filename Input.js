export class Input {
  constructor() {
    this.keys = {};
    this.mouseDelta = { x: 0, y: 0 };
    this.isPointerLocked = false;

    window.addEventListener('keydown', (e) => (this.keys[e.code] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.code] = false));

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.mouseDelta.x += e.movementX;
        this.mouseDelta.y += e.movementY;
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.keys['Fire'] = true;
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.keys['Fire'] = false;
    });
  }

  requestPointerLock(element) {
    element.requestPointerLock();
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === element;
    });
  }

  consumeMouseDelta() {
    const delta = { ...this.mouseDelta };
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    return delta;
  }
}
