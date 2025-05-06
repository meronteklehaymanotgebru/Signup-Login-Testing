/**
*@jest-environment jsdom
*/
const { signup } =require('./signup.js');
global.fetch = jest.fn();
global.alert = jest.fn();
beforeEach(() => {
  document.body.innerHTML = `
    <form>
      <input type="email" id="email">
      <input type="password" id="password">
      <button type="submit">Sign Up</button>
    </form>
  `;
});
test('successful signup shows alert and redirects', async () => {
  document.getElementById('email').value = 'test@example.com';
  document.getElementById('password').value = 'pass123';
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Success' })
  });
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' }
  });
  const e = { preventDefault: jest.fn() };
  await signup(e);
  expect(alert).toHaveBeenCalledWith('Sign up successful!');
  expect(window.location.href).toBe('login.html');
});
test('failed signup shows alert with error', async () => {
  document.getElementById('email').value = 'fail@example.com';
  document.getElementById('password').value = '123';
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: 'User already exists' })
  });
  const e = { preventDefault: jest.fn() };
  await signup(e);
  expect(alert).toHaveBeenCalledWith('User already exists');
});