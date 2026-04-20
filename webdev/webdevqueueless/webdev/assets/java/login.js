function handleLogin(e) {
    e.preventDefault(); // stop normal submit

    let email = document.querySelector('input[name="email"]').value;
    let password = document.querySelector('input[name="password"]').value;

    // ADMIN LOGIN
    if (email === "admin@wmsu" && password === "admin123") {
        window.location.href = "../ADMIN-DASHBOARD/Admin-Dashboard.html";
    }

    // STUDENT LOGIN
    else if (email.endsWith("@wmsu.edu.ph") && password === "student123") {
        window.location.href = "../student-landing-page/main.html";
    }

    // NON-STUDENT LOGIN
    else {
        window.location.href = "../student-landing-page/nonS-main.html";
    }
}