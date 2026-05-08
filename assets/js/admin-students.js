function loadStudents() {
    var q = JSON.parse(localStorage.getItem("queueList") || "[]");
    var tbody = document.getElementById("studentsBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (q.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;">No student records</td></tr>';
        return;
    }
    q.forEach(function(s) {
        var tr = document.createElement("tr");
        tr.innerHTML = '<td>' + (s.id || '—') + '</td>' +
                       '<td>' + s.name + '</td>' +
                       '<td>' + (s.college || '—') + '</td>' +
                       '<td><span class="pill waiting">' + s.status + '</span></td>';
        tbody.appendChild(tr);
    });
}
window.addEventListener("DOMContentLoaded", function() {
    loadStudents();
    setInterval(loadStudents, 5000);
});