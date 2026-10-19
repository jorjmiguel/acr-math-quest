// TARGETING MATH QUEST - COMPLETE ENGINE

// CURRICULUM BATTLE DECKS (P5 & P6 Semesters)
const QUESTION_BANK = {
  P5: {
    Sem1: [
      { step1: "Identify values: base = 8cm, height = 5cm", step2: "Formula: Area = 1/2 × base × height", q: "Calculate area of triangle with base 8cm and height 5cm.", choices: ["20 cm²", "40 cm²", "13 cm²"], answer: 0, topic: "Area of Triangle" },
      { step1: "Identify values: 45,000 and 35,000", step2: "Operation: Addition (+)", q: "What is 45,000 + 35,000?", choices: ["80,000", "75,000", "70,000"], answer: 0, topic: "Whole Numbers" }
    ],
    Sem2: [
      { step1: "Decimal multiplication", step2: "Multiply 45 × 6 then place decimal point", q: "Calculate: 4.5 × 6", choices: ["27.0", "24.5", "26.0"], answer: 0, topic: "Decimals" },
      { step1: "Fraction to percentage", step2: "Multiply fraction by 100%", q: "Convert 4/5 into a percentage.", choices: ["80%", "75%", "85%"], answer: 0, topic: "Percentage" }
    ]
  },
  P6: {
    Sem1: [
      { step1: "Algebraic simplification", step2: "Combine like terms: (5 + 3 - 2)x", q: "Simplify: 5x + 3x - 2x", choices: ["6x", "8x", "4x"], answer: 0, topic: "Algebra" },
      { step1: "Circle circumference", step2: "Formula: 2 × π × r", q: "Find circumference with radius 7cm (π = 22/7).", choices: ["44 cm", "154 cm", "88 cm"], answer: 0, topic: "Circles" }
    ],
    Sem2: [
      { step1: "Distance = 180km, Time = 2 hours", step2: "Formula: Speed = Distance / Time", q: "Find speed of train traveling 180 km in 2 hours.", choices: ["90 km/h", "360 km/h", "80 km/h"], answer: 0, topic: "Speed" },
      { step1: "Pie chart geometry", step2: "Full circle angle definition", q: "Degrees in a full circle pie chart?", choices: ["360°", "180°", "270°"], answer: 0, topic: "Pie Charts" }
    ]
  }
};

// MATH DICTIONARY DATABASE
const DICTIONARY = [
  { word: "Add", def: "To put numbers together to make a bigger number. (3 + 4 = 7)" },
  { word: "Angle", def: "The space between two lines that meet at a point, measured in degrees." },
  { word: "Area", def: "The size of a flat surface inside a shape, measured in square units." },
  { word: "Radius", def: "The distance from the center of a circle to its outer edge." },
  { word: "Vertex", def: "A corner where two or more lines or edges meet." }
];

// PLAYER & GAME STATE
let player = {
  name: "Student",
  grade: "P5",
  semester: "Sem1",
  studentId: "50612",
  section: "5/1",
  career: "Engineer",
  level: 1,
  xp: 0,
  gold: 100,
  x: 240,
  y: 320
};

// ACR CAMPUS LANDMARKS & NPCS
const LANDMARKS = [
  { name: "ACR School Gate", x: 180, y: 340, w: 120, h: 30, color: "#8b5cf6" },
  { name: "Hunsa Cafe", x: 40, y: 260, w: 90, h: 50, color: "#f59e0b" },
  { name: "Football Field", x: 160, y: 160, w: 160, h: 100, color: "#10b981" },
  { name: "Mathematics Building", x: 40, y: 60, w: 110, h: 60, color: "#3b82f6" },
  { name: "Holy Spirit Building", x: 330, y: 260, w: 110, h: 60, color: "#ef4444" }
];

const NPCS = [
  { name: "Master George", x: 90, y: 130, dialog: "Welcome to the Mathematics Building! Ready to practice Polya's 4 steps?" },
  { name: "Miss Lek", x: 300, y: 130, dialog: "I teach ICT and Computers. Remember to double-check your calculations!" },
  { name: "Miss Fatima", x: 380, y: 330, dialog: "English Math Dictionary is open. Learning words makes problem-solving easier!" }
];

// NAVIGATION SYSTEM
function navTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (screenId === 'screen-rpg') {
    startOverworldLoop();
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// ONBOARDING & CAREER HANDLERS
function handleRPGStart(e) {
  e.preventDefault();
  player.grade = document.getElementById("student-grade").value;
  player.semester = document.getElementById("student-semester").value;
  player.name = document.getElementById("student-name").value.trim();
  player.studentId = document.getElementById("student-id").value.trim();
  player.section = document.getElementById("student-section").value.trim();

  navTo('screen-career');
}

function selectCareer(careerName) {
  player.career = careerName;
  updateHUD();
  navTo('screen-rpg');
}

function updateHUD() {
  document.getElementById("hud-name").innerText = player.name;
  document.getElementById("hud-career").innerText = player.career;
  document.getElementById("hud-lvl").innerText = player.level;
  document.getElementById("hud-xp").innerText = player.xp;
  document.getElementById("hud-gold").innerText = player.gold;
}

// OVERWORLD CANVAS ENGINE
const canvas = document.getElementById("rpg-canvas");
const ctx = canvas.getContext("2d");
let animationFrame = null;

function startOverworldLoop() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  loop();
}

function loop() {
  // Clear Canvas
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Landmarks
  LANDMARKS.forEach(l => {
    ctx.fillStyle = l.color;
    ctx.fillRect(l.x, l.y, l.w, l.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.fillText(l.name, l.x + 5, l.y + 15);
  });

  // Draw NPCs
  NPCS.forEach(n => {
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(n.name, n.x - 20, n.y - 12);
  });

  // Draw Player Avatar
  ctx.fillStyle = "#3b82f6"; // Primary blue hero
  ctx.fillRect(player.x - 8, player.y - 8, 16, 16);
  ctx.fillStyle = "#f59e0b"; // Career gear hat
  ctx.fillRect(player.x - 6, player.y - 12, 12, 4);

  // Render Minimap
  renderMinimap();

  animationFrame = requestAnimationFrame(loop);
}

function movePlayer(dir) {
  const speed = 12;
  if (dir === 'up' && player.y > 20) player.y -= speed;
  if (dir === 'down' && player.y < canvas.height - 20) player.y += speed;
  if (dir === 'left' && player.x > 20) player.x -= speed;
  if (dir === 'right' && player.x < canvas.width - 20) player.x += speed;

  // Check Football Field Quest Trigger
  if (player.x > 160 && player.x < 320 && player.y > 160 && player.y < 260) {
    if (Math.random() < 0.3) launchPolyaBattle();
  }
}

function interactNearestNPC() {
  let nearest = null;
  NPCS.forEach(n => {
    let dist = Math.hypot(n.x - player.x, n.y - player.y);
    if (dist < 40) nearest = n;
  });

  const dialogueBox = document.getElementById("dialogue-box");
  if (nearest) {
    document.getElementById("dialogue-speaker").innerText = nearest.name;
    document.getElementById("dialogue-text").innerText = nearest.dialog;
    dialogueBox.classList.remove("hidden");
  } else {
    document.getElementById("dialogue-speaker").innerText = "Campus Exploration";
    document.getElementById("dialogue-text").innerText = "Walk closer to a teacher or enter the Football Field to trigger a math quest!";
    dialogueBox.classList.remove("hidden");
  }
}

function closeDialogue() {
  document.getElementById("dialogue-box").classList.add("hidden");
}

// MINIMAP RENDERER
const miniCanvas = document.getElementById("minimap-canvas");
const miniCtx = miniCanvas.getContext("2d");

function renderMinimap() {
  miniCtx.fillStyle = "#000000";
  miniCtx.fillRect(0, 0, 90, 90);

  // Scale map
  let sx = 90 / canvas.width;
  let sy = 90 / canvas.height;

  LANDMARKS.forEach(l => {
    miniCtx.fillStyle = l.color;
    miniCtx.fillRect(l.x * sx, l.y * sy, l.w * sx, l.h * sy);
  });

  miniCtx.fillStyle = "#ffffff";
  miniCtx.fillRect(player.x * sx - 2, player.y * sy - 2, 4, 4);
}

// POLYA 4-STEP BATTLE SYSTEM
let activeQuestion = null;
let currentPolyaStep = 1;

function launchPolyaBattle() {
  const pool = QUESTION_BANK[player.grade][player.semester];
  activeQuestion = pool[Math.floor(Math.random() * pool.length)];
  currentPolyaStep = 1;

  renderPolyaStep();
  document.getElementById("modal-battle").classList.add("active");
}

function renderPolyaStep() {
  // Update step badges
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`polya-${i}`).className = (i === currentPolyaStep) ? "active" : "";
  }

  const qBox = document.getElementById("battle-question");
  const optionsGrid = document.getElementById("battle-options");
  const feedback = document.getElementById("battle-feedback");
  feedback.innerText = "";

  if (currentPolyaStep === 1) {
    document.getElementById("battle-step-tag").innerText = "Step 1: Understand";
    qBox.innerText = `[Understand the Problem]\n${activeQuestion.step1}`;
    optionsGrid.innerHTML = `<button class="option-btn" onclick="nextPolyaStep()">I understand the facts -> Next Step</button>`;
  } else if (currentPolyaStep === 2) {
    document.getElementById("battle-step-tag").innerText = "Step 2: Plan";
    qBox.innerText = `[Make a Plan]\n${activeQuestion.step2}`;
    optionsGrid.innerHTML = `<button class="option-btn" onclick="nextPolyaStep()">Plan ready -> Solve Problem</button>`;
  } else if (currentPolyaStep === 3) {
    document.getElementById("battle-step-tag").innerText = "Step 3: Solve";
    qBox.innerText = `[Calculate Answer]\n${activeQuestion.q}`;
    optionsGrid.innerHTML = "";
    activeQuestion.choices.forEach((choice, idx) => {
      optionsGrid.innerHTML += `<button class="option-btn" onclick="evaluateAnswer(${idx})">${choice}</button>`;
    });
  } else if (currentPolyaStep === 4) {
    document.getElementById("battle-step-tag").innerText = "Step 4: Verify";
    qBox.innerText = `[Look Back & Verify]\nIs the answer logical? You earned +10 XP and +15 Gold!`;
    optionsGrid.innerHTML = `<button class="option-btn" onclick="completeBattle()">Claim Reward & Return to Overworld</button>`;
  }
}

function nextPolyaStep() {
  currentPolyaStep++;
  renderPolyaStep();
}

function evaluateAnswer(selectedIdx) {
  const feedback = document.getElementById("battle-feedback");
  if (selectedIdx === activeQuestion.answer) {
    feedback.innerText = "✓ Correct calculation!";
    feedback.className = "feedback correct";
    player.xp += 10;
    player.gold += 15;
    updateHUD();
    setTimeout(() => {
      currentPolyaStep = 4;
      renderPolyaStep();
    }, 1000);
  } else {
    feedback.innerText = "✗ Incorrect! Check your calculation.";
    feedback.className = "feedback incorrect";
  }
}

function completeBattle() {
  closeModal("modal-battle");
  player.x = 240; player.y = 320; // Move out of battle zone trigger
}

function closeBattleModal() {
  closeModal("modal-battle");
}

// SYSTEM MODALS
function toggleMenuModal() {
  document.getElementById("modal-menu").classList.toggle("active");
}

function openDailyGospelModal() {
  closeModal("modal-menu");
  document.getElementById("modal-gospel").classList.add("active");
}

function claimGospelBlessing() {
  alert("Gospel Blessing Activated! +5% XP bonus applied to all quests today.");
  closeModal("modal-gospel");
}

function openDictionaryModal() {
  closeModal("modal-menu");
  document.getElementById("modal-dictionary").classList.add("active");
  filterDictionary();
}

function filterDictionary() {
  const query = document.getElementById("dict-search").value.toLowerCase();
  const list = document.getElementById("dict-list");
  list.innerHTML = "";
  DICTIONARY.filter(d => d.word.toLowerCase().includes(query)).forEach(d => {
    list.innerHTML += `<div style="background:white; padding:8px; margin-bottom:6px; border-radius:6px;"><b>${d.word}</b><p style="font-size:0.85rem;">${d.def}</p></div>`;
  });
}

function openTeacherPinModal() {
  closeModal("modal-menu");
  document.getElementById("modal-teacher").classList.add("active");
}

function verifyTeacherPin() {
  const pin = document.getElementById("teacher-pin-input").value;
  if (pin === "ACR2026") {
    alert("Teacher Access Granted! Test mode enabled.");
    closeModal("modal-teacher");
  } else {
    alert("Invalid Teacher PIN!");
  }
}
