export class HUD {
  constructor() {
    this.hpEl = document.getElementById('hp-val');
    this.stmEl = document.getElementById('stm-val');
    this.batEl = document.getElementById('bat-val');
    this.ammoEl = document.getElementById('ammo-val');
    this.timerEl = document.getElementById('cam-timer');
    this.promptEl = document.getElementById('interaction-prompt');
    this.objectiveEl = document.getElementById('objective-text');

    this.startTime = Date.now();
  }

  update(player, missionText) {
    this.hpEl.textContent = Math.ceil(player.hp);
    this.stmEl.textContent = Math.ceil(player.stamina);
    this.batEl.textContent = Math.ceil(player.battery);

    if (player.currentWeapon) {
      this.ammoEl.textContent = `${player.currentWeapon.clip} / ${player.currentWeapon.reserve}`;
    }

    if (missionText) {
      this.objectiveEl.textContent = missionText;
    }

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    this.timerEl.textContent = `${hrs}:${mins}:${secs}`;
  }

  showPrompt(text) {
    this.promptEl.style.display = 'block';
    this.promptEl.textContent = text;
  }

  hidePrompt() {
    this.promptEl.style.display = 'none';
  }
}
