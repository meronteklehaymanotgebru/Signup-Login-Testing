async function signup(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Sign up successful!');
    window.location.href = 'login.html';
  } else {
    alert(data.message);
  }
}
module.exports={signup};