import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getUsers = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleRegister = () => {
    const users = getUsers();
    if (users.find((user) => user.username === username)) {
      setError('Username already exists');
      return;
    }
    users.push({ username, password });
    saveUsers(users);
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('currentUser', username);
    navigate('/');
    window.location.reload();
  };

  const handleLogin = () => {
    const users = getUsers();
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('currentUser', username);
      navigate('/');
      window.location.reload();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">{isRegister ? 'Register' : 'Login'}</h2>
        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setError('');
              setIsRegister(!isRegister);
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
