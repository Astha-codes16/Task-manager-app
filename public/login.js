window.addEventListener('DOMContentLoaded',()=>{
  const reg=localStorage.getItem('registered_user');
  if(reg)
{
document.getElementById('username').value=reg;
localStorage.removeItem('registered_user');
}
})
const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('https://astha-task-manager-app.onrender.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = 'https://astha-task-manager-app.onrender.com/index1.html';
 // Redirect to task planner
  } else {
    document.getElementById('message').textContent = data.error;
  }
});
