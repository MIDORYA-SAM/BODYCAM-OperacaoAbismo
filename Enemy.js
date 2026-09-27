<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>BODYCAM — OPERAÇÃO ABISMO</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #000;
      font-family: 'Courier New', Courier, monospace;
      color: #fff;
    }
    #game-container {
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    #bodycam-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }
    #ui-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
    }
    .cam-header {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      gap: 15px;
      font-size: 14px;
      font-weight: bold;
      color: #00ff66;
      text-shadow: 0 0 5px rgba(0, 255, 102, 0.7);
    }
    .rec-dot {
      width: 12px;
      height: 12px;
      background-color: #ff0000;
      border-radius: 50%;
      display: inline-block;
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.2; }
    }
    .cam-footer {
      position: absolute;
      bottom: 25px;
      left: 25px;
      font-size: 13px;
      line-height: 1.6;
      background: rgba(0, 0, 0, 0.4);
      padding: 10px;
      border-left: 2px solid #00ff66;
    }
    #interaction-prompt {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: bold;
      background: rgba(0,0,0,0.7);
      padding: 8px 16px;
      border: 1px solid #ffffff;
      display: none;
    }
    #crosshair {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    #mission-hud {
      position: absolute;
      top: 20px;
      right: 20px;
      text-align: right;
      font-size: 12px;
      background: rgba(0,0,0,0.5);
      padding: 10px;
      border-right: 2px solid #ffcc00;
    }
    /* Menu & Overlay Styles */
    .overlay-menu {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(5, 5, 5, 0.95);
      z-index: 100;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      pointer-events: auto;
    }
    .menu-title {
      font-size: 32px;
      letter-spacing: 4px;
      margin-bottom: 5px;
      color: #e6e6e6;
      text-shadow: 0 0 10px #ff0000;
    }
    .menu-subtitle {
      font-size: 14px;
      color: #888;
      margin-bottom: 30px;
    }
    .btn {
      background: transparent;
      border: 1px solid #555;
      color: #fff;
      padding: 12px 30px;
      margin: 8px;
      font-family: inherit;
      font-size: 14px;
      cursor: pointer;
      width: 240px;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #fff;
      color: #000;
      border-color: #fff;
    }

    /* Settings Panel */
    .settings-panel {
      display: none;
      flex-direction: column;
      gap: 15px;
      width: 300px;
      background: rgba(20, 20, 20, 0.8);
      padding: 20px;
      border: 1px solid #444;
      margin-bottom: 15px;
    }
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }
    .setting-item label {
      color: #ccc;
    }
    .setting-item input[type="range"] {
      width: 120px;
    }

    /* Controls Overlay for Mobile */
    #mobile-controls {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 20;
      pointer-events: none;
    }
    .touch-btn {
      position: absolute;
      pointer-events: auto;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <canvas id="bodycam-canvas"></canvas>

  <div id="ui-layer">
    <div class="cam-header">
      <span><span class="rec-dot"></span> REC</span>
      <span id="cam-id">CAM-03</span>
      <span id="cam-timer">00:00:00</span>
    </div>

    <div class="cam-footer">
      <div>HP: <span id="hp-val">100</span>%</div>
      <div>STM: <span id="stm-val">100</span>%</div>
      <div>BAT: <span id="bat-val">100</span>%</div>
      <div>AMMO: <span id="ammo-val">12 / 36</span></div>
    </div>

    <div id="crosshair"></div>
    <div id="interaction-prompt">[E] INTERAGIR</div>

    <div id="mission-hud">
      <div style="color: #ffcc00; font-weight: bold; margin-bottom: 4px;">MISSÃO ATUAL</div>
      <div id="objective-text">Localizar a equipe desaparecida</div>
    </div>
  </div>

  <div id="mobile-controls">
    <div id="joystick-zone" style="position: absolute; bottom: 30px; left: 30px; width: 120px; height: 120px; background: rgba(255,255,255,0.05); border-radius: 50%; pointer-events: auto;"></div>
    <div id="btn-fire" class="touch-btn" style="bottom: 40px; right: 40px; width: 65px; height: 65px; background: rgba(255,0,0,0.3);">TIRO</div>
    <div id="btn-interact" class="touch-btn" style="bottom: 120px; right: 40px; width: 50px; height: 50px;">E</div>
    <div id="btn-flashlight" class="touch-btn" style="bottom: 180px; right: 40px; width: 50px; height: 50px;">F</div>
    <div id="btn-reload" class="touch-btn" style="bottom: 40px; right: 120px; width: 50px; height: 50px;">R</div>
    <div id="btn-crouch" class="touch-btn" style="bottom: 100px; right: 120px; width: 50px; height: 50px;">C</div>
  </div>

  <!-- Menu Principal e Configurações -->
  <div id="main-menu" class="overlay-menu">
    <div class="menu-title">BODYCAM</div>
    <div class="menu-subtitle">OPERAÇÃO ABISMO — SETOR 07</div>

    <div id="menu-buttons">
      <button class="btn" id="btn-start">INICIAR OPERAÇÃO</button>
      <br />
      <button class="btn" id="btn-settings">CONFIGURAÇÕES</button>
    </div>

    <div id="settings-panel" class="settings-panel">
      <div class="setting-item">
        <label for="sens-slider">SENSIBILIDADE</label>
        <input type="range" id="sens-slider" min="1" max="10" value="5" />
      </div>
      <div class="setting-item">
        <label for="volume-slider">VOLUME MASTER</label>
        <input type="range" id="volume-slider" min="0" max="100" value="50" />
      </div>
      <div class="setting-item">
        <label for="bodycam-toggle">EFEITOS BODYCAM</label>
        <input type="checkbox" id="bodycam-toggle" checked />
      </div>
      <button class="btn" id="btn-back-settings" style="width: 100%; margin-top: 10px;">VOLTAR</button>
    </div>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
