/**@jest-environment jsdom
*/

const { login } = require('./login.js');

global.fetch = jest.fn();
global.alert = jest.fn();

Object.defineProperty(window, 'localStorage', {
 value: {
   setItem: jest.fn()
 },
 writable: true
});

beforeEach(() => {
 document.body.innerHTML = `
   <form>
     <input type="email" id="email">
     <input type="password" id="password">
     <button type="submit">Login</button>
   </form>
 `;
});

test('successful login', async () => {
 document.getElementById('email').value = 'test@example.com';
 document.getElementById('password').value = 'password';

 fetch.mockResolvedValueOnce({
   ok: true,
   json: async () => ({ token: '123abc' })
 });

 Object.defineProperty(window, 'location', {
   writable: true,
   value: { href: '' }
 });

 const e = { preventDefault: jest.fn() };
 await login(e);

 expect(fetch).toHaveBeenCalledWith('/api/login', expect.any(Object));
 expect(window.localStorage.setItem).toHaveBeenCalledWith('token', '123abc');
});

test('failed login shows alert', async () => {
 document.getElementById('email').value = 'fail@example.com';
 document.getElementById('password').value = 'wrong';

 fetch.mockResolvedValueOnce({
   ok: false,
   json: async () => ({ message: 'Invalid credentials' })
 });

 const e = { preventDefault: jest.fn() };
 await login(e);

 expect(alert).toHaveBeenCalledWith('Invalid credentials');
});