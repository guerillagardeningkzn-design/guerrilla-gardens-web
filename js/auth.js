// ────────────────────────────────────────────────
// CHANGE THIS to your real Apps Script web app URL
const API_URL = "https://script.google.com/macros/s/AKfycbzTLEZjy5G5Xs9Vs5hS9QzWHlfMJTF-5yF0Q-wCLYmPW6un0UAVHCnzx0Icu5ZMfF5K/exec";
// ────────────────────────────────────────────────

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  const btnStart   = document.getElementById('btn-start');
  const statusEl   = document.getElementById('auth-status');
  const splash     = document.getElementById('splash');
  const dashboard  = document.getElementById('dashboard');

  // Load saved session if exists
  const saved = localStorage.getItem('gg_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      if (currentUser && currentUser.name) {
        showDashboard();
        return;
      }
    } catch (e) {
      localStorage.removeItem('gg_user');
    }
  }

  btnStart.addEventListener('click', async () => {
    btnStart.disabled = true;
    statusEl.textContent = "Connecting to server...";

    const name = prompt("Choose your gardener name:", "Guerrilla Grower")?.trim();
    if (!name || name.length < 2) {
      statusEl.textContent = "Name too short — try again.";
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

      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        currentUser = data.user;
        localStorage.setItem('gg_user', JSON.stringify(currentUser));
        statusEl.textContent = `Welcome, ${currentUser.name}! Loading your garden...`;
        setTimeout(showDashboard, 1200);
      } else {
        statusEl.textContent = data.error || "Registration failed — try again";
        btnStart.disabled = false;
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Cannot reach server. Check internet / Apps Script URL.";
      btnStart.disabled = false;
    }
  });

  function showDashboard() {
    splash.classList.remove('active');
    dashboard.classList.add('active');

    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-xp').textContent = currentUser.xp || 0;
    document.getElementById('compost-basic').textContent = currentUser.compost_basic || 0;
  }
});
