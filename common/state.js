export const state = {
  players: [],
  scores: {},
  rounds: 0,
};

export function resetGame() {
  state.players = [];
  state.scores = {};
  state.rounds = 0;
  document.getElementById("playerList").textContent = "";
}

export function resetScore() {
  state.players.forEach((p) => {
    state.scores[p] = [];
  });
  state.rounds = 0;
}

export function setTestData() {
  state.players = ["abc", "xyz", "qwe", "asd"];
  state.scores = {
    abc: [],
    xyz: [],
    qwe: [],
    asd: [],
  };
}
