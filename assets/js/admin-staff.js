(function() {
    var staffAccounts = JSON.parse(localStorage.getItem("staffAccounts") || "[]");

    function render() {
        var tbody = document.getElementById("staffBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        staffAccounts.forEach(function(acc, idx) {
            var fullName = acc.firstName
                ? (acc.firstName + " " + (acc.middleName || "") + " " + acc.lastName + (acc.suffix ? " " + acc.suffix : "")).trim()
                : acc.name || "—";

            var tr = document.createElement("tr");
            tr.innerHTML =
                '<td>' + fullName + '</td>' +
                '<td>' + acc.email + '</td>' +
                '<td>' + (acc.contact || '—') + '</td>' +
                '<td>' + (acc.department || '—') + '</td>' +
                '<td>' + acc.role + '</td>' +
                '<td>' + (acc.window || '—') + '</td>' +
                '<td>' + (acc.empId || '—') + '</td>' +
                '<td><span class="pill ' + (acc.status === "Active" ? "serving" : "warning") + '">' + acc.status + '</span></td>' +
                '<td class="action-cell">' +
                    '<button class="btn-sm skip toggle-status-btn" data-index="' + idx + '">' +
                        (acc.status === "Active" ? "Deactivate" : "Activate") +
                    '</button>' +
                    '<button class="btn-sm done delete-btn" data-index="' + idx + '">Delete</button>' +
                '</td>';
            tbody.appendChild(tr);
        });

        // Attach event listeners
        document.querySelectorAll(".toggle-status-btn").forEach(function(btn) {
            btn.addEventListener("click", function() {
                var idx = parseInt(this.getAttribute("data-index"));
                staffAccounts[idx].status = staffAccounts[idx].status === "Active" ? "Deactivated" : "Active";
                localStorage.setItem("staffAccounts", JSON.stringify(staffAccounts));
                render();
            });
        });

        document.querySelectorAll(".delete-btn").forEach(function(btn) {
            btn.addEventListener("click", function() {
                var idx = parseInt(this.getAttribute("data-index"));
                if (confirm("Permanently delete account for " + staffAccounts[idx].email + "?")) {
                    staffAccounts.splice(idx, 1);
                    localStorage.setItem("staffAccounts", JSON.stringify(staffAccounts));
                    render();
                }
            });
        });
    }

    render();
})();