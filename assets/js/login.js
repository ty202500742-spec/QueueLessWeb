function handleLogin(e) {
    e.preventDefault(); // stop normal submit

    let email = document.querySelector('input[name="email"]').value;
    let password = document.querySelector('input[name="password"]').value;

    // ADMIN LOGIN
    if (email === "admin@wmsu.edu.ph" && password === "admin123") {
        window.location.href = "../ADMIN-DASHBOARD/admin-Dashboard.html";
    }

    // STUDENT LOGIN
    else if (email === "registrar@wmsu.edu.ph" && password === "regist123") {
        window.location.href = "../REGISTRAR-DASHBOARD/registrar-dashboard.html";
    }

    // NON-STUDENT LOGIN
    else if (email === "cashier@wmsu.edu.ph" && password === "cash123") {
        window.location.href = "../CASHIER-DASHBOARD/cashier-dashboard.html";
    }
}