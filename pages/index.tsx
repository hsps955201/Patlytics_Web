import React, { useEffect, useState } from 'react';
import PatentChecker from '../src/components/PatentChecker';
import { getCurrentUser } from '../src/utils/api'; 
import { useRouter } from 'next/router';


interface Product {
    product_name: string; 
    infringement_likelihood: string; 
    explanation: string; 
    specific_features?: string[]; 
    claims_at_issue: string[];
}

const IndexPage: React.FC = () => {  
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; id: number; reports: any[] } | null>(null);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (token) {
        try {
          const response = await getCurrentUser(token) as { success: boolean; data: { user: { email: string; id: number; reports: any[] }; message?: string }; message?: string };
          console.log('Response:', response);
          if (response.success) {
            const userData = response.data.user;
            setUser(userData);
            console.log('reports:', userData.reports);
            setIsRegistered(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.error('Failed to fetch user data:', response.message || 'Unknown error');
            setError(response.message || 'Unknown error');
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error('Error fetching user data:', err.message);
            setError(err.message);
          } else {
            console.error('Unknown error occurred while fetching user data.');
            setError('Failed to fetch user data.');
          }
        }
      } 
    };

    fetchUser();
  }, []);


  const handleLogout = () => {
    setUser(null); 
    setIsRegistered(false); 
    localStorage.clear();
    console.log('User logged out'); 
    window.location.reload();
  };

  const downloadCSV = () => {
    if (!user || !user.reports || user.reports.length === 0) return; // Ensure user and reports exist and are not empty

    const csvRows = [];
    csvRows.push([
      'Patent Title',
      'Patent ID',
      'Company Name',
      'Overall Risk Assessment',
      'Product Name',
      'Infringement Likelihood',
      'Explanation',
      'Specific Features',
      'Claims at Issue'
    ].join(','));
    
    console.log('user.reports:', user.reports); // Log reports for debugging
    user.reports.forEach(report => {
      const analysisResults = report.analysis_results; // Access analysis_results
      const patentInfo = [
        `"${analysisResults.patent_title}"`,
        `"${analysisResults.patent_id}"`,
        `"${analysisResults.company_name}"`,
        `"${analysisResults.overall_risk_assessment}"`
      ];

      // Check if top_infringing_products exists and is an array
      if (Array.isArray(analysisResults.top_infringing_products) && analysisResults.top_infringing_products.length > 0) {
        analysisResults.top_infringing_products.forEach((product: Product) => { // Specify the type here
          const claimsAtIssue = product.claims_at_issue.length > 0 ? product.claims_at_issue.join('; ') : 'N/A'; // Handle empty claims
          const productData = [
            ...patentInfo, 
            `"${product.product_name}"`,
            `"${product.infringement_likelihood}"`,
            `"${product.explanation}"`,
            `"${Array.isArray(product.specific_features) ? product.specific_features.join('; ') : product.specific_features || 'N/A'}"`, // Handle specific_features
            `"${claimsAtIssue}"`
          ];
          csvRows.push(productData.join(','));
        });
      } else {
        console.warn('No top infringing products found for report:', report); // Log if no products found
      }
    });

    if (csvRows.length === 1) {
      console.warn('No data to download.'); // Log if no data rows were added
      return; // No data to download
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'patent_results.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <h1>Welcome to the Patent Checker</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isRegistered && !user && <button onClick={() => router.push('/register')}>Register</button>}
      {!user && <button onClick={() => router.push('/login')}>Login</button>}
      {user && (
        <>
          <p>Your email: {user.email}</p>
          <p>Your ID: {user.id}</p>
          <p>Your reports:</p>
          <ul>
            {user.reports.map((report, index) => (
              <li key={index}>
                Patent ID: {report.patent_id}, Company ID: {report.company_id}
              </li>
            ))}
          </ul>
          <button onClick={downloadCSV}>Download CSV</button>
          <button onClick={handleLogout}>Logout</button> 
        </>
      )}
      <PatentChecker />
    </>
  );
};

export default IndexPage;