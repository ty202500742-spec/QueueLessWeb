
  function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    document.getElementById('clock').textContent =
      `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
  }
  tick(); setInterval(tick, 1000);

  const queue = [
    { num: 'C-089', name: 'Rico Flores', purpose: 'Miscellaneous', wait: '12:43 PM' },
    { num: 'C-090', name: 'Grace Villanueva', purpose: 'ID Fee', wait: '12:45 PM' },
    { num: 'C-091', name: 'Ramon Uy', purpose: 'Tuition Fee', wait: '12:50 PM' },
    { num: 'C-092', name: 'Donna Santiago', purpose: 'Lab Fee', wait: '12:54 PM' },
  ];

  let totalCollection = 42500;
  let served = 21;
  let currentActive = true;

  function renderQueue() {
    const tbody = document.getElementById('queueBody');
    tbody.innerHTML = queue.map((r, i) => `
      <tr>
        <td class="pos-num">${i+1}</td>
        <td class="q-num">${r.num}</td>
        <td>${r.name}</td>
        <td><span class="purpose-tag">${r.purpose}</span></td>
        <td class="wait-time">${r.wait}</td>
      </tr>
    `).join('');
    document.getElementById('queueCount').textContent = queue.length + (currentActive ? 1 : 0);
  }

  function addActivity(text, type) {
    const feed = document.getElementById('actFeed');
    const el = document.createElement('div');
    el.className = 'activity-item';
    el.innerHTML = `
      <div class="a-dot-wrap"><div class="a-dot ${type}"></div></div>
      <div>
        <div class="a-text">${text}</div>
        <div class="a-time">just now</div>
      </div>
    `;
    feed.prepend(el);
  }

  function markDone() {
    const num = document.getElementById('ctNumber').textContent;
    const amount = parseFloat(document.getElementById('amountInput').value) || 0;
    served++;
    document.getElementById('servedCount').textContent = served;
    if (amount > 0) {
      totalCollection += amount;
      document.getElementById('totalCollection').textContent =
        '₱ ' + totalCollection.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      addActivity(`Collected <b>₱ ${amount.toLocaleString()}</b> from <b>${num}</b>`, 'green');
    } else {
      addActivity(`Served <b>${num}</b> — no amount entered`, 'green');
    }
    document.getElementById('amountInput').value = '';
    currentActive = false;
    loadNext();
  }

  function noShow() {
    const num = document.getElementById('ctNumber').textContent;
    addActivity(`No-show — <b>${num}</b>`, 'amber');
    currentActive = false;
    loadNext();
  }

  function callNext() {
    if (queue.length === 0) { showToast('No more students in queue.'); return; }
    const next = queue.shift();
    document.getElementById('ctNumber').textContent = next.num;
    document.getElementById('ctName').textContent = next.name;
    document.getElementById('ctPurpose').textContent = next.purpose;
    document.getElementById('ctWait').textContent = next.wait;
    document.getElementById('amountInput').value = '';
    document.getElementById('currentTicket').style.display = '';
    document.getElementById('emptyHero').classList.remove('visible');
    currentActive = true;
    renderQueue();
  }

  function loadNext() {
    if (queue.length > 0) { callNext(); }
    else {
      document.getElementById('currentTicket').style.display = 'none';
      document.getElementById('emptyHero').classList.add('visible');
      renderQueue();
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }