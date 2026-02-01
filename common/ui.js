import { state } from "./state.js";

const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const backdrop = document.getElementById('menuBackdrop');

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

export function mainMenu(){

menuToggle.onclick = () => {
  menu.classList.remove('hidden');
  backdrop.classList.remove('hidden');
};

backdrop.onclick = closeMenu;

menu.querySelectorAll('a').forEach(link => {
  link.onclick = closeMenu;
});

function closeMenu() {
  menu.classList.add('hidden');
  backdrop.classList.add('hidden');
}

}