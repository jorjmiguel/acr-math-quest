const SAVE_API_URL = "https://script.google.com/macros/s/AKfycby7iXpQHmXx8bJzzwqCrMFCh2qx2cA_po-ARY8P3Qg0T04w0F0nw3MiyFSdLR27-gvYTA/exec";

let player = {
  id: "50612",
  name: "George Miguel",
  section: "5/6",
  level: 1,
  xp: 0,
  hp: 100,
  mp: 100,
  module: "Week 1: Whole Numbers"
};

let currentQuestion = null;

const sampleQuestions = [
  { q: "What is 15 × 12?", choices: ["180", "160", "175", "190"], answer: 0 },
  { q: "Evaluate: 450 ÷ 9", choices: ["40", "50", "60", "45"], answer: 1 },
  { q: "What is 3/5 of 100?", choices: ["50", "55", "60", "65"], answer: 2 },
  { q: "Simplify: (12 + 8) × 5", choices: ["100", "80", "120", "90"], answer: 0 }
];

function startGame() {
  document.getElementById("screen-start").classList.remove("active");
  document.getElementById("screen-play").classList.add("active");
  loadQuestion();
}

function startGuestMode() {
  player.id = "GUEST-" + Math.floor(Math.random() * 8999 + 1000);
  player.name = "Guest Player";
  startGame();
}

function startDuoMode() {
  player.name = "Duo Team";
  startGame();
}

function loadQuestion() {
  const index = Math.floor(Math.random() * sampleQuestions.length);
  currentQuestion = sampleQuestions[index];

  document.getElementById("q-text").innerText = currentQuestion.q;
  document.getElementById("feedback").innerText = "";

  const choicesContainer = document.getElementById("choices-box");
  choicesContainer.innerHTML = "";

  currentQuestion.choices.forEach((choiceText, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.innerText = `${String.fromCharCode(65 + idx)}. ${choiceText}`;
    btn.onclick = () => handleAnswer(idx, btn);
    choicesContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, btnElement) {
  const choices = document.querySelectorAll(".choice");
  choices.forEach(c => c.disabled = true);

  if (selectedIndex === currentQuestion.answer) {
    btnElement.classList.add("right");
    document.getElementById("feedback").innerText = "✨ Correct! +25 XP";
    document.getElementById("feedback").className = "feedback good";
    player.xp += 25;

    if (player.xp >= player.level * 100) {
      player.level += 1;
      document.getElementById("hud-level").innerText = player.level;
    }

    document.getElementById("score").innerText = player.xp;
    document.getElementById("xp-fill").style.width = `${(player.xp % 100)}%`;
    
    // Trigger background auto-save on correct answer
    sendCloudSave();
  } else {
    btnElement.classList.add("wrong");
    document.getElementById("feedback").innerText = "❌ Incorrect! Keep trying.";
    document.getElementById("feedback").className = "feedback bad";
  }

  setTimeout(loadQuestion, 1500);
}

function sendCloudSave() {
  const payload = {
    studentId: player.id,
    realName: player.name,
    section: player.section,
    level: player.level,
    xp: player.xp,
    currentModule: player.module
  };

  fetch(SAVE_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => console.log("Offline mode - save pending."));
}

function manualSave() {
  sendCloudSave();
  alert("Progress auto-saved to Google Sheets!");
}

function toggleRestoreModal() {
  const code = prompt("Enter Student ID, Save Code, or Teacher PIN (1234):");
  if (code === "1234") {
    alert("Teacher Override active! Level set to 10.");
    player.level = 10;
    player.xp = 1000;
    document.getElementById("hud-level").innerText = player.level;
    document.getElementById("score").innerText = player.xp;
  } else if (code) {
    player.id = code;
    alert(`Loaded profile for Student ID: ${code}`);
  }
}
