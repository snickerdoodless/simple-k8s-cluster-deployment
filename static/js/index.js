// Fungsi untuk mengambil total angka saat halaman dibuka
async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    updateUI(data);
    logTerminal(`GET /api/stats 200 OK - Fetched current state`);
  } catch (err) {
    logTerminal(`Error connecting to API backend`, 't-red');
  }
}

// Fungsi saat tombol di-klik
async function registerVisit() {
  const btn = document.querySelector('.visit-btn');
  btn.disabled = true;
  btn.innerText = 'PROCESSING...';

  try {
    const res = await fetch('/api/visit', { method: 'POST' });
    const data = await res.json();
    
    updateUI(data);
    showToast(`Success! Recorded by ${data.pod}`);
    logTerminal(`POST /api/visit 200 OK - Redis INCR executed by ${data.pod}`, 't-green');
    
    // Animasi angka
    const numEl = document.getElementById('counterNum');
    numEl.classList.add('bump');
    setTimeout(() => numEl.classList.remove('bump'), 200);
    
  } catch (err) {
    showToast('Failed to connect to backend');
    logTerminal(`POST /api/visit ERROR`, 't-red');
  }
  
  btn.disabled = false;
  btn.innerText = '→ Register Visit';
}

// Update elemen HTML
function updateUI(data) {
  const paddedNum = String(data.count).padStart(6, '0');
  document.getElementById('counterNum').innerText = paddedNum;
  document.getElementById('m-total').innerText = paddedNum;
  document.getElementById('sessionTag').innerText = `Handled by: ${data.pod}`;
  
  // Update daftar pod aktif di UI
  document.getElementById('podsList').innerHTML = `
    <div class="pod-row">
      <div class="pdot running"></div>
      <div class="pod-name">${data.pod}</div>
      <div class="pod-ns">sre-production</div>
      <div class="pod-r">Active Node</div>
    </div>
  `;
}

// Terminal UI effect
function logTerminal(msg, colorClass='t-green') {
  const term = document.getElementById('termBody');
  const time = new Date().toISOString().split('T')[1].slice(0,8);
  term.innerHTML += `
    <div class="t-row">
      <span class="t-prompt">[${time}]</span>
      <span class="${colorClass}">${msg} <span class="cursor"></span></span>
    </div>
  `;
  term.scrollTop = term.scrollHeight;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Panggil saat pertama kali load
window.onload = fetchStats;