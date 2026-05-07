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
    window.location.href = 'pages/student-landing-page/statichistory.html';
  }
   function dashboardgo() {
    window.location.href = 'index.html';
  }

  function profilego() {
    window.location.href = 'student-profile.html';
  }
  function Phonego() {
    window.location.href = 'pages/simulation/phone.html';
  }