var selectedService = "";
var selectedWindow = "";

function chooseService(purpose, windowName) {
    selectedService = purpose;
    selectedWindow = windowName;
    var el = document.getElementById("modalServicePreview");
    if (el) el.textContent = purpose + " (" + windowName + ")";
    openInfoModal();
}

function openInfoModal() {
    if (!selectedService) { alert("Please select a service first."); return; }
    var modal = document.getElementById("infoModal");
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
}

function closeInfoModal() {
    var modal = document.getElementById("infoModal");
    modal.style.display = "none";
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
}

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

    var fullName = firstName + (middleName ? " " + middleName : "") + " " + lastName + (suffix ? " " + suffix : "");

    // Priority check
    var priorityChoice = document.querySelector('input[name="priority"]:checked');
    var isPriority = false;
    var category = "Regular";
    if (priorityChoice) {
        isPriority = (priorityChoice.value !== "na");
        if (isPriority) category = priorityChoice.value;
    }

    // Validate priority ID if needed
    if (isPriority && ["PWD","Senior Citizen","VIP"].includes(category)) {
        var idNum = document.getElementById("jq-idnum").value.trim();
        if (!idNum) { alert("Please enter your verification ID for priority queue."); return; }
    }

    var queueList = JSON.parse(localStorage.getItem("queueList") || "[]");
    var counter = parseInt(localStorage.getItem("queueCounter") || "0") + 1;
    localStorage.setItem("queueCounter", counter);
    var qNum = (isPriority ? "PR-" : "Q-") + String(counter).padStart(3, "0");

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
        category: category
    });

    queueList.sort(function(a, b) {
        if (a.type === "priority" && b.type !== "priority") return -1;
        if (a.type !== "priority" && b.type === "priority") return 1;
        return 0;
    });
    localStorage.setItem("queueList", JSON.stringify(queueList));

    // Save to history
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

    // Clear form
    ["q-firstname","q-middlename","q-lastname","q-suffix","q-phone","jq-idnum"].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.value = "";
    });
    document.getElementById("terms").checked = false;
    var radios = document.querySelectorAll('input[name="priority"]');
    radios.forEach(function(r) { r.checked = false; });
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

// Sidebar
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

function getWindowFromService(service) {
    if (["Enrollment","Shifting","Readmission"].includes(service)) return "Window 1 - School to School & Faculty Clearance";
    if (["TOR","Certificate","Diploma"].includes(service)) return "Window 2 - Request of Documents";
    if (["EAT","NAT","Interview"].includes(service)) return "Window 5 - Releasing";
    if (["ID Request","ID Replacement","Scholarship"].includes(service)) return "Window 6 - Releasing";
    if (service === "Tuition Fee") return "Window 1 - Releasing of Payments / TES";
    if (service === "Miscellaneous") return "Window 4 - Collection (Priority)";
    if (service === "Other fees") return "Window 5 - Collection";
    if (service === "Lab Fee") return "Window 8 - Assessment";
    if (service === "ID Fee") return "Window 7 - Releasing of Petty Cash";
    return "Window 1 - School to School & Faculty Clearance";
}

// Event listeners
window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("ham").addEventListener("click", toggleSidebar);
    document.getElementById("overlay").addEventListener("click", closeSidebar);
    document.querySelector(".close-btn").addEventListener("click", closeSidebar);
    var radios = document.querySelectorAll('input[name="priority"]');
    radios.forEach(function(r) { r.addEventListener("change", handlePriorityChange); });
});