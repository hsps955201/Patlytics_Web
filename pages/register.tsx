import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../src/utils/api';


// Define the expected type for the result
interface RegisterResult {
  message: string;
  success: boolean;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: {
    email: string;
    id: number;
  };
}

const RegisterPage: React.FC = () => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await registerUser(email, password) as RegisterResult;
      localStorage.clear();
      localStorage.setItem('token', result.tokens.access_token);
      setSuccess(result.message);
      router.push('/');
    } catch (err) {
      setError('Registration failed, please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '8px' }}>Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default RegisterPage; 