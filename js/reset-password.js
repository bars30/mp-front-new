window.onload = function() {
    const token = localStorage.getItem('token');
  if (token) {
      window.location.href = './index.html';
    }
};

import { url } from "./config.js";

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email'); 

document.getElementById('resetPassForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;

    if (!code || !newPassword) {
        alert('Please fill in all fields.');
        return; 
    }

    try {
        const response = await fetch(url + '/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code, newPassword }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.error}`);
        }

        const result = await response.json();
        window.location.href = './index.html'; 
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
});
