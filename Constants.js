export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAMEOVER: 'GAMEOVER'
};

export const QUALITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  ULTRA: 'ULTRA'
};

export const WEAPON_TYPES = {
  PISTOL: {
    id: 'PISTOL',
    name: 'Pistola 9mm',
    maxClip: 12,
    reserveAmmo: 36,
    damage: 35,
    fireRate: 0.25,
    recoil: 0.04,
    noise: 15.0
  },
  SHOTGUN: {
    id: 'SHOTGUN',
    name: 'Espingarda 12ga',
    maxClip: 6,
    reserveAmmo: 18,
    damage: 120,
    fireRate: 0.8,
    recoil: 0.12,
    noise: 30.0
  },
  SMG: {
    id: 'SMG',
    name: 'SMG Tática',
    maxClip: 30,
    reserveAmmo: 90,
    damage: 20,
    fireRate: 0.09,
    recoil: 0.025,
    noise: 18.0
  }
};

export const AI_STATES = {
  PATROL: 'PATROL',
  INVESTIGATE: 'INVESTIGATE',
  CHASE: 'CHASE',
  SEARCH: 'SEARCH',
  RETURN: 'RETURN'
};
