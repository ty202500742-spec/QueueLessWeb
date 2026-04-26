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