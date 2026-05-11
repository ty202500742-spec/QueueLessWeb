var registrarWindows = [
    "Window 1 - School to School & Faculty Clearance",
    "Window 2 - Request of Documents",
    "Window 3 - Request of Documents",
    "Window 4 - Request of Documents",
    "Window 5 - Releasing",
    "Window 6 - Releasing"
];

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

function toggleWindows() {
    var role = document.getElementById("reg-role").value;
    var group = document.getElementById("window-select-group");
    var select = document.getElementById("reg-window");
    select.innerHTML = "";

    if (role === "registrar_staff") {
        group.style.display = "block";
        registrarWindows.forEach(function(win) {
            var opt = document.createElement("option");
            opt.value = win; opt.textContent = win;
            select.appendChild(opt);
        });
    } else if (role === "cashier_staff") {
        group.style.display = "block";
        cashierWindows.forEach(function(win) {
            var opt = document.createElement("option");
            opt.value = win; opt.textContent = win;
            select.appendChild(opt);
        });
    } else {
        group.style.display = "none";
    }
}

function registerStaff() {
    var firstName = document.getElementById("reg-firstname").value.trim();
    var middleName = document.getElementById("reg-middlename").value.trim();
    var lastName = document.getElementById("reg-lastname").value.trim();
    var suffix = document.getElementById("reg-suffix").value.trim();
    var contact = document.getElementById("reg-contact").value.trim();
    var department = document.getElementById("reg-department").value.trim();
    var email = document.getElementById("reg-email").value.trim();
    var password = document.getElementById("reg-password").value;
    var role = document.getElementById("reg-role").value;
    var windowVal = document.getElementById("reg-window").value;
    var empId = document.getElementById("reg-empid").value.trim();

    if (!firstName || !lastName || !email || !password || !role || !windowVal || !empId) {
        alert("Please fill in all required fields (First Name, Last Name, Email, Password, Role, Window, Employee ID).");
        return;
    }
    if(firstName >= 0 || lastName >= 0) {
        alert("Names cannot contain numbers.");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }
    if(!/^\d{11}$/.test(contact)) {
        alert("Contact number must be 11 digits (e.g. 09XXXXXXXXX).");
        return;
    }
    var accounts = JSON.parse(localStorage.getItem("staffAccounts") || "[]");
    if (accounts.some(function(acc) { return acc.email === email; })) {
        alert("An account with this email already exists.");
        return;
    }

    var fullName = firstName + (middleName ? " " + middleName : "") + " " + lastName + (suffix ? " " + suffix : "");

    accounts.push({
        firstName: firstName, middleName: middleName, lastName: lastName, suffix: suffix,
        name: fullName,
        contact: contact, department: department,
        email: email, password: password,
        role: role, window: windowVal,
        empId: empId, status: "Active", windowOpen: true
    });

    localStorage.setItem("staffAccounts", JSON.stringify(accounts));
    alert("Account created successfully! You can now login.");
    window.location.href = "login.html";
}

// Attach event listeners
window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registerBtn")?.addEventListener("click", registerStaff);
    document.getElementById("reg-role")?.addEventListener("change", toggleWindows);
    document.getElementById("resetBtn")?.addEventListener("click", function() {
        // Handle reset password logic here
        alert("Email sent! Check your email inbox to reset your password.");
    });

});
