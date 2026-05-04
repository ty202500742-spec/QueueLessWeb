function loadQueuePage() {
  let userName = localStorage.getItem("queue_userName") || "Unknown User";
  let userId = localStorage.getItem("queue_userId") || "";
  let userService = localStorage.getItem("queue_userService") || "Unknown Service";

  // For this page, we only care about the regular queue since priority users go to a different page
  let allQueue = JSON.parse(localStorage.getItem("queueList")) || [];
  let queue = allQueue.filter(q => q.type === "regular");

  let queueListEl = document.getElementById("queueList");
  let currentNumberEl = document.getElementById("currentNumber");
  let statusMessageEl = document.getElementById("statusMessage");

  queueListEl.innerHTML = "";

  if (queue.length === 0) {
    currentNumberEl.textContent = "---";
    statusMessageEl.textContent = "No queue yet.";
    return;
  }

  // Find the user by their unique queue ID (most reliable)
  let userIndex = queue.findIndex(q => q.id === userId);

  // Fallback: match by name if ID not found
  if (userIndex === -1) {
    userIndex = queue.map(q => q.name).lastIndexOf(userName);
  }

  // If still not found, default to last entry
  if (userIndex === -1) userIndex = queue.length - 1;

  let userQueue = queue[userIndex];

  queue.forEach((q, index) => {
    let li = document.createElement("li");

    if (index === userIndex) {
      li.classList.add("current");
      li.innerHTML = `<span>#${q.id} You</span><span>${q.status === "serving" ? "Now Serving!" : "Your Turn"}</span>`;
    } else {
      li.innerHTML = `<span>#${q.id} ${q.name}</span><span>${q.status === "serving" ? "Now Serving" : "Waiting"}</span>`;
    }

    queueListEl.appendChild(li);
  });

  currentNumberEl.textContent = userQueue.id;

  let peopleAhead = userIndex;
  let estWait = peopleAhead * 5;
  let queueType = userQueue.type === "priority" ? "Priority Line" : "Regular Line";

  if (userQueue.status === "serving") {
    statusMessageEl.textContent =
      `You are now being served for ${userService}! Please proceed to the window.`;
  } else {
    statusMessageEl.textContent =
      `You are in queue for ${userService}. (${queueType}). ${peopleAhead} people ahead. Est. wait: ${estWait} min.`;
  }
}

// Cancel the queue
function cancelQueue() {
  if (confirm("Are you sure you want to cancel your queue?")) {
    let userId = localStorage.getItem("queue_userId") || "";
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let index = queue.findIndex(q => q.id === userId);

    if (index !== -1) {
      queue.splice(index, 1);
      localStorage.setItem("queueList", JSON.stringify(queue));
    }

    // Clear saved user queue info
    localStorage.removeItem("queue_userName");
    localStorage.removeItem("queue_userType");
    localStorage.removeItem("queue_userId");

    alert("Your queue has been cancelled.");
    window.location.href = "main.html";
  }
}

// Auto-refresh every 5 seconds for live updates
setInterval(loadQueuePage, 5000);

window.onload = loadQueuePage;

// --- Sidebar ---
let isOpen = false;

function toggleSidebar() {
  isOpen ? closeSidebar() : openSidebar();
}

function openSidebar() {
  isOpen = true;
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('active');
  document.getElementById('ham').classList.add('active');
}

function closeSidebar() {
  isOpen = false;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('ham').classList.remove('active');
}

function historygo() {
  window.location.href = 'history.html';
}

function dashboardgo() {
  window.location.href = 'main.html';
}

function profilego() {
  window.location.href = 'student-profile.html';
}

function setRole(r) {
  const pill = document.getElementById('role-pill');
  const label = document.getElementById('role-label');
  const btnR = document.getElementById('btn-reg');
  const btnC = document.getElementById('btn-cash');

  if (r === 'registrar') {
    pill.className = 'role-pill registrar';
    label.textContent = 'Registrar';
    btnR.classList.add('selected', 'reg');
    btnR.classList.remove('cash');
    btnC.classList.remove('selected', 'cash', 'reg');
  } else {
    pill.className = 'role-pill cashier';
    label.textContent = 'Cashier';
    btnC.classList.add('selected', 'cash');
    btnC.classList.remove('reg');
    btnR.classList.remove('selected', 'reg', 'cash');
  }
}