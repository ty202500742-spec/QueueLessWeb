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

// Every "Confirm & Proceed" button in ALL popups calls this
function openInfoModal() {
  if (!selectedService) {
    alert("Please select a service first.");
    return;
  }

  // Show the chosen service inside the modal so the user knows what they're queuing for
  let preview = document.getElementById("modalServicePreview");
  if (preview) preview.textContent = selectedService;

  openModal("infoModal");
}

function addQueue() {
  let userName = document.getElementById("name").value.trim();
  let userPhone = document.getElementById("phone").value.trim();
  let terms = document.getElementById("terms").checked;

  if (!userName) {
    alert("Please enter your name.");
    return;
  }

  if (!userPhone) {
    alert("Please enter your phone number.");
    return;
  }

  if (!terms) {
    alert("You must accept the Terms & Conditions!");
    return;
  }

  let priorityChoice = document.querySelector('input[name="priority"]:checked');
  if (!priorityChoice) {
    alert("Please select Yes or No for VIP/PWD.");
    return;
  }

  let isPriority = priorityChoice.value === "yes";

  // different queues dpeneding on priority status, but all rendered in same admin table sorted by time
 let queueList = JSON.parse(localStorage.getItem("queueList")) || [];

  // Generate a short 3-digit incrementing number e.g. Q-001, PR-002
  let counter = parseInt(localStorage.getItem("queueCounter") || "0") + 1;
  localStorage.setItem("queueCounter", counter);
  let paddedNum = String(counter).padStart(3, "0");
  let qNum = (isPriority ? "PR-" : "Q-") + paddedNum;

  let newQueue = {
    id: qNum,
    name: userName,
    phone: userPhone,
    purpose: selectedService,
    status: "waiting",
    time: new Date().toLocaleTimeString(),
    type: isPriority ? "priority" : "regular"
  };

  // Priority goes to top of array, regular goes to bottom
  // Admin table reads array top-to-bottom = first-in shown at top
queueList.push(newQueue);

// Priority goes to top automatically
queueList.sort((a, b) => {
  if (a.type === "priority" && b.type !== "priority") return -1;
  if (a.type !== "priority" && b.type === "priority") return 1;
  return 0;
});


localStorage.setItem("queueList", JSON.stringify(queueList));


  if (isPriority) {
    window.location.href = "Que-numberPriority.html";
  } else {
    window.location.href = "Que-number.html";
  }

  // Save session so quenum.js can identify this user
  localStorage.setItem("queue_userService", selectedService);
  localStorage.setItem("queue_userName", userName);
  localStorage.setItem("queue_userType", isPriority ? "priority" : "regular");
  localStorage.setItem("queue_userId", qNum);

  alert("Successfully added to queue!");

  // Reset form
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.querySelectorAll('input[name="priority"]').forEach(r => r.checked = false);
  document.getElementById("terms").checked = false;
  let otherField = document.getElementById("otherPriority");
  if (otherField) otherField.value = "";

  closeModal("infoModal");

  window.location.href = "Que-number.html";
}

// --- Sidebar ---
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

function historygo() { window.location.href = 'history.html'; }
function dashboardgo() { window.location.href = 'main.html'; }
function profilego() { window.location.href = 'student-profile.html'; }

function setRole(r) {
  const pill = document.getElementById('role-pill');
  const label = document.getElementById('role-label');
  const btnR = document.getElementById('btn-reg');
  const btnC = document.getElementById('btn-cash');

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

window.addEventListener("DOMContentLoaded", () => {
  let queueBtn = document.getElementById("queueBtn");
  if (queueBtn) {
    queueBtn.onclick = () => openModal("queueModal");
  }
});

function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }