const registerPassword = document.getElementById('registerPassword');
const signUpBtn = document.getElementById('signUpBtn');
const passwordError = document.getElementById('passwordError');

registerPassword.addEventListener('input', function() {
  const passwordValue = registerPassword.value;

  if (passwordValue.length < 4) {
    passwordError.style.display = 'block';
    signUpBtn.disabled = true;
  } else {
    passwordError.style.display = 'none';
  }

  validateForm();
});

function validateForm() {
  if (passwordError.style.display === 'none') {
    signUpBtn.disabled = false;
  } else {
    signUpBtn.disabled = true;
  }
}
