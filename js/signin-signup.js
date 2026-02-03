document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return; 

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const usernameInput = document.getElementById('username'); 

  // redireciona automaticamente se já estiver logado e estiver na página de login
  const isLoginPage = !usernameInput;
  if (isLoginPage && localStorage.getItem('currentUser')) {
    window.location.href = 'dashboard.html';
    return;
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = (emailInput.value || '').trim().toLowerCase();
    const password = passwordInput.value || '';

    if (usernameInput) {
      // Página de cadastro
      const username = (usernameInput.value || '').trim();
      if (!email || !username || !password) {
        showMessage('Preencha todos os campos', 'error');
        return;
      }

      const users = getUsers();
      if (users.some(user => user.email === email)) {
        showMessage('Email já cadastrado', 'error');
        return;
      }

      users.push({ email, username, password });
      saveUsers(users);

      showMessage('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
      setTimeout(() => {
        window.location.href = 'signup.html'; // página de login
      }, 1200);

    } else {
      // Página de login
      if (!email || !password) {
        showMessage('Preencha todos os campos', 'error');
        return;
      }

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        showMessage('Email ou senha incorretos', 'error');
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      showMessage('Login bem-sucedido! Redirecionando...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    }
  });

  // Exibe mensagem simples abaixo do formulário
  function showMessage(text, type = 'info') {
    let msg = document.getElementById('auth-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'auth-message';
      msg.style.marginTop = '12px';
      msg.style.fontWeight = '500';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = type === 'error' ? 'crimson' : 'green';

    // limpa após alguns segundos
    clearTimeout(msg._timeout);
    msg._timeout = setTimeout(() => {
      msg.textContent = '';
    }, 4000);
  }
});
