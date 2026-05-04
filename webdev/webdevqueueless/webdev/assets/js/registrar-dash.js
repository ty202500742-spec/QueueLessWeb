
  // Clock
  function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    document.getElementById('clock').textContent =
      `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
  }
  tick(); setInterval(tick, 1000);

  // Queue data
  const queue = [
    { num: 'R-003', name: 'Ana Reyes', purpose: 'Transcript', wait: '12:44 PM' },
    { num: 'R-004', name: 'Carlo Mendoza', purpose: 'Evaluation', wait: '12:46 PM' },
    { num: 'R-005', name: 'Bianca Torres', purpose: 'Enrollment', wait: '12:49 PM' },
    { num: 'R-006', name: 'Mark Lim', purpose: 'Correction', wait: '12:52 PM' },
    { num: 'R-007', name: 'Sofia Ramos', purpose: 'CTC', wait: '12:55 PM' },
  ];

  let served = 14;
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
    const name = document.getElementById('ctName').textContent;
    served++;
    document.getElementById('servedCount').textContent = served;
    addActivity(`Served <b>${num}</b> — ${name}`, 'green');
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
    if (queue.length === 0) {
      showToast('No more students in queue.');
      return;
    }
    const next = queue.shift();
    document.getElementById('ctNumber').textContent = next.num;
    document.getElementById('ctName').textContent = next.name;
    document.getElementById('ctPurpose').textContent = next.purpose;
    document.getElementById('ctWait').textContent = next.wait;
    document.getElementById('currentTicket').style.display = '';
    document.getElementById('emptyHero').classList.remove('visible');
    currentActive = true;
    renderQueue();
  }

  function loadNext() {
    if (queue.length > 0) {
      callNext();
    } else {
      document.getElementById('currentTicket').style.display = 'none';
      document.getElementById('emptyHero').classList.add('visible');
      renderQueue();
    }
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }
