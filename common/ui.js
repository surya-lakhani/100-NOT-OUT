import { state } from "./state.js";

export function show(element) {
  element.classList.remove("hidden");
}

export function hide(element) {
  element.classList.add("hidden");
}

export function renderTable(table) {
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
