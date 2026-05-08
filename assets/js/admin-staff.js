(function() {
  var staffAccounts = JSON.parse(localStorage.getItem("staffAccounts") || "[]");
  if (staffAccounts.length === 0) {
    staffAccounts = [
      { name: "Cashier Staff 1", email: "cashier@wmsu.edu.ph", password: "cashier123", role: "cashier_staff", status: "Active" },
      { name: "Registrar Staff 1", email: "registrar@wmsu.edu.ph", password: "registrar123", role: "registrar_staff", status: "Active" }
    ];
    localStorage.setItem("staffAccounts", JSON.stringify(staffAccounts));
  }

  function renderStaffTable() {
    var tbody = document.getElementById("staffBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    staffAccounts.forEach(function(acc, idx) {
      var tr = document.createElement("tr");
      var statusClass = acc.status === "Active" ? "serving" : "warning";
      tr.innerHTML =
        '<td>' + acc.name + '</td>' +
        '<td>' + acc.email + '</td>' +
        '<td>' + acc.role + '</td>' +
        '<td><span class="pill ' + statusClass + '">' + acc.status + '</span></td>' +
        '<td><button class="btn-sm done" onclick="window.toggleStaffStatus(' + idx + ')">' +
          (acc.status === "Active" ? "Deactivate" : "Activate") +
        '</button></td>';
      tbody.appendChild(tr);
    });
  }

  window.openCreateModal = function() {
    var modal = document.getElementById("create-modal");
    if (modal) {
      modal.classList.add("open");
    }
  };

  window.closeCreateModal = function() {
    var modal = document.getElementById("create-modal");
    if (modal) {
      modal.classList.remove("open");
    }
  };

  window.createStaffAccount = function() {
    var name = document.getElementById("ca-name").value.trim();
    var email = document.getElementById("ca-email").value.trim();
    var password = document.getElementById("ca-password").value;
    var role = document.getElementById("ca-role").value;

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    staffAccounts.push({ name: name, email: email, password: password, role: role, status: "Active" });
    localStorage.setItem("staffAccounts", JSON.stringify(staffAccounts));

    // Clear form
    document.getElementById("ca-name").value = "";
    document.getElementById("ca-email").value = "";
    document.getElementById("ca-password").value = "";
    document.getElementById("ca-role").value = "cashier_staff";

    closeCreateModal();
    renderStaffTable();
    alert("Account created successfully.");
  };

  window.toggleStaffStatus = function(idx) {
    if (idx < 0 || idx >= staffAccounts.length) return;
    staffAccounts[idx].status = staffAccounts[idx].status === "Active" ? "Deactivated" : "Active";
    localStorage.setItem("staffAccounts", JSON.stringify(staffAccounts));
    renderStaffTable();
  };

  // Also close modal when clicking the Cancel button (the Cancel button uses onclick="closeCreateModal()" now)
  window.closeCreateModal = function() {
    var modal = document.getElementById("create-modal");
    if (modal) modal.classList.remove("open");
  };

  renderStaffTable();
})();