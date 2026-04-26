function handleEntry(e) {
    e.preventDefault(); // Stop page refresh

    //values from the form
    let fullName = document.querySelector('input[name="fullName"]').value;
    let email = document.querySelector('input[name="email"]').value;
    let userType = document.querySelector('select[name="userType"]').value;
    let idNumber = document.querySelector('input[name="idNumber"]').value;

    //validates wmsu email for student and faculty/admin
    if ((userType === "student" || userType === "faculty") && !email.endsWith("@wmsu.edu.ph")) {
        alert("Please enter a valid WMSU email address.");
        return;
    }

    // ADMIN LOGIN
    if (email === "admin@wmsu.edu.ph" && fullName.toLowerCase() === "admin") {
        window.location.href = "../ADMIN-DASHBOARD/Admin-Dashboard.html";
        return;
    }

    localStorage.setItem("queue_userName", fullName);
    localStorage.setItem("queue_userType", userType);
    localStorage.setItem("queue_email", email);
    localStorage.setItem("queue_id", idNumber);

    // STUDENT/NONSTUDENT LOGIN REDIRECT
    if (userType === "guest") {
        window.location.href = "../student-landing-page/nonS-main.html";
    } else {
        window.location.href = "../student-landing-page/main.html";
    }
}