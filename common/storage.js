export function saveGame(key, game) {
  const games = loadGames(key);
  games.push(game);
  localStorage.setItem(key, JSON.stringify(games));
}

export function loadGames(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
