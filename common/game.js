import { state } from "./state.js";

export function addPlayer(name) {
  if (!name || state.players.includes(name) || state.players.length >= 15)
    return false;
  state.players.push(name);
  state.scores[name] = [];
  return true;
}

export function activePlayers() {
  return state.players.filter(
    (p) => state.scores[p].reduce((a, b) => a + b, 0) <= 100
  );
}
