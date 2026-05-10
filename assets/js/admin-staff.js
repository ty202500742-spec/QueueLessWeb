(function() {
    var staffAccounts = JSON.parse(localStorage.getItem("staffAccounts") || "[]");
    (function() {
    // ── Seed default accounts if empty ──
    function seedStaffAccounts() {
        var existing = JSON.parse(localStorage.getItem("staffAccounts") || "[]");
        if (existing.length > 0) return;
        var defaultStaff = [
            { id: "RS-001", name: "Maria Santos", email: "registrar1@wmsu.edu.ph", contact: "09171234561", department: "Registrar", role: "registrar_staff", window: "Window 1 - School to School & Faculty Clearance", empId: "RS-001", status: "Active" },
            { id: "RS-002", name: "Jose Reyes", email: "registrar2@wmsu.edu.ph", contact: "09171234562", department: "Registrar", role: "registrar_staff", window: "Window 2 - Request of Documents", empId: "RS-002", status: "Active" },
            { id: "RS-003", name: "Ana Cruz", email: "registrar3@wmsu.edu.ph", contact: "09171234563", department: "Registrar", role: "registrar_staff", window: "Window 3 - Request of Documents", empId: "RS-003", status: "Active" },
            { id: "RS-004", name: "Pedro Lim", email: "registrar4@wmsu.edu.ph", contact: "09171234564", department: "Registrar", role: "registrar_staff", window: "Window 4 - Request of Documents", empId: "RS-004", status: "Active" },
            { id: "RS-005", name: "Lucia Gomez", email: "registrar5@wmsu.edu.ph", contact: "09171234565", department: "Registrar", role: "registrar_staff", window: "Window 5 - Releasing", empId: "RS-005", status: "Active" },
            { id: "RS-006", name: "Ramon Dela Cruz", email: "registrar6@wmsu.edu.ph", contact: "09171234566", department: "Registrar", role: "registrar_staff", window: "Window 6 - Releasing", empId: "RS-006", status: "Active" },
            { id: "CS-001", name: "Elena Villanueva", email: "cashier1@wmsu.edu.ph", contact: "09181234561", department: "Cashier", role: "cashier_staff", window: "Window 1 - Releasing of Payments / TES", empId: "CS-001", status: "Active" },
            { id: "CS-002", name: "Marco Bautista", email: "cashier2@wmsu.edu.ph", contact: "09181234562", department: "Cashier", role: "cashier_staff", window: "Window 2 - Releasing of Checks", empId: "CS-002", status: "Active" },
            { id: "CS-003", name: "Sofia Ramos", email: "cashier3@wmsu.edu.ph", contact: "09181234563", department: "Cashier", role: "cashier_staff", window: "Window 3 - Releasing of Checks", empId: "CS-003", status: "Active" },
            { id: "CS-004", name: "Diego Flores", email: "cashier4@wmsu.edu.ph", contact: "09181234564", department: "Cashier", role: "cashier_staff", window: "Window 4 - Collection (Priority)", empId: "CS-004", status: "Active" },
            { id: "CS-005", name: "Carmen Torres", email: "cashier5@wmsu.edu.ph", contact: "09181234565", department: "Cashier", role: "cashier_staff", window: "Window 5 - Collection", empId: "CS-005", status: "Active" },
            { id: "CS-006", name: "Luis Mendoza", email: "cashier6@wmsu.edu.ph", contact: "09181234566", department: "Cashier", role: "cashier_staff", window: "Window 6 - TES Scholars", empId: "CS-006", status: "Active" },
            { id: "CS-007", name: "Isabel Castro", email: "cashier7@wmsu.edu.ph", contact: "09181234567", department: "Cashier", role: "cashier_staff", window: "Window 7 - Releasing of Petty Cash", empId: "CS-007", status: "Active" },
            { id: "CS-008", name: "Antonio Rivera", email: "cashier8@wmsu.edu.ph", contact: "09181234568", department: "Cashier", role: "cashier_staff", window: "Window 8 - Assessment", empId: "CS-008", status: "Active" },
            { id: "CS-009", name: "Rosa Navarro", email: "cashier9@wmsu.edu.ph", contact: "09181234569", department: "Cashier", role: "cashier_staff", window: "Window 9 - Assessment", empId: "CS-009", status: "Active" }
        ];
        localStorage.setItem("staffAccounts", JSON.stringify(defaultStaff));
    }

    seedStaffAccounts(); // ← add this line
    var staffAccounts = JSON.parse(localStorage.getItem("staffAccounts") || "[]");

    function render() {
        // ... rest of your existing code unchanged
    }

    render();
})();
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