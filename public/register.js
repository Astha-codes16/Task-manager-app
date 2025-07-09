
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  const res = await fetch('https://astha-task-manager-app.onrender.com/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
 

    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
     alert("Username Already Exist!");
    }
  const data = await res.json();
  
  const message = document.getElementById('message');

  if (res.ok) {
    localStorage.setItem('registered_user',username);
    message.style.color = 'green';
    message.textContent = 'Registration successful! Redirecting to login...';

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      window.location.href = 'https://astha-task-manager-app.onrender.com/login.html';

    }, 2000);
  } else {
    message.style.color = 'red';
    message.textContent = data.error || 'Registration failed';
  }
});
