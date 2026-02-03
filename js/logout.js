(function () {
  'use strict';

  function logoutAll(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
      localStorage.removeItem('currentUser');
      try {
        const event = new StorageEvent('storage', { key: 'currentUser', newValue: null });
        window.dispatchEvent(event);
      } catch (err) {
        window.dispatchEvent(new Event('tasks:logout'));
      }
    } catch (err) {
    }
    try {
      window.location.href = '../index.html';
    } catch (err) {
      window.location.href = 'index.html';
    }
  }

  function attach() {
    const logout = document.querySelector('.logout-btn');
    if (!logout) return;

    logout.addEventListener('click', function (e) {
      logoutAll(e);
    });

    logout.dataset.logoutBound = 'true';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
