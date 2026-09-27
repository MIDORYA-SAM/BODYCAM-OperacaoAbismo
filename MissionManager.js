export class MissionManager {
  constructor() {
    this.objectives = [
      '1. Entrar no complexo subterrâneo',
      '2. Encontrar o cartão de acesso de segurança',
      '3. Desbloquear a porta do Setor 07',
      '4. Investigar o laboratório e encontrar sobreviventes'
    ];
    this.currentIndex = 0;
  }

  getCurrentObjective() {
    return this.objectives[this.currentIndex];
  }

  advanceObjective(index) {
    if (index > this.currentIndex && index < this.objectives.length) {
      this.currentIndex = index;
    }
  }
}
