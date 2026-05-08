function resetQueueData() {
    if (!confirm("Reset all active queues?")) return;
    localStorage.removeItem("queueList");
    localStorage.removeItem("queueCounter");
    alert("Queue data reset.");
}

function clearStudentRecords() {
    if (!confirm("Clear all student records?")) return;
    localStorage.removeItem("queueList");
    alert("Student records cleared.");
}

function clearReports() {
    if (!confirm("Delete all report transactions?")) return;
    localStorage.removeItem("reportTransactions");
    alert("Reports cleared.");
}

function fullSystemReset() {
    if (!confirm("Full system reset? This cannot be undone.")) return;
    ["queueList","queueCounter","reportTransactions","queueHistory","queue_userId","queue_userName","queue_userService","queue_userWindow","staffAccounts"].forEach(function(k) {
        localStorage.removeItem(k);
    });
    alert("Full reset complete. All data wiped.");
}

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("resetQueueBtn").addEventListener("click", resetQueueData);
    document.getElementById("clearStudentsBtn").addEventListener("click", clearStudentRecords);
    document.getElementById("clearReportsBtn").addEventListener("click", clearReports);
    document.getElementById("fullResetBtn").addEventListener("click", fullSystemReset);
});