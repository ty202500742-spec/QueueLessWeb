var selectedService = "";
var selectedWindow = "";


var cashierWindows = [
    "Window 1 - Releasing of Payments / TES",
    "Window 2 - Releasing of Checks",
    "Window 3 - Releasing of Checks",
    "Window 4 - Collection (Priority)",
    "Window 5 - Collection",
    "Window 6 - TES Scholars",
    "Window 7 - Releasing of Petty Cash",
    "Window 8 - Assessment",
    "Window 9 - Assessment"
];

var registrarWindows = [
    "Window 1 - School to School & Faculty Clearance",
    "Window 2 - Request of Documents",
    "Window 3 - Grades & Academic Records",
    "Window 4 - Enrollment & Registration",
    "Window 5 - Releasing",
    "Window 6 - Releasing"
];

/* Only sets the selection – does NOT open modal */
function selectService(purpose, windowName) {
    selectedService = purpose;
    selectedWindow = windowName;
    // Show the confirm box inside the clicked popup
    var boxes = document.querySelectorAll(".confirmboxes");
    boxes.forEach(function(box) { box.style.display = "none"; });
    // Find the confirm box that belongs to the currently open popup (using its id)
    var activePopup = document.querySelector(".popup:target");
    if (activePopup) {
        var confirmBox = activePopup.querySelector(".confirmboxes");
        if (confirmBox) confirmBox.style.display = "block";
        var selText = activePopup.querySelector(".selandreq");
        if (selText) selText.innerHTML = "<strong>You selected:</strong> " + purpose;
    }
}

/* Opens the info modal */
function openInfoModal() {
    if (!selectedService) { alert("Please select a service first."); return; }
    document.getElementById("modalServicePreview").textContent = selectedService + " (" + selectedWindow + ")";
    var modal = document.getElementById("infoModal");
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
}

/* Closes the info modal */
function closeInfoModal() {
    var modal = document.getElementById("infoModal");
    modal.style.display = "none";
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
}

/* Queue submission */
function addQueue() {
    var firstName = document.getElementById("q-firstname").value.trim();
    var middleName = document.getElementById("q-middlename").value.trim();
    var lastName = document.getElementById("q-lastname").value.trim();
    var suffix = document.getElementById("q-suffix").value.trim();
    var phone = document.getElementById("q-phone").value.trim();
    var terms = document.getElementById("terms").checked;

    if (!firstName || !lastName) { alert("Please enter your first and last name."); return; }
    if (!phone) { alert("Please enter your phone number."); return; }
    if (!terms) { alert("You must accept the Terms & Conditions!"); return; }
    if(firstName >= 0 || lastName >= 0) { alert("Name fields cannot contain numbers."); return; }
    if(phone.length < 10 || phone.length > 11 || !/^\d+$/.test(phone)) { alert("Please enter a valid phone number."); return; }
    var fullName = firstName + (middleName ? " " + middleName : "") + " " + lastName + (suffix ? " " + suffix : "");

    var priorityChoice = document.querySelector('input[name="priority"]:checked');
    var isPriority = false;
    var category = "Regular";
    if (priorityChoice && priorityChoice.value !== "na") {
        isPriority = true;
        category = priorityChoice.value;
    }

    if (isPriority && ["PWD","Senior Citizen","VIP"].includes(category)) {
        var idNum = document.getElementById("jq-idnum").value.trim();
        if (!idNum) { alert("Please enter your verification ID for priority queue."); return; }
    }

    // ✅ Determine department AFTER queueList is declared
    var queueList = JSON.parse(localStorage.getItem("queueList") || "[]");

    // ✅ DUPLICATE CHECK — only against active (waiting/serving) entries
    var activeStatuses = ["waiting", "serving"];
    var duplicateName = queueList.find(function(q) {
        return activeStatuses.includes(q.status) &&
               q.firstName.toLowerCase() === firstName.toLowerCase() &&
               q.lastName.toLowerCase() === lastName.toLowerCase();
    });
    var duplicatePhone = queueList.find(function(q) {
        return activeStatuses.includes(q.status) && q.phone === phone;
    });

    if (duplicateName) {
        alert(
            "⚠️ Duplicate Entry Detected!\n\n" +
            "\"" + fullName + "\" is already in the queue.\n" +
            "Queue Number: " + duplicateName.id + "\n" +
            "Status: " + duplicateName.status.toUpperCase() + "\n\n" +
            "Please wait for your current queue to be completed."
        );
        return;
    }

    if (duplicatePhone) {
        alert(
            "⚠️ Duplicate Entry Detected!\n\n" +
            "This phone number is already registered in the queue.\n" +
            "Queue Number: " + duplicatePhone.id + "\n" +
            "Name: " + duplicatePhone.name + "\n" +
            "Status: " + duplicatePhone.status.toUpperCase() + "\n\n" +
            "Please wait for your current queue to be completed."
        );
        return;
    }

    // ... rest of your existing code unchanged below
    var counter = parseInt(localStorage.getItem("queueCounter") || "0") + 1;
    // ...


    var counter = parseInt(localStorage.getItem("queueCounter") || "0") + 1;
    localStorage.setItem("queueCounter", counter);
    var qNum = (isPriority ? "PR-" : "Q-") + String(counter).padStart(3, "0");

    // ✅ Department check goes here, right before the push
    var dept = cashierWindows.includes(selectedWindow) ? "cashier" : "registrar";

    queueList.push({
        id: qNum,
        name: fullName,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
        phone: phone,
        purpose: selectedService,
        status: "waiting",
        time: new Date().toLocaleTimeString(),
        type: isPriority ? "priority" : "regular",
        window: selectedWindow,
        category: category,
        department: dept,
        idNum : idNum
    });

    queueList.sort(function(a, b) {
        if (a.type === "priority" && b.type !== "priority") return -1;
        if (a.type !== "priority" && b.type === "priority") return 1;
        return 0;
    });
    console.log("Department assigned:", dept, "| Window:", selectedWindow);
    localStorage.setItem("queueList", JSON.stringify(queueList));

    var historyList = JSON.parse(localStorage.getItem("queueHistory") || "[]");
    historyList.push({
        id: qNum, name: fullName, phone: phone, service: selectedService,
        status: "waiting", type: isPriority ? "priority" : "regular",
        window: selectedWindow, date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    });
    localStorage.setItem("queueHistory", JSON.stringify(historyList));

    localStorage.setItem("queue_userService", selectedService);
    localStorage.setItem("queue_userName", fullName);
    localStorage.setItem("queue_userType", isPriority ? "priority" : "regular");
    localStorage.setItem("queue_userId", qNum);
    localStorage.setItem("queue_userWindow", selectedWindow);

    saveReportTransaction(qNum, fullName, selectedService, selectedWindow, category, isPriority);

    ["q-firstname","q-middlename","q-lastname","q-suffix","q-phone","jq-idnum"].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.value = "";
    });
    document.getElementById("terms").checked = false;
    document.querySelectorAll('input[name="priority"]').forEach(function(r) { r.checked = false; });
    document.getElementById("jq-idfield").style.display = "none";

    closeInfoModal();

    if (isPriority) {
        window.location.href = "Que-numberPriority.html";
    } else {
        window.location.href = "Que-number.html";
    }
}

function saveReportTransaction(queueId, name, service, windowName, category, isPriority) {
    var now = new Date();
    var existing = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    existing.push({
        queueId: queueId, name: name, service: service, window: windowName,
        category: category, queueType: isPriority ? "priority" : "regular",
        status: "waiting", date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString(), year: now.getFullYear(),
        month: now.getMonth() + 1,
        semester: (now.getMonth() + 1 >= 8 && now.getMonth() + 1 <= 12) ? "1st Semester" : ((now.getMonth() + 1 >= 1 && now.getMonth() + 1 <= 5) ? "2nd Semester" : "Summer")
    });
    localStorage.setItem("reportTransactions", JSON.stringify(existing));
}

function handlePriorityChange() {
    var selected = document.querySelector('input[name="priority"]:checked');
    var idField = document.getElementById("jq-idfield");
    if (selected && ["PWD","Senior Citizen","VIP"].includes(selected.value)) {
        idField.style.display = "block";
    } else {
        idField.style.display = "none";
    }
}

// Sidebar (mobile)
var isOpen = false;
function toggleSidebar() { isOpen ? closeSidebar() : openSidebar(); }
function openSidebar() {
    isOpen = true;
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("overlay").classList.add("active");
    document.getElementById("ham").classList.add("active");
}
function closeSidebar() {
    isOpen = false;
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
    document.getElementById("ham").classList.remove("active");
}

window.addEventListener("DOMContentLoaded", function() {
    // Hamburger
    var ham = document.getElementById("ham");
    if (ham) ham.addEventListener("click", toggleSidebar);
    var overlay = document.getElementById("overlay");
    if (overlay) overlay.addEventListener("click", closeSidebar);
    var closeBtn = document.querySelector(".sidebar .close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    // Priority radio toggle
    var radios = document.querySelectorAll('input[name="priority"]');
    radios.forEach(function(r) { r.addEventListener("change", handlePriorityChange); });

    // Close info modal via X button
    var closeInfo = document.getElementById("closeInfoModal");
    if (closeInfo) closeInfo.addEventListener("click", closeInfoModal);

    // Attach to "Join Queue" button
    var joinBtn = document.getElementById("joinQueueBtn");
    if (joinBtn) joinBtn.addEventListener("click", addQueue);
});