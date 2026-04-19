let selectedQueueIndex = null;

// SAMPLE DATA (remove if you already have data)
if (!localStorage.getItem("queueList")) {
    localStorage.setItem("queueList", JSON.stringify([
        { id: "R-001", name: "Maria Santos", purpose: "TOR", time: "1 min", status: "waiting" },
        { id: "C-002", name: "Juan Dela Cruz", purpose: "Payment", time: "3 min", status: "waiting" }
    ]));
}

function loadQueue() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];
    let table = document.getElementById("queueTableBody");

    table.innerHTML = "";

    queue.forEach((q, index) => {

        let row = document.createElement("tr");

        let buttonText = q.status === "serving" ? "Done" : "Serve";
        let statusClass = q.status === "serving" ? "serving" : "waiting";

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

        row.querySelector(".serve-btn").addEventListener("click", () => {
            selectedQueueIndex = index;

            if (q.status === "waiting") {
                // open modal
                document.getElementById("serve-modal").style.display = "flex";
            } else {
                // already serving → remove
                finishServing();
            }
        });

        table.prepend(row);
    });
}

function confirmServe() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    if (selectedQueueIndex !== null) {
        queue[selectedQueueIndex].status = "serving";

        localStorage.setItem("queueList", JSON.stringify(queue));

        closeModal();
        selectedQueueIndex = null;

        loadQueue();
    }
}

function finishServing() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    if (selectedQueueIndex !== null) {
        queue.splice(selectedQueueIndex, 1);

        localStorage.setItem("queueList", JSON.stringify(queue));

        selectedQueueIndex = null;

        loadQueue();
    }
}

function closeModal() {
    document.getElementById("serve-modal").style.display = "none";
}

// LOAD ON START
loadQueue();