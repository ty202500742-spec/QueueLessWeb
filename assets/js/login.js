function handleLogin(e) {
    e.preventDefault();

    let email = document.querySelector('input[name="email"]').value.trim();
    let password = document.querySelector('input[name="password"]').value;

    // 1. Check staff accounts
    var staffAccounts = JSON.parse(localStorage.getItem("staffAccounts") || "[]");
    for (var i = 0; i < staffAccounts.length; i++) {
        var acc = staffAccounts[i];
        if (acc.email === email && acc.password === password && acc.status === "Active") {
            localStorage.setItem("currentUser", JSON.stringify(acc));
            if (acc.role === "registrar_staff") {
                window.location.href = "../REGISTRAR-DASHBOARD/registrar-dashboard.html";
            } else if (acc.role === "cashier_staff") {
                window.location.href = "../CASHIER-DASHBOARD/cashier-dashboard.html";
            }
            return;
        }
    }

    // 2. Hard‑coded fallback
    if (email === "admin@wmsu.edu.ph" && password === "Admin123") {
        window.location.href = "../ADMIN-DASHBOARD/Admin-Dashboard.html";
    } else if (email === "registrar@wmsu.edu.ph" && password === "regist123") {
        localStorage.setItem("currentUser", JSON.stringify({ name: "Registrar Staff", email: email, role: "registrar_staff", window: "Window 1 - School to School & Faculty Clearance" }));
        window.location.href = "../REGISTRAR-DASHBOARD/registrar-dashboard.html";
    } else if (email === "cashier@wmsu.edu.ph" && password === "cash123") {
        localStorage.setItem("currentUser", JSON.stringify({ name: "Cashier Staff", email: email, role: "cashier_staff", window: "Window 1 - Releasing of Payments / TES" }));
        window.location.href = "../CASHIER-DASHBOARD/cashier-dashboard.html";
    } else {
        alert("Invalid email or password.");
    }
}

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
});