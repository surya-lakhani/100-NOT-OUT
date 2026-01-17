export const state = {
    players: [],
    scores: {},
  };

  export function resetGame() {
    state.players = [];
    state.scores = {};
    // state.rounds = 0;
    document.getElementById("playerList").textContent = "";
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