let selectedQueueIndex = null;
let currentDay = "monday";

// SAMPLE DATA (remove if you already have data)
if (!localStorage.getItem("queueList")) {
    localStorage.setItem("queueList", JSON.stringify([
        { id: "R-001", name: "Maria Santos", purpose: "TOR", time: "12:00:01", day: "Tuesday", status: "waiting" },
        { id: "C-002", name: "Juan Dela Cruz", purpose: "Payment", time: "12:01:01", day: "Monday", status: "waiting" }
    ]));
}

function loadQueue(selectedDay = null) {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];
    let table = document.getElementById("queueTableBody");

    table.innerHTML = "";

   let filteredQueue = queue.filter(q =>
    selectedDay
        ? q.day.toLowerCase() === selectedDay.toLowerCase()
        : true
);

if ( selectedDay !== currentDay) {
    document.getElementById("noQueueModal").style.display = "flex";
    return;
}

    filteredQueue.forEach((q) => {

        let row = document.createElement("tr");

        let statusClass = q.status === "serving" ? "serving" : "waiting";
        let buttonText = q.status === "serving" ? "Done" : "Serve";

        row.innerHTML = `
            <td><strong>${q.id}</strong></td>
            <td>${q.name}</td>
            <td>${q.purpose}</td>
            <td>${q.time}</td>
            <td>${q.day}</td>
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

            // BLOCK WRONG DAY
            
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

        loadQueue(currentDay);
    }
}

function finishServing() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let index = queue.findIndex(q => q.id === selectedQueueId);

    if (index !== -1) {
        queue.splice(index, 1);

        localStorage.setItem("queueList", JSON.stringify(queue));

        selectedQueueId = null;

        loadQueue(currentDay);
    }
}
function closeModal() {
    document.getElementById("serve-modal").style.display = "none";
}

function setDay(day) {
    currentDay = day;
    loadQueue(currentDay);
}

function closeNoQueue() {
    document.getElementById("noQueueModal").style.display = "none";
}


window.onload = function () {
    loadQueue(currentDay);
};