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

const queueBtn = document.getElementById("queueBtn");

queueBtn.onclick = () => {
  openModal("queueModal");
};

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Handle form submit
document.getElementById("queueForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;
  const terms = document.getElementById("terms").checked;

  if (!terms) {
    alert("You must accept the Terms & Conditions!");
    return;
  }
  
  

  closeModal("infoModal");
});