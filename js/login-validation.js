const loginEmail = document.getElementById('loginEmail');

loginEmail.addEventListener('input', function() {
 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailPattern.test(loginEmail.value)) {
  loginEmail.setCustomValidity("Please enter a valid email address.");
  loginEmail.reportValidity();
  loginBtn.disabled = true;
  } else {
  loginEmail.setCustomValidity("");
  loginBtn.disabled = false;
  }
});
 
const loginPassword = document.getElementById('loginPassword');
const passwordError = document.getElementById('passwordError');
const passwordErrorMax = document.getElementById('passwordErrorMax');
const loginBtn = document.getElementById('loginBtn');

loginPassword.addEventListener('input', function() {
 const passwordValue = loginPassword.value;

 if (passwordValue.length < 4  ) {
  passwordError.style.display = 'block'; 
  loginBtn.disabled = true;
 } else {
  passwordError.style.display = 'none'; 
  loginBtn.disabled = false;
 }

 if (passwordValue.length > 20 ) {
  passwordErrorMax.style.display = 'block'; 
  loginBtn.disabled = false;
 } else {
  passwordErrorMax.style.display = 'none'; 
  loginBtn.disabled = false;
 }

});




