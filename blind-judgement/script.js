import { state, resetGame, setTestData } from "../common/state.js";
import { addPlayer } from "../common/game.js";
import { saveGame, loadGames } from "../common/storage.js";
import { show, hide, mainMenu } from "../common/ui.js";
mainMenu();

const key = "score-tracker-blind-judgement";
const modal = document.getElementById("playerModal");
const scoreModal = document.getElementById("scoreModal");
const scorePage = document.getElementById("scorePage");
const scoreTable = document.getElementById("scoreTable");
const roundTable = document.getElementById("roundTable");
const suitImage = document.getElementById("suit");
const predictionModal = document.getElementById("predictionModal");
const predictionInput = document.getElementById("predictionInput");
const confirmPredictionBtn = document.getElementById("confirmPredictionBtn");
const playOverlay = document.getElementById("playOverlay");
const scoreRoundBtn = document.getElementById("scoreRoundBtn");

const suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
let maxRound, dealer, cards, cardNum;
let imgCount = 0;
let direction = true;
let loadedGame = loadGames(key);

if (loadedGame?.players?.length > 0) {
  state.players = loadedGame.players;
  state.scores = loadedGame.scores;
  state.rounds = loadedGame.rounds;
  state.dealer = loadedGame.dealer;
  setGameRounds();
  show(scorePage);
  renderRoundSuit();
  renderTable();
}

document.getElementById("newGameBtn").onclick = () => {
  resetGame();
  imgCount = 0;
  hide(scorePage);
  modal.showModal();
};

document.getElementById("addPlayerBtn").onclick = () => {
  setTestData();
  modal.showModal();
  document.getElementById("playerList").textContent = state.players.join(", ");
};

document.getElementById("resetScoreBtn").onclick = () => {
  state.players.forEach((p) => {
    state.scores[p] = [];
  });
  imgCount = 0;
  state.rounds = 0;
  renderRoundSuit();
  renderTable();
};

document.getElementById("nextPlayerBtn").onclick = () => {
  const input = document.getElementById("playerNameInput");
  if (addPlayer(input.value.trim())) {
    document.getElementById("playerList").textContent =
      state.players.join(", ");
    input.value = "";
  }
  input.focus();
};

document.getElementById("doneAddingBtn").onclick = () => {
  if (state.players.length < 2) {
    alert("Please add at least two player!");
  } else {
    modal.close("playerModal");

    setGameRounds();
    show(scorePage);
    renderRoundSuit();
    renderTable();
    saveGame(key, state);
  }
};

document.getElementById("newRoundBtn").onclick = startNewRound;

function startNewRound() {
  state.currentRoundPredictions = {};
  state.currentPlayerIndex = (dealer + 1) % state.players.length;
  addScoreBtn.disabled = true;
  showPredictionModal();
}

function showPredictionModal() {
  const player = state.players[state.currentPlayerIndex];
  currentPlayerName.textContent = `${player}, enter your prediction`;
  predictionInput.value = "";
  document.getElementById("predictionWarning").classList.add("hidden");
  predictionModal.classList.remove("hidden");
  predictionInput.focus();
}

// --- PLAY OVERLAY ---
scoreRoundBtn.onclick = () => {
  playOverlay.classList.add("hidden");
  addScoreBtn.disabled = false;
};

document.getElementById("addScoreBtn").onclick = () => {
  renderRoundSuit();
  const scores = state.players.map((p) => ({
    player: p,
    score: parseInt(document.getElementById("score_" + p)?.value) || 0,
    check: document.getElementById("checkbox_" + p).checked,
  }));
  addRound(scores);
  state.dealer = state.players[dealer];
  imgCount++;
  dealer++;
  renderRoundSuit(roundTable);
  renderTable(scoreTable);
  saveGame(key, state);
};

function setGameRounds() {
  maxRound = Math.trunc(52 / state.players.length);
  const asc = Array.from({ length: maxRound }, (_, i) => i + 1);
  const dsc = [...asc].reverse();
  cards = asc.concat(dsc);
}

function addRound(scores) {
  scores.forEach(({ player, score, check }) => {
    if (check) {
      state.scores[player].push(score + 10);
    }
  });

  state.rounds++;
}

function renderRoundSuit() {
  if (state.rounds === 0) {
    const firstDealer = Math.floor(Math.random() * state.players.length);
    dealer = firstDealer;
  } else if (!dealer) {
    dealer = state.players.indexOf(state.dealer);
  } else {
    dealer = dealer % state.players.length;
  }

  imgCount = imgCount % suits.length;

  if (state.rounds >= cards.length) {
    cardNum = "Game Over";
  } else {
    cardNum = cards[state.rounds];
  }

  let html = `<tbody>
    <tr>
      <th>Cards: ${cardNum}</th>
      <th>Dealer: ${state.players[dealer] ?? state.dealer}</th>
      <th><img src="../assets/${suits[imgCount]}.png" alt="${
    suits[imgCount]
  }" width="30" height="30"></th>
    </tr>
  </tbody>`;
  roundTable.innerHTML = html;
  roundTableModal.innerHTML = html;

}

function renderTable() {
  let html = `<tr><th>Player</th>`;
  html += `<th>Total</th>`;
  html += `<th>Round Score</th>`;
  html += `<th>Pass</th></tr>`;

  state.players.forEach((p) => {
    const total = state.scores[p].reduce((a, b) => a + b, 0);
    html += `<tr>
      <td>${p}</td>
      <td>${total}</td>
      <td><input class="inputScore" type="text" inputmode="numeric" pattern="[0-9]*" id=score_${[
        p,
      ]}></td>
      <td><input class="inputScore" type="checkbox" id=checkbox_${[p]}></td>
    </tr>`;
  });
  scoreTable.innerHTML = html;
}

function isLastPredictor() {
  return (
    Object.keys(state.currentRoundPredictions).length ===
    state.players.length - 1
  );
}

function getSumOfPredictions() {
  return Object.values(state.currentRoundPredictions).reduce(
    (a, b) => a + b,
    0
  );
}

function validateLastPrediction(value) {
  const warning = document.getElementById("predictionWarning");
  const sumOthers = getSumOfPredictions();
  const remaining = cardNum - sumOthers;

  warning.classList.add("hidden");
  warning.textContent = "";

  // If prediction already exceeds round number → always allowed
  if (value > cardNum) return true;

  // Case: remaining === 0 → cannot predict 0
  if (remaining === 0 && value === 0) {
    warning.textContent = "Your prediction cannot be zero this round.";
    warning.classList.remove("hidden");
    return false;
  }

  // Case: remaining > 0 → cannot equal remaining
  if (remaining > 0 && value === remaining) {
    warning.textContent = `Your prediction cannot be ${remaining}.`;
    warning.classList.remove("hidden");
    return false;
  }

  return true;
}

confirmPredictionBtn.onclick = () => {
  const value = parseInt(predictionInput.value, 10) || 0;
  const player = state.players[state.currentPlayerIndex];

  // 🔴 enforce rule only for last player
  if (isLastPredictor()) {
    if (!validateLastPrediction(value)) {
      return; // block advance
    }
  }

  state.currentRoundPredictions[player] = value;
  document.getElementById("score_" + player).value = value;

  state.currentPlayerIndex =
    (state.currentPlayerIndex + 1) % state.players.length;

  if (
    Object.keys(state.currentRoundPredictions).length === state.players.length
  ) {
    predictionModal.classList.add("hidden");
    playOverlay.classList.remove("hidden");
    return;
  }

  showPredictionModal();
}