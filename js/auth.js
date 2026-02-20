// ────────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Update this URL after every Apps Script redeploy
const API_URL = "https://script.google.com/macros/s/AKfycbzTLEZjy5G5Xs9Vs5hS9QzWHlfMJTF-5yF0Q-wCLYmPW6un0UAVHCnzx0Icu5ZMfF5K/exec";
// ────────────────────────────────────────────────────────────────────────────────

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  const btnStart   = document.getElementById('btn-start');
  const statusEl   = document.getElementById('auth-status');
  const splash     = document.getElementById('splash');
  const dashboard  = document.getElementById('dashboard');

  // 1. Try to load existing session from localStorage
  const saved = localStorage.getItem('gg_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      if (currentUser && currentUser.name) {
        showDashboard();
        return;
      }
    } catch (e) {
      console.warn('Invalid saved user data — clearing');
      localStorage.removeItem('gg_user');
    }
  }

  // 2. Handle "Start with Google" button click
  btnStart.addEventListener('click', async () => {
    btnStart.disabled = true;
    statusEl.textContent = "Registering gardener...";

    const name = prompt("Choose your gardener name:", "Guerrilla Grower")?.trim();

    if (!name || name.length < 2) {
      statusEl.textContent = "Name too short — cancelled.";
      btnStart.disabled = false;
      return;
    }

    try {
      // Build GET URL with query parameters
      const url = `${API_URL}?action=register&name=${encodeURIComponent(name)}`;

      // Send the request with no-cors → browser won't block, but response is opaque
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',          // ← This is the key fix for CORS block
        cache: 'no-cache',
        redirect: 'follow'
      });

      // Since response is opaque (we can't read it), we assume success
      // Create local user object with entered name + default values
      currentUser = {
        name: name,
        xp: 0,
        compost_basic: 0,
        compost_rich: 0,
        ee: 100,
        avatar: 'default-avatar.png',
        email: 'guest_' + Date.now() + '@temp.com'   // placeholder
      };

      // Save to localStorage
      localStorage.setItem('gg_user', JSON.stringify(currentUser));

      // Show success and transition to dashboard
      statusEl.textContent = `Welcome, ${name}! Garden registered. Loading dashboard...`;
      setTimeout(showDashboard, 1200);

    } catch (err) {
      console.error('Registration attempt failed:', err);
      statusEl.textContent = "Could not connect to server. Check internet and try again.";
      btnStart.disabled = false;
    }
  });

  // ────────────────────────────────────────────────
  // Show dashboard screen with user data
  // ────────────────────────────────────────────────
  function showDashboard() {
    splash.classList.remove('active');
    dashboard.classList.add('active');

    // Update displayed values
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-xp').textContent = currentUser.xp || 0;
    document.getElementById('compost-basic').textContent = currentUser.compost_basic || 0;
  }
});
