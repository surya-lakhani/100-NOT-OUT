import { state, resetGame, setTestData } from '../common/state.js';
import { addPlayer, activePlayers } from '../common/game.js';
import { saveGame, loadGames } from '../common/storage.js';
import { show, hide } from '../common/ui.js';

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

function addRound(scores) {
  scores.forEach(({ player, score }) => {
    state.scores[player].push(score);
  });
}

function renderTable(table) {
  let html = `<tr><th>Player</th>`;
  html += `<th>Total</th>`;
  html += `<th>Round Score</th></tr>`;
  state.players.forEach((p) => {
    const total = state.scores[p].reduce((a, b) => a + b, 0);
    html += `<tr>
      <td>${p}${total > 100 ? " (Out)" : ""}</td>
      <td>${total}</td>
      <td><input class="inputScore" type="text" id=score_${[p]}></td>
    </tr>`;
  });
  table.innerHTML = html;
}
