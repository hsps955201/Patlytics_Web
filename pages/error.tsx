import React from 'react';
import { useRouter } from 'next/router';

const ErrorPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Something Went Wrong</h1>
      <p>We encountered an error while processing your request.</p>
      <button onClick={handleGoHome} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage; 