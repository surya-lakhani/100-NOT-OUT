const modal = document.getElementById("playerModal");
const scorePage = document.getElementById("scorePage");
const scoreTable = document.getElementById("scoreTable");
const suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
const suitImage = document.getElementById("suit");
let imgCount = 0;
const state = {
  players: [],
  scores: {},
  check: "",
};

renderSuit(suitImage);

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
  const scores = state.players.map((p) => ({
    player: p,
    score: parseInt(document.getElementById("score_" + p)?.value) || 0,
    check: document.getElementById("checkbox_" + p).checked,
  }));
  addRound(scores);
  renderSuit(suitImage);
  renderTable(scoreTable);
};

function addPlayer(name) {
  if (!name || state.players.includes(name) || state.players.length >= 20)
    return false;
  state.players.push(name);
  state.scores[name] = [];
  return true;
}

function addRound(scores) {
  scores.forEach(({ player, score, check }) => {
    if (check) {
      state.scores[player].push(score + 10);
    }
  });
}

function resetGame() {
  state.players = [];
  state.scores = {};
  document.getElementById("playerList").textContent = "";
}

function saveGame(game) {
  const games = loadGames();
  games.push(game);
  localStorage.setItem(KEY, JSON.stringify(games));
}

function loadGames() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function show(element) {
  element.classList.remove("hidden");
}

function hide(element) {
  element.classList.add("hidden");
}

function renderSuit(imageDiv) {
  imgCount = (imgCount) % suits.length;
  let html = `<img src="../assets/${suits[imgCount]}.png" alt="alternatetext" width="50" height="50">`;
  imageDiv.innerHTML = html;
  imgCount++
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

function setTestData() {
  state.players = ["abc", "xyz", "qwe", "asd"];
  state.scores = {
    abc: [],
    xyz: [],
    qwe: [],
    asd: [],
  };
}
