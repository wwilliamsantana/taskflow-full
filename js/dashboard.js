(function () {
  'use strict';

  function getTasks() {
    if (typeof window.getTasks === 'function') {
      try { return window.getTasks(); } catch (e) { }
    }
    try { return JSON.parse(localStorage.getItem('tasks') || '[]'); } catch (e) { return []; }
  }


  const summaryCards = document.querySelectorAll('.summary-cards .card');
  const progressPercentEl = document.querySelector('.progress-percent');
  const progressFill = document.querySelector('.progress-fill');
  const welcomeHeading = document.querySelector('main > h3');

  function renderDashboard() {
    if ((!summaryCards || summaryCards.length === 0) && !progressPercentEl && !welcomeHeading) return;
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const projects = Array.from(new Set(tasks.map(t => (t.subtitle || '').trim()).filter(Boolean))).length;
    const overdue = 0; 
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (summaryCards && summaryCards.length >= 4) {
      summaryCards[0].querySelector('p').textContent = pending;
      summaryCards[1].querySelector('p').textContent = completed;
      summaryCards[2].querySelector('p').textContent = projects;
      summaryCards[3].querySelector('p').textContent = overdue;
    }

    if (progressPercentEl) progressPercentEl.textContent = percent + '%';
    if (progressFill) {
      progressFill.style.width = percent + '%';
      const bar = progressFill.parentNode;
      if (bar) bar.setAttribute('aria-valuenow', String(percent));
    }

    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (user && user.username && welcomeHeading) {
        welcomeHeading.textContent = `Bem-vindo ao seu Dashboard, ${user.username}!`;
      }
    } catch (e) {
    }
  }

  renderDashboard();

  window.addEventListener('storage', (e) => {
    if ((e.key && e.key.startsWith && e.key.startsWith('tasks')) || e.key === 'currentUser') {
      renderDashboard();
      if (tasksList) renderTasks(searchInput ? searchInput.value.trim() : '');
    }
  });

  const originalSave = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    originalSave(key, value);
    if ((key && key.startsWith && key.startsWith('tasks')) || key === 'currentUser') {
      renderDashboard();
      if (tasksList) renderTasks(searchInput ? searchInput.value.trim() : '');
    }
  };

})