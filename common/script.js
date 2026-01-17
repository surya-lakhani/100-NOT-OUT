import { state, resetGame } from './state.js';
import { addPlayer, addRound, activePlayers } from './game.js';
import { saveGame, loadGames } from './storage.js';
import { show, hide, renderTable } from './ui.js';

const modal = document.getElementById("playerModal");
const scorePage = document.getElementById("scorePage");
const scoreTable = document.getElementById("scoreTable");

document.getElementById("newGameBtn").onclick = () => {
  resetGame();
  hide(scorePage);
  modal.showModal();
};

document.getElementById("addPlayerBtn").onclick = () => {
  //   setTestData();
  modal.showModal();
  document.getElementById("playerList").textContent = state.players.join(", ");
};

document.getElementById("resetScoreBtn").onclick = () => {
  state.players.forEach((p) => {
    state.scores[p] = [];
  });
  renderTable(scoreTable);
};

document.getElementById("nextPlayerBtn").onclick = () => {
  const input = document.getElementById("playerNameInput");
  if (addPlayer(input.value.trim())) {
    document.getElementById("playerList").textContent = state.players.join(",");
    input.value = "";
  }
  input.focus();
};

document.getElementById("doneAddingBtn").onclick = () => {
  if (state.players.length < 2) {
    alert("Please add at least two player!");
  } else {
    modal.close("playerModal");
    show(scorePage);
    renderTable(scoreTable);
  }
};

document.getElementById("addScoreBtn").onclick = () => {
  const players = activePlayers();
  if (players.length <= 1) return alert("Game Over");

  const scores = players.map((p) => ({
    player: p,
    score: parseInt(document.getElementById("score_" + p)?.value) || 0,
  }));
  addRound(scores);
  renderTable(scoreTable);
};
