import { url } from "./config.js";

window.onload = function() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = './index.html';
  }

  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const loginPassword = document.getElementById('loginPassword');
  const passwordError = document.getElementById('passwordError');
  const passwordErrorMax = document.getElementById('passwordErrorMax');

  loginPassword.addEventListener('input', () => {
    if (loginPassword.value.length < 4) {
      passwordError.style.display = 'inline';
      loginBtn.disabled = true;
    } else if (loginPassword.value.length > 20) {
      passwordErrorMax.style.display = 'inline';
      loginBtn.disabled = true;
    } else {
      passwordError.style.display = 'none';
      passwordErrorMax.style.display = 'none';
      loginBtn.disabled = false;
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (loginPassword.value.length < 4 || loginPassword.value.length > 20) return;

    await login();
  });
};

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const fetchUrl = url + "/login";

  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Login failed: ${errorData.error}`);
    }

    const json = await response.json(); 
    localStorage.setItem('token', json.accessToken);
    localStorage.setItem('email', email);
    window.location.href = './index.html';
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}
