import { state } from "./state.js";

export function addPlayer(name) {
  if (!name || state.players.includes(name) || state.players.length >= 20)
    return false;
    name.trim().split(' ').forEach(element => {
      state.players.push(element);
      state.scores[element] = [];
    });
  return true;
}

export function activePlayers() {
  return state.players.filter(
    (p) => state.scores[p].reduce((a, b) => a + b, 0) <= 100
  );
}