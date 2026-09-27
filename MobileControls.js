export class MobileControls {
  constructor(inputManager) {
    this.input = inputManager;
    this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.container = document.getElementById('mobile-controls');

    if (this.isMobile) {
      this.container.style.display = 'block';
      this.initButtons();
    }
  }

  initButtons() {
    const bindBtn = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.input.keys[key] = true;
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.input.keys[key] = false;
      });
    };

    bindBtn('btn-fire', 'Fire');
    bindBtn('btn-interact', 'KeyE');
    bindBtn('btn-flashlight', 'KeyF');
    bindBtn('btn-reload', 'KeyR');
    bindBtn('btn-crouch', 'ControlLeft');
  }
}
