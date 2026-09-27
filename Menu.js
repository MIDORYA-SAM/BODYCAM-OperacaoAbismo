export class Menu {
  constructor(onStartCallback) {
    this.menuEl = document.getElementById('main-menu');
    this.startBtn = document.getElementById('btn-start');

    this.startBtn.addEventListener('click', () => {
      this.hide();
      onStartCallback();
    });
  }

  show() {
    this.menuEl.style.display = 'flex';
  }

  hide() {
    this.menuEl.style.display = 'none';
  }
}
