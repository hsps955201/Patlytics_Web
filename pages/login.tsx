import React, { useState } from 'react';
import { getCurrentUser, loginUser } from '../src/utils/api';
import router, { useRouter } from 'next/router';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();


  const handleLogin = async (): Promise<void> => {
    try {
      const result = await loginUser(email, password) as { data: { access_token: string } };
      localStorage.setItem('token', result.data.access_token);
      setSuccess('Login successful!');
      router.push('/');
    } catch (error) {
        console.log('error:', error);
        router.push('/');
        setTimeout(() => {
        window.location.reload();
        }, 500);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>   
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />            
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default LoginPage; 