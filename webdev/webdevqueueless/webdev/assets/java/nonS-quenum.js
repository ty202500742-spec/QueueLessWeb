     function loadQueuePage() {



            let queue = JSON.parse(localStorage.getItem("queueList")) || [];
            let queueListEl = document.getElementById("queueList");
            let currentNumberEl = document.getElementById("currentNumber");
            let statusMessageEl = document.getElementById("statusMessage");

            queueListEl.innerHTML = "";

            if (queue.length === 0) {
                currentNumberEl.textContent = "---";
                statusMessageEl.textContent = "No queue yet.";
                return;
            }

            // User is the last in queue
            let userIndex = queue.length - 1;
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
            statusMessageEl.textContent = `You are in position ${userIndex + 1}. ${peopleAhead} people ahead. Est. wait: ${estWait} min.`;
        }

        // Cancel the queue
        function cancelQueue() {
            if (confirm("Are you sure you want to cancel your queue?")) {
                localStorage.removeItem("queueList");
                alert("Your queue has been canceled.");
                window.location.href = "main.html";
            }
        }

        // Auto-refresh every 5 seconds for live queue
        setInterval(loadQueuePage, 5000);

        // Initial load
        window.onload = loadQueuePage;