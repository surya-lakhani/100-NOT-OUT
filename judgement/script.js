import { state, resetGame, setTestData } from "../common/state.js";
import { addPlayer, activePlayers } from "../common/game.js";
import { saveGame, loadGames } from "../common/storage.js";
import { show, hide } from "../common/ui.js";

const modal = document.getElementById("playerModal");
const scorePage = document.getElementById("scorePage");
const scoreTable = document.getElementById("scoreTable");
const roundTable = document.getElementById("roundTable");
const suitImage = document.getElementById("suit");
const suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
let maxRound,dealer;
let imgCount = 0;
let round = 0;
let cards;
let direction = true;

document.getElementById("newGameBtn").onclick = () => {
  resetGame();
  hide(scorePage);
  modal.showModal();
};

document.getElementById("addPlayerBtn").onclick = () => {
  // setTestData();
  modal.showModal();
  document.getElementById("playerList").textContent = state.players.join(", ");
};

document.getElementById("resetScoreBtn").onclick = () => {
  state.players.forEach((p) => {
    state.scores[p] = [];
  });
  imgCount = 0;
  round = 0;
  renderRoundSuit(roundTable);
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
    maxRound = Math.trunc(52 / state.players.length);
    const asc = Array.from({ length: maxRound }, (_, i) => i + 1);
    const dsc = [...asc].reverse();
    cards = asc.concat(dsc);
    show(scorePage);
    renderRoundSuit(roundTable);
    renderTable(scoreTable);
  }
};

document.getElementById("addScoreBtn").onclick = () => {
  const scores = state.players.map((p) => ({
    player: p,
    score: parseInt(document.getElementById("score_" + p)?.value) || 0,
    check: document.getElementById("checkbox_" + p).checked,
  }));
  addRound(scores);
  renderRoundSuit(roundTable);
  renderTable(scoreTable);
};

function addRound(scores) {
  scores.forEach(({ player, score, check }) => {
    if (check) {
      state.scores[player].push(score + 10);
    }
  });
  state.rounds++;
}

function renderRoundSuit(table) {
  if (state.rounds===0){
    const firstDealer = Math.floor(Math.random() * (state.players.length));
    dealer = firstDealer;
  }else{
    dealer = dealer % state.players.length;
  }
  imgCount = imgCount % suits.length;
  let cardNum;
  if (round >= cards.length) {
    cardNum = "Game Over";
  } else {
    cardNum = cards[round];
  }

  let html = `<tbody>
    <tr>
      <th>Cards: ${cardNum}</th>
      <th>Dealer: ${state.players[dealer]}</th>
      <th><img src="../assets/${suits[imgCount]}.png" alt="${suits[imgCount]}" width="30" height="30"></th>
    </tr>
  </tbody>`;
  table.innerHTML = html;
  imgCount++;
  round++;
  dealer++;
}

function renderTable(table) {
  let html = `<tr><th>Player</th>`;
  html += `<th>Total</th>`;
  html += `<th>Round Score</th>`;
  html += `<th>Pass</th></tr>`;

  state.players.forEach((p) => {
    const total = state.scores[p].reduce((a, b) => a + b, 0);
    html += `<tr>
      <td>${p}</td>
      <td>${total}</td>
      <td><input class="inputScore" type="text" id=score_${[p]}></td>
      <td><input class="inputScore" type="checkbox" id=checkbox_${[p]}></td>
    </tr>`;
  });
  table.innerHTML = html;
}
