import { url } from "./config.js";

window.onload = function() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = './index.html';
  }

  const registerForm = document.getElementById('registerForm');
  const signUpBtn = document.getElementById('signUpBtn');
  
  document.getElementById('registerEmail').addEventListener('input', toggleSignUpButton);
  document.getElementById('registerPassword').addEventListener('input', toggleSignUpButton);


  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    await register();
  });
};

function toggleSignUpButton() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const signUpBtn = document.getElementById('signUpBtn');
  

  if (email && password.length >= 6) {
    signUpBtn.disabled = false;
  } else {
    signUpBtn.disabled = true;
  }
}


async function register() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;


  try {
    const response = await fetch(url + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) { 
      const errorData = await response.json();
      throw new Error(`Registration failed: ${errorData.error}`);
    }

    const json = await response.json();
    localStorage.setItem('token', json.token);
    localStorage.setItem('email', email);
    window.location.href = './index.html';
  } catch (error) {
    console.error(error.message);
    alert(error.message); 
  } 
} 