// ACR Math Quest RPG Engine

// CURRICULUM BATTLE DECKS (P5/P6 routing)
const BATTLE_DECKS = {
  P5: {
    Sem1: [
      { q: "What is 45,000 + 35,000?", choices: ["80,000", "75,000"], answer: 0, topic: "Whole Numbers" },
      { q: "A triangle has base 8cm and height 5cm. Area?", choices: ["20 cm²", "40 cm²"], answer: 0, topic: "Area" }
    ],
    Sem2: [
      { q: "Calculate: 4.5 × 6", choices: ["27.0", "24.5"], answer: 0, topic: "Decimals" },
      { q: "Convert 4/5 into a percentage.", choices: ["80%", "75%"], answer: 0, topic: "Percentage" }
    ]
  },
  P6: {
    Sem1: [
      { q: "Simplify the algebraic expression: 5x + 3x - 2x", choices: ["6x", "8x"], answer: 0, topic: "Algebra" },
      { q: "Find the circumference of a circle with radius 7cm (π = 22/7).", choices: ["44 cm", "154 cm"], answer: 0, topic: "Circles" }
    ],
    Sem2: [
      { q: "A train travels 180 km in 2 hours. Find its speed.", choices: ["90 km/h", "360 km/h"], answer: 0, topic: "Speed" },
      { q: "How many degrees represents a full circle in a pie chart?", choices: ["360°", "180°"], answer: 0, topic: "Pie Charts" }
    ]
  }
};

// RPG PLAYER STATE
let gameState = {
  screen: 'login',
  player: {
    grade: '', semester: '', name: '', studentId: '', section: '',
    career: 'Not Selected', level: 1, xp: 0,
    x: 240, y: 350 // Spawn point on ACR map (bottom gate)
  },
  testMode: false
};

// RPG CANVAS ENGINE
const canvas = document.getElementById('rpg-canvas');
const ctx = canvas.getContext('2d');

// Game Assets (Load Placeholders)
const assets = {
  acrMap: new Image(), playerSprite: new Image()
};

// RPG Game Loop
function gameLoop() {
  if (gameState.screen !== 'rpg') return;
  
  // 1. CLEAR CANVAS
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 2. DRAW ACR MAP (Matches screenshot_55 overworld style)
  ctx.fillStyle = "#88ccaa"; ctx.fillRect(0, 0, 480, 400); // Base ground
  ctx.fillStyle = "#fff"; ctx.font = "20px bold"; ctx.fillText("ACR CAMPUS MAP", 20, 30);
  
  // 3. DRAW ACR LANDMARKS (Places from screenshot_56 minimap labels)
  ctx.fillStyle = "#ffeecc"; ctx.fillRect(100, 50, 100, 60); ctx.fillStyle="#000"; ctx.fillText("ACR Gate", 105, 80);
  ctx.fillStyle = "#ffeecc"; ctx.fillRect(250, 50, 120, 60); ctx.fillText("Cafe", 260, 80);
  ctx.fillStyle = "#aaccaa"; ctx.fillRect(100, 200, 280, 100); ctx.fillText("Football Field", 120, 250);

  // 4. DRAW PLAYER SPRITE
  ctx.fillStyle = "#ff0055"; // Padlet pink player square placeholder
  ctx.fillRect(gameState.player.x, gameState.player.y, 16, 16);
  
  // 5. DRAW MINIMAP (Matches screenshot_55)
  updateMinimap();

  requestAnimationFrame(gameLoop);
}

// virtual D-pad Movement
function movePlayer(dir) {
  if (gameState.screen !== 'rpg') return;
  const speed = 10;
  if (dir === 'up' && gameState.player.y > speed) gameState.player.y -= speed;
  if (dir === 'down' && gameState.player.y < canvas.height - 16 - speed) gameState.player.y += speed;
  if (dir === 'left' && gameState.player.x > speed) gameState.player.x -= speed;
  if (dir === 'right' && gameState.player.x < canvas.width - 16 - speed) gameState.player.x += speed;
  
  checkZoneTriggers();
}

// Zones & Quest Triggers
function checkZoneTriggers() {
  // Football field battle trigger
  if (gameState.player.x > 100 && gameState.player.x < 380 && gameState.player.y > 200 && gameState.player.y < 300) {
    launchBattle();
  }
}

// BATTLE ENGINE
let activeBattleQuestion = null;

function launchBattle() {
  const gradeDeck = BATTLE_DECKS[gameState.player.grade];
  const semPool = gradeDeck[gameState.player.semester];
  activeBattleQuestion = semPool[Math.floor(Math.random() * semPool.length)];

  document.getElementById('battle-topic').innerText = activeBattleQuestion.topic;
  document.getElementById('battle-question').innerText = activeBattleQuestion.q;
  
  const options = document.getElementById('battle-options');
  options.innerHTML = "";
  activeBattleQuestion.choices.forEach((choice, i) => {
    options.innerHTML += `<button class="option-btn" onclick="checkBattleAnswer(${i})">${choice}</button>`;
  });

  document.getElementById('modal-battle').classList.add('active');
}

function checkBattleAnswer(index) {
  const feedback = document.getElementById('battle-feedback');
  if (index === activeBattleQuestion.answer) {
    feedback.innerText = "✓ Correct! +10 XP";
    feedback.className = "feedback correct";
    gameState.player.xp += 10;
    setTimeout(() => { document.getElementById('modal-battle').classList.remove('active'); loadNextLevelRPG(); }, 1200);
  } else {
    feedback.innerText = "✗ Try again!";
    feedback.className = "feedback incorrect";
  }
}

function loadNextLevelRPG() {
  if (gameState.player.xp >= gameState.player.level * 30) {
    gameState.player.level++;
  }
  gameState.player.x = 240; gameState.player.y = 350; // Reset player
  syncToCloud();
  updateRPG_HUD();
}

// Cloud Sync Placeholder (Your link goes here)
function syncToCloud() {
  // Payload for studentId, name, career, grade, level, xp, semester
}

// Minimap rendering
const minimapCanvas = document.getElementById('minimap-canvas');
const miniCtx = minimapCanvas.getContext('2d');
function updateMinimap() {
  miniCtx.fillStyle = "#000"; miniCtx.fillRect(0,0,100,100);
  miniCtx.fillStyle = "#88ccaa"; miniCtx.fillRect(0,0,100,100);
  miniCtx.fillStyle = "#fff"; miniCtx.fillRect(gameState.player.x * (100/480), gameState.player.y * (100/400), 5, 5);
}

// UIExtensions
function selectCareer(career) {
  gameState.player.career = career;
  gameState.screen = 'rpg';
  document.getElementById('screen-career').classList.remove('active');
  document.getElementById('screen-rpg').classList.add('active');
  updateRPG_HUD();
  requestAnimationFrame(gameLoop); // START RPG ENGINE
}

// Onboarding routing
function handleRPGStart(e) {
  e.preventDefault();
  gameState.player.grade = document.getElementById('student-grade').value;
  gameState.player.semester = document.getElementById('student-semester').value;
  gameState.player.name = document.getElementById('student-name').value;
  gameState.player.studentId = document.getElementById('student-id').value;
  gameState.player.section = document.getElementById('student-section').value;

  gameState.screen = 'career';
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-career').classList.add('active');
}

function updateRPG_HUD() {
  document.getElementById('hud-name').innerText = gameState.player.name;
  document.getElementById('hud-career').innerText = gameState.player.career;
  document.getElementById('hud-lvl').innerText = gameState.player.level;
  document.getElementById('hud-xp').innerText = gameState.player.xp;
}

// Teacher PIN System
function openTeacherPinModal() { document.getElementById('modal-teacher').classList.add('active'); }
function closeTeacherPinModal() { document.getElementById('modal-teacher').classList.remove('active'); }
function verifyTeacherPin() {
  const pin = document.getElementById('teacher-pin-input').value;
  if (pin === "ACR2026") { // CUSTOM PIN
    // Bypass locks logic
  } else { alert("Invalid PIN"); }
}
