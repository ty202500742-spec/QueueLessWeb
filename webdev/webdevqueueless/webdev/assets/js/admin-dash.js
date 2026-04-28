let selectedQueueIndex = null;

let selectedQueueId = null;

// SAMPLE DATA (remove if you already have data)
if (!localStorage.getItem("queueList")) {
    localStorage.setItem("queueList", JSON.stringify([
        { id: "R-001", name: "Maria Santos", purpose: "TOR", time: "12:00:01", status: "waiting" },
        { id: "C-002", name: "Juan Dela Cruz", purpose: "Payment", time: "12:01:01", status: "waiting" }
    ]));
}

function loadQueue() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];
    let table = document.getElementById("queueTableBody");

    table.innerHTML = "";

    if (queue.length === 0) {
        document.getElementById("noQueueModal").style.display = "flex";
        return;
    }

    queue.forEach((q) => {

        let row = document.createElement("tr");

        let statusClass = q.status === "serving" ? "serving" : "waiting";
        let buttonText = q.status === "serving" ? "Done" : "Serve";

        row.innerHTML = `
            <td><strong>${q.id}</strong></td>
            <td>${q.name}</td>
            <td>${q.purpose}</td>
            <td>${q.time}</td>
            <td><span class="pill ${statusClass}">${q.status}</span></td>
            <td><button class="serve-btn">${buttonText}</button></td>
        `;

        let btn = row.querySelector(".serve-btn");

        btn.style.background = q.status === "serving" ? "#198754" : "#860000";
        btn.style.color = "white";
        btn.style.padding = "6px 12px";
        btn.style.borderRadius = "6px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";

        btn.addEventListener("click", () => {
            selectedQueueId = q.id;

            if (q.status === "waiting") {
                document.getElementById("serve-modal").style.display = "flex";
            } else {
                finishServing();
            }
        });

        table.prepend(row);
    });
}

function confirmServe() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let index = queue.findIndex(q => q.id === selectedQueueId);

    if (index !== -1) {
        queue[index].status = "serving";

        localStorage.setItem("queueList", JSON.stringify(queue));

        closeModal();
        selectedQueueId = null;

        loadQueue();
    }
}

function finishServing() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let index = queue.findIndex(q => q.id === selectedQueueId);

    if (index !== -1) {
        queue.splice(index, 1);

        localStorage.setItem("queueList", JSON.stringify(queue));

        selectedQueueId = null;

        loadQueue();
    }
}
function closeModal() {
    document.getElementById("serve-modal").style.display = "none";
}



function closeNoQueue() {
    document.getElementById("noQueueModal").style.display = "none";
}


document.getElementById("queueForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const purpose = document.getElementById("number").value;
    const terms = document.getElementById("terms").checked;

    if (!terms) {
        alert("You must accept the Terms & Conditions!");
        return;
    }

    // ✅ GET PRIORITY (VIP/PWD)
    let priorityChoice = document.querySelector('input[name="priority"]:checked');

    if (!priorityChoice) {
        alert("Please select Yes or No for VIP/PWD.");
        return;
    }

    let isPriority = priorityChoice.value === "yes";

    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    // ✅ UNIQUE ID
    let newId = (isPriority ? "PR-" : "Q-") + Date.now();

    let newQueue = {
        id: newId,
        name: name,
        purpose: purpose,
        time: new Date().toLocaleTimeString(),
        status: "waiting",
        type: isPriority ? "priority" : "regular"
    };

    // ✅ PRIORITY GOES FIRST
    if (isPriority) {
        queue.unshift(newQueue);
    } else {
        queue.push(newQueue);
    }

    localStorage.setItem("queueList", JSON.stringify(queue));

    loadQueue();

    this.reset();

    document.getElementById("infoModal").style.display = "none";

    alert("Added to queue!");
});