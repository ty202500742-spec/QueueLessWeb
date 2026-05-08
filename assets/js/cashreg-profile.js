window.addEventListener("DOMContentLoaded", function() {
    var user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    var fullName = user.firstName
        ? (user.firstName + " " + (user.middleName || "") + " " + user.lastName + (user.suffix ? " " + user.suffix : "")).trim()
        : (user.name || "—");
    document.getElementById("profileContent").innerHTML =
        '<div class="info-row"><span class="info-label">Full Name</span><span class="info-value">' + fullName + '</span></div>' +
        '<div class="info-row"><span class="info-label">Email</span><span class="info-value">' + (user.email || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Contact</span><span class="info-value">' + (user.contact || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Department</span><span class="info-value">' + (user.department || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Role</span><span class="info-value">' + (user.role === 'registrar_staff' ? 'Registrar Staff' : '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Window</span><span class="info-value">' + (user.window || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Employee ID</span><span class="info-value">' + (user.empId || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Account Status</span><span class="info-value">' + (user.status || 'Active') + '</span></div>';
});