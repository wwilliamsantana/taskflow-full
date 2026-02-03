(function () {
  'use strict';

  function getUserTasks() {
    if (typeof window.getTasks === 'function') {
      try { return window.getTasks(); } catch (e) { }
    }

    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!user) return [];
      const id = user.id || user.email || user.username || user.name;
      if (!id) return [];

      const key = `tasks:${id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try { return JSON.parse(raw || '[]'); } catch (e) {}
      }

      const legacy = localStorage.getItem('tasks');
      if (legacy) {
        try { return JSON.parse(legacy); } catch (e) {}
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tasks:') && key.includes(id)) {
          try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { }
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }



  function renderProfile() {
    const nameElement = document.getElementById('profile-name');
    const emailElement = document.getElementById('profile-email');
    const bioElement = document.querySelector('.profile .bio');
    const avatarSpan = document.querySelector('.avatar span');
    const actions = document.getElementById('profile-actions');

    const statCompleted = document.getElementById('stat-completed');
    const statPending = document.getElementById('stat-pending');
    const statProjects = document.getElementById('stat-projects');

    let user = null;

    try {
      user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (e) {
      user = null;
    }

    if (user && (user.name || user.username || user.email)) {
      if (nameElement) nameElement.textContent = user.name || user.username || 'Usuário';
      if (emailElement) emailElement.textContent = user.email || '';
      if (bioElement && user.bio) bioElement.textContent = user.bio;
      if (avatarSpan) {
        const name = user.name || user.username || '';
        const initials = name.split(/\s+/).filter(Boolean).map(letter => letter[0].toUpperCase()).slice(0,2).join('') || (user.email ? user.email[0].toUpperCase() : 'U');
        avatarSpan.textContent = initials;
      }
      if (actions) actions.style.display = '';
    } else {
      if (nameElement) nameElement.textContent = 'Convidado';
      if (emailElement) emailElement.textContent = '';
      if (avatarSpan) avatarSpan.textContent = 'U';
      if (actions) actions.style.display = 'none';
    }

    try {
      const tasks = getUserTasks();
      const completed = tasks.filter(task => task.completed).length;
      const total = tasks.length;
      const pending = Math.max(0, total - completed);
      const projects = Array.from(new Set(tasks.map(task => task.subtitle.trim()).filter(Boolean))).length;
      if (statCompleted) statCompleted.textContent = String(completed);
      if (statPending) statPending.textContent = String(pending);
      if (statProjects) statProjects.textContent = String(projects);

      renderTasksOverview(tasks);
    } catch (e) {}
  }

  window.addEventListener('storage', (event) => {
    if (!event.key || event.key === 'currentUser' || (event.key && event.key.startsWith && event.key.startsWith('tasks'))) {
      renderProfile();
    }
  });
  window.addEventListener('tasks:logout', renderProfile);
  window.addEventListener('app:logout', renderProfile);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProfile);
  } else {
    renderProfile();
  }
})();