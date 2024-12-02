import { url } from "./config.js";


window.onload = function() {
    const token = localStorage.getItem('token');
  if (token) {
      window.location.href = './index.html';
    }
};

async function changePass() {
 console.log('PATCH request received');
 const token = localStorage.getItem('token');
 const email = localStorage.getItem('email');
 const oldPassword = document.getElementById('oldPassword').value;
 const newPassword = document.getElementById('newPassword').value;

 if (!email || !oldPassword || !newPassword) {
     alert("All fields are required!");
     return;
 }

 try {
     const response = await fetch(url + '/change-password', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`, 
         },
         body: JSON.stringify({
             email: email,
             oldPassword: oldPassword,
             newPassword: newPassword
         })
     });


     if (response.ok) {
         const result = await response.json();
         alert(result.message);
     } else {
         const errorText = await response.text();
         alert(`Error: ${errorText || response.statusText}`);
     }
 } catch (error) {
     console.error('Error:', error);
     alert('An error occurred while changing the password.');
 }
}


