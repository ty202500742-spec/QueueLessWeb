let selectedService = "";

function chooseService(purpose) {
    selectedService = purpose;

    for (let i = 1; i <= 8; i++) {
        let box = document.getElementById("confirmBox" + i);
        if (box) box.style.display = "block";
    }

    let requirements = "";
    switch (purpose) {
        case "Enrollment":
        case "EAT":
        case "NAT":
        case "Interview":
            requirements = "CET Results";
            break;
        case "Shifting":
        case "Readmission":
        case "Miscellaneous":
        case "Certificate":
        case "Diploma":
            requirements = "School ID or COR";
            break;
        case "Tuition Fee":
        case "TOR":
        case "ID Request":
        case "ID Replacement":
            requirements = "COR and Required Amount";
            break;
        case "Other fees":
            requirements = "School ID";
            break;
        case "Scholarship":
            requirements = "Form 138 or any grade report";
            break;
        default:
            requirements = "Check office for Requirements";
    }

    for (let i = 1; i <= 8; i++) {
        let selectedEl = document.getElementById("selectedText" + i);
        let reqEl = document.getElementById("requirementText" + i);
        
        if (selectedEl) selectedEl.innerHTML = `<strong>You selected:</strong> ${purpose}`;
        if (reqEl) reqEl.innerHTML = `<strong>Requirements:</strong> ${requirements}`;
    }
}

function addQueue(btn) {
    let popup = btn.closest(".popup");
    let selectedDay = popup.querySelector("#queueDay").value;
    
    if(!selectedDay) {
        alert("Please select a day before confirming.");
        return;
    }

    let userName = localStorage.getItem("queue_userName") || "Unknown User";
    let userType = localStorage.getItem("queue_userType") || "guest";

    let regularQueue = JSON.parse(localStorage.getItem("regularQueue")) || [];
    let priorityQueue = JSON.parse(localStorage.getItem("priorityQueue")) || [];

    let qNum = "";

    if (userType === "priority") {

    let nextNum = priorityQueue.length + 1;
        qNum = "PR-" + nextNum.toString().padStart(3, '0');
    } else {
        let nextNum = regularQueue.length + 1;
        qNum = "Q-" + nextNum.toString().padStart(3, '0');
    }

    let newQueue = {
        id: qNum,
        name: userName,
        type: userType,
        purpose: selectedService,
        day: selectedDay,
        status: "waiting",
        time: new Date().toLocaleTimeString()
    };

    if (userType === "priority") {
        priorityQueue.push(newQueue);
        localStorage.setItem("priorityQueue", JSON.stringify(priorityQueue));
    } else {
        regularQueue.push(newQueue);
        localStorage.setItem("regularQueue", JSON.stringify(regularQueue));
    }

    window.location.href = "Que-number.html";
}