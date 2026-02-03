(function () {
  'use strict';

  function isLoggedIn() {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return false;
      const user = JSON.parse(raw || 'null');
      if (!user) return false;
 
      return !!(user.email || user.username || user.name);
    } catch (e) {
      return false;
    }
  }

  function redirectToLogin() {
    try {
      window.location.href = './signup.html';
    } catch (e) {
      window.location.href = '../pages/signup.html';
    }
  }

  function ensureAuth() {
    if (!isLoggedIn()) redirectToLogin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAuth);
  } else {
    ensureAuth();
  }

  window.addEventListener('storage', (e) => { if (!isLoggedIn()) redirectToLogin();});
  window.addEventListener('tasks:logout', () => { if (!isLoggedIn()) redirectToLogin(); });
  window.addEventListener('app:logout', () => { if (!isLoggedIn()) redirectToLogin(); });
})();