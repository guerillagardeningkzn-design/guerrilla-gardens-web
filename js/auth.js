// ────────────────────────────────────────────────
// Configuration – change this!
const API_URL = "https://script.google.com/macros/s/YOUR_WEB_APP_ID_HERE/exec";
// ────────────────────────────────────────────────

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  const btnStart = document.getElementById('btn-start');
  const statusEl = document.getElementById('auth-status');

  // Try to load existing session
  const saved = localStorage.getItem('gg_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      showDashboard();
    } catch {}
  }

  btnStart.addEventListener('click', async () => {
    btnStart.disabled = true;
    statusEl.textContent = "Connecting...";

    const name = prompt("Choose your gardener name:", "Guerrilla Grower")?.trim();
    if (!name) {
      statusEl.textContent = "Cancelled.";
      btnStart.disabled = false;
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: name
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.success) {
        currentUser = data.user;
        localStorage.setItem('gg_user', JSON.stringify(currentUser));
        statusEl.textContent = "Success! Loading garden...";
        setTimeout(showDashboard, 800);
      } else {
        statusEl.textContent = data.error || "Authentication failed";
        btnStart.disabled = false;
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Connection error. Check internet or try again.";
      btnStart.disabled = false;
    }
  });
});

function showDashboard() {
  document.getElementById('splash').classList.remove('active');
  const dash = document.getElementById('dashboard');
  dash.classList.add('active');

  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-xp').textContent = currentUser.xp || 0;
  document.getElementById('compost-basic').textContent = currentUser.compost_basic || 0;
}
