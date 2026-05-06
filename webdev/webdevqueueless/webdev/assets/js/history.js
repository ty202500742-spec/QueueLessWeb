 let isOpen = false;

  function toggleSidebar() {
    isOpen ? closeSidebar() : openSidebar();
  }

  function openSidebar() {
    isOpen = true;
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
    document.getElementById('ham').classList.add('active');
  }

  function closeSidebar() {
    isOpen = false;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('ham').classList.remove('active');
  }
  function historygo() {
    window.location.href = 'history.html';
  }
   function dashboardgo() {
    window.location.href = 'index.html';
  }

  function profilego() {
    window.location.href = 'student-profile.html';
  }
  function setRole(r) {
    const pill  = document.getElementById('role-pill');
    const label = document.getElementById('role-label');
    const btnR  = document.getElementById('btn-reg');
    const btnC  = document.getElementById('btn-cash');

    if (r === 'registrar') {
      pill.className = 'role-pill registrar';
      label.textContent = 'Registrar';
      btnR.classList.add('selected', 'reg');
      btnR.classList.remove('cash');
      btnC.classList.remove('selected', 'cash', 'reg');
    } else {
      pill.className = 'role-pill cashier';
      label.textContent = 'Cashier';
      btnC.classList.add('selected', 'cash');
      btnC.classList.remove('reg');
      btnR.classList.remove('selected', 'reg', 'cash');
    }
}