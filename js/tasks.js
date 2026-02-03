
(function () {
  'use strict';

  function getTasks() {
    try {
      return JSON.parse(localStorage.getItem('tasks') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function createTask({ title, subtitle, urgency }) {
    const tasks = getTasks();
    const task = {
      id: Date.now().toString(),
      title: title || 'Untitled',
      subtitle: subtitle || '',
      urgency: urgency || 'low', // high, medium, low
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(task);
    saveTasks(tasks);
    return task;
  }

  function updateTask(updated) {
    const tasks = getTasks().map(task => task.id === updated.id ? Object.assign({}, task, updated, { updatedAt: new Date().toISOString() }) : task);
    saveTasks(tasks);
    return tasks;
  }

  function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
    return tasks;
  }

  function formatUrgencyLabel(urgency) {
    return urgency === 'high' ? 'Alta' : urgency === 'medium' ? 'Média' : 'Baixa';
  }

  function showMessage(container, text, type = 'info') {
    if (!container) return;
    let msg = container.querySelector('.tasks-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'tasks-message';
      msg.style.marginTop = '12px';
      msg.style.fontWeight = '500';
      container.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = type === 'error' ? 'crimson' : 'green';
    clearTimeout(msg._timeout);
    msg._timeout = setTimeout(() => { msg.textContent = ''; }, 3000);
  }

  const createForm = document.querySelector('.task-form');

  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value
      const subtitle = document.getElementById('subtitle').value
      const urgency = (createForm.querySelector('input[name="urgency"]:checked') || {}).value;

      if (!title) {
        showMessage(createForm, 'O título é obrigatório.', 'error');
        return;
      }
      if (!subtitle) {
      showMessage(createForm, 'O subtítulo é obrigatório.', 'error');
      return;
     }
      if (!urgency) {
      showMessage(createForm, 'A urgência é obrigatória.', 'error');
      return;
     }

      createTask({ title, subtitle, urgency });
      showMessage(createForm, 'Tarefa criada! Redirecionando...', 'success');
      setTimeout(() => { window.location.href = 'list-tasks.html'; }, 800);
    });
  }

  const tasksList = document.querySelector('.task-list');
  const searchInput = document.querySelector('.task-search input[type="search"]');

  function renderTasks(filterText = '') {
    if (!tasksList) return;

    const tasks = getTasks();
    const filtered = tasks.filter(task => {
      const search = filterText.toLowerCase();
      if (!search) return true;
      return task.title.toLowerCase().includes(search) || task.subtitle.toLowerCase().includes(search);
    });

    tasksList.innerHTML = '';

    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.className = 'no-tasks';
      li.textContent = 'Nenhuma tarefa encontrada.';
      tasksList.appendChild(li);
      return;
    }

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task';
      if (task.completed) li.classList.add('completed');

      li.innerHTML = `
        <div class="task-main">
          <label class="task-checkbox">
          <input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
           <span class="checkmark"></span>
          </label>
          <div>
            <strong class="task-title">${task.title}</strong>
            <span class="task-meta">${task.subtitle}</span>
          </div>
        </div>
        <div class="task-actions">
          <span class="urgency">${formatUrgencyLabel(task.urgency)}</span>
          <button class="btn edit-btn" data-id="${task.id}" type="button">Editar</button>
          <button class="btn delete-btn" data-id="${task.id}" type="button">Remover</button>
        </div>
      `;

      tasksList.appendChild(li);
    });
  }


  if (tasksList) {
    renderTasks();

    if (searchInput) {
      let time;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(time);
        time = setTimeout(() => renderTasks(searchInput.value.trim()), 150);
      });
    }

    tasksList.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;

      if (e.target.matches('input[type="checkbox"]').parentNode || e.target.matches('input[type="checkbox"]')) {
        const checkbox = e.target.matches('input[type="checkbox"]') ? e.target : e.target.querySelector('input[type="checkbox"]');
        const checked = checkbox.checked;
        updateTask({ id, completed: checked });
        renderTasks(searchInput ? searchInput.value.trim() : '');
        return;
      }

      if (e.target.classList.contains('edit-btn')) {
        const tasks = getTasks();
        const task = tasks.find(task => task.id === id);
        if (!task) return;
        const newTitle = prompt('Editar título:', task.title);
        if (newTitle === null) return;
        const newSubtitle = prompt('Editar subtítulo/projeto (opcional):', task.subtitle);
        if (newSubtitle === null) return;
        const newUrgency = prompt('Grau de urgência (high, medium, low):', task.urgency);
        if (newUrgency === null) return;

        updateTask({ id, title: newTitle.trim() || task.title, subtitle: newSubtitle.trim(), urgency: ['high', 'medium', 'low'].includes(newUrgency) ? newUrgency : task.urgency });
        showMessage(tasksList.parentNode || tasksList, 'Tarefa atualizada', 'success');
        renderTasks(searchInput ? searchInput.value.trim() : '');
        return;
      }

      if (e.target.classList.contains('delete-btn')) {
        if (!confirm('Remover esta tarefa?')) return;
        deleteTask(id);
        showMessage(tasksList.parentNode || tasksList, 'Tarefa removida', 'success');
        renderTasks(searchInput ? searchInput.value.trim() : '');
        return;
      }
    });
  }

  const summaryCards = document.querySelectorAll('.summary-cards .card');
  const progressPercentEl = document.querySelector('.progress-percent');
  const progressFill = document.querySelector('.progress-fill');
  const welcomeHeading = document.querySelector('main > h3');

  function renderDashboard() {
    if (!summaryCards && !progressPercentEl) return;
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
    if (e.key === 'tasks' || e.key === 'currentUser') {
      renderDashboard();
      if (tasksList) renderTasks(searchInput ? searchInput.value.trim() : '');
    }
  });

  const originalSave = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    originalSave(key, value);
    if (key === 'tasks' || key === 'currentUser') {
      renderDashboard();
      if (tasksList) renderTasks(searchInput ? searchInput.value.trim() : '');
    }
  };

})();
