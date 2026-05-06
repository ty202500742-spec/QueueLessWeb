var selectedService = "";

function chooseService(purpose) {
    selectedService = purpose;
    for (var i = 1; i <= 8; i++) {
        var box = document.getElementById("confirmBox" + i);
        if (box) box.style.display = "block";
    }
    var requirements = "";
    switch (purpose) {
        case "Enrollment": case "EAT": case "NAT": case "Interview":
            requirements = "CET Results"; break;
        case "Shifting": case "Readmission": case "Miscellaneous":
        case "Certificate": case "Diploma":
            requirements = "School ID or COR"; break;
        case "Tuition Fee": case "TOR": case "ID Request": case "ID Replacement":
            requirements = "COR and Required Amount"; break;
        case "Other fees":
            requirements = "School ID"; break;
        case "Scholarship":
            requirements = "Form 138 or any grade report"; break;
        default:
            requirements = "Check office for Requirements";
    }
    for (var j = 1; j <= 8; j++) {
        var selectedEl = document.getElementById("selectedText" + j);
        var reqEl = document.getElementById("requirementText" + j);
        if (selectedEl) selectedEl.innerHTML = "<strong>You selected:</strong> " + purpose;
        if (reqEl) reqEl.innerHTML = "<strong>Requirements:</strong> " + requirements;
    }
}

function getWindowFromService(service) {
    const cashierServices = [
        "Tuition Fee",
        "Miscellaneous",
        "Other fees",
        "Lab Fee",
        "ID Request",
        "ID Replacement"
    ];

    const registrarServices = [
        "Enrollment",
        "EAT",
        "NAT",
        "Interview",
        "Shifting",
        "Readmission",
        "TOR",
        "Certificate",
        "Diploma",
        "Scholarship"
    ];

    if (cashierServices.includes(service)) return "cashier";
    if (registrarServices.includes(service)) return "registrar";

    return "cashier"; // default fallback
}

function openInfoModal() {
    if (!selectedService) {
        alert("Please select a service first.");
        return;
    }

    if (history.pushState) {
        history.pushState("", document.title,
            window.location.pathname + window.location.search);
    }

    var preview = document.getElementById("modalServicePreview");
    if (preview) preview.textContent = selectedService;

    var modal = document.getElementById("infoModal");
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.55)";
    modal.style.zIndex = "9999";
}

function addQueue() {
    var userName = document.getElementById("name").value.trim();
    var userPhone = document.getElementById("phone").value.trim();
    var terms = document.getElementById("terms").checked;

    if (!userName) { alert("Please enter your name."); return; }
    if (!userPhone) { alert("Please enter your phone number."); return; }
    if (!terms) { alert("You must accept the Terms & Conditions!"); return; }

    var priorityChoice = document.querySelector('input[name="priority"]:checked');
    if (!priorityChoice) { alert("Please select Yes or No for VIP/PWD."); return; }

    var isPriority = (priorityChoice.value === "yes");

    var category = "Regular";
    if (isPriority) {
        var otherField = document.getElementById("otherPriority");
        var otherValue = otherField ? otherField.value.trim() : "";
        category = otherValue || "Priority";
    }

    var queueList = JSON.parse(localStorage.getItem("queueList")) || [];
    var counter = parseInt(localStorage.getItem("queueCounter") || "0") + 1;
    localStorage.setItem("queueCounter", counter);
    var qNum = (isPriority ? "PR-" : "Q-") + String(counter).padStart(3, "0");

    queueList.push({
        id: qNum, 
        name: userName, 
        phone: userPhone,
        purpose: selectedService, 
        status: "waiting",
        time: new Date().toLocaleTimeString(),
        type: isPriority ? "priority" : "regular",
        window: getWindowFromService(selectedService)
    });
    queueList.sort(function (a, b) {
        if (a.type === "priority" && b.type !== "priority") return -1;
        if (a.type !== "priority" && b.type === "priority") return 1;
        return 0;
    });
    localStorage.setItem("queueList", JSON.stringify(queueList));

    localStorage.setItem("queue_userService", selectedService);
    localStorage.setItem("queue_userName", userName);
    localStorage.setItem("queue_userType", isPriority ? "priority" : "regular");
    localStorage.setItem("queue_userId", qNum);

    saveReportTransaction(qNum, userName, selectedService, category, isPriority);

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.querySelectorAll('input[name="priority"]').forEach(function (r) { r.checked = false; });
    document.getElementById("terms").checked = false;
    var of2 = document.getElementById("otherPriority");
    if (of2) of2.value = "";

    closeModal("infoModal");

    if (isPriority) {
        window.location.href = "Que-numberPriority.html";
    } else {
        window.location.href = "Que-number.html";
    }
}

function saveReportTransaction(queueId, name, service, category, isPriority) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var semester = (month >= 8 && month <= 12) ? "1st Semester"
        : (month >= 1 && month <= 5) ? "2nd Semester"
            : "Summer";
    var dateStr = year + "-" + String(month).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");

    var existing = [];
    try { existing = JSON.parse(localStorage.getItem("reportTransactions")) || []; }
    catch (e) { existing = []; }

    existing.push({
        queueId: queueId, name: name, service: service,
        category: category, queueType: isPriority ? "priority" : "regular",
        status: "waiting", date: dateStr,
        time: now.toLocaleTimeString(), year: year, month: month, semester: semester
    });
    localStorage.setItem("reportTransactions", JSON.stringify(existing));
}

function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

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
function historygo() { window.location.href = "history.html"; }
function dashboardgo() { window.location.href = "main.html"; }
function profilego() { window.location.href = "student-profile.html"; }

function setRole(r) {
    var pill = document.getElementById("role-pill");
    var label = document.getElementById("role-label");
    var btnR = document.getElementById("btn-reg");
    var btnC = document.getElementById("btn-cash");
    if (r === "registrar") {
        pill.className = "role-pill registrar"; label.textContent = "Registrar";
        btnR.classList.add("selected", "reg"); btnR.classList.remove("cash");
        btnC.classList.remove("selected", "cash", "reg");
    } else {
        pill.className = "role-pill cashier"; label.textContent = "Cashier";
        btnC.classList.add("selected", "cash"); btnC.classList.remove("reg");
        btnR.classList.remove("selected", "reg", "cash");
    }
}

window.addEventListener("DOMContentLoaded", function () {
    var queueBtn = document.getElementById("queueBtn");
    if (queueBtn) queueBtn.onclick = function () { openModal("queueModal"); };
});