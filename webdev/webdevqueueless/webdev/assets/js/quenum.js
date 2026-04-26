function loadQueuePage() {

    let userType = localStorage.getItem("queue_userType") || "guest";
    let userName = localStorage.getItem("queue_userName") || "Unknown User";

    let queueKey = (userType === "priority") ? "priorityQueue" : "regularQueue";
    let queue = JSON.parse(localStorage.getItem(queueKey)) || [];

    let queueListEl = document.getElementById("queueList");
    let currentNumberEl = document.getElementById("currentNumber");
    let statusMessageEl = document.getElementById("statusMessage");

    queueListEl.innerHTML = "";

    if (queue.length === 0) {
        currentNumberEl.textContent = "---";
        statusMessageEl.textContent = "No queue yet.";
        return;
    }

    let userIndex = queue.map(q => q.name).lastIndexOf(userName);

    if (userIndex === -1) userIndex = queue.length - 1;
    let userQueue = queue[userIndex];

    queue.forEach((q, index) => {
        let li = document.createElement("li");

        if (index === userIndex) {
            li.classList.add("current");
            li.innerHTML = `<span>#${q.id} You</span><span>Your Turn</span>`;
        } else {
            li.innerHTML = `<span>#${q.id} ${q.name}</span><span>Waiting</span>`;
        }

        queueListEl.appendChild(li);
    });

    // Update current number and status
    currentNumberEl.textContent = userQueue.id;
    let peopleAhead = userIndex;
    let estWait = peopleAhead * 5; // estimate 5 min per person

    let queueName = (userType === "priority") ? "Priority Line" : "Regular Line";
    statusMessageEl.textContent = `You are in position ${userIndex + 1} (${queueName}). ${peopleAhead} people ahead. Est. wait: ${estWait} min.`;
}

// Cancel the queue
function cancelQueue() {
    if (confirm("Are you sure you want to cancel your queue?")) {
        let userType = localStorage.getItem("queue_userType") || "guest";
        let userName = localStorage.getItem("queue_userName") || "Unknown User";
        let queueKey = (userType === "priority") ? "priorityQueue" : "regularQueue";

        let queue = JSON.parse(localStorage.getItem(queueKey)) || [];

        let userIndex = queue.map(q => q.name).lastIndexOf(userName);

        if (userIndex !== -1) {
            queue.splice(userIndex, 1);
            localStorage.setItem(queueKey, JSON.stringify(queue));
        }
        alert("Your queue has been cancelled.");
        window.location.href = "main.html";
    }
}

// Auto-refresh every 5 seconds for live queue
setInterval(loadQueuePage, 5000);

        // Initial load
        window.onload = loadQueuePage;

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
    const pill  = document.getElementById('role-pill');
    const label = document.getElementById('role-label');
    const btnR  = document.getElementById('btn-reg');
    const btnC  = document.getElementById('btn-cash');

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
