import React, { useState, useEffect } from 'react';
import { checkPatentInfringement, fetchCompanySuggestions, getCurrentUser } from '../utils/api';
import { useRouter } from 'next/router';

interface PatentData {
  patent_title: string;
  patent_id: string;
  company_name: string;
  overall_risk_assessment: string;
  top_infringing_products: {
    product_name: string;
    infringement_likelihood: string;
    explanation: string;
    specific_features: string;
    claims_at_issue: string[];
  }[];
}

const PatentChecker: React.FC = () => {
  const [patentId, setPatentId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [result, setResult] = useState<PatentData | null>(null);
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleCheckPatent = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setResult(null); // Clear previous results
    setIsChecked(false); // Reset check status
    try {
      console.log(patentId, companyName);
      const user = localStorage.getItem('user');
      const uid = user ? JSON.parse(user).id : null;
      const data = await checkPatentInfringement(patentId, companyName, uid);
      console.log(data);
      
      if (data) {
        const patentData = data as PatentData;
        setResult(patentData); // Store the result in state
        setIsChecked(true); // Set check status to true after successful check
        // add call me again to update current data
        const token = localStorage.getItem('token');
        if (token) {
          const currentUserResponse = await getCurrentUser(token) as { data: { user: { email: string; id: number; reports: Array<any> } }; success: boolean };
          if (currentUserResponse.success) {
            const currentUserData = currentUserResponse.data.user;
            localStorage.setItem('currentUserData', JSON.stringify(currentUserData));
            console.log('currentUser:', currentUserData.reports);
          }
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCompanySuggestions();
      if (result.success) {
        setCompanyNames(result.data || []);
      }
    };
    fetchData();
  }, []);

  const handleCompanyNameChange = (value: string) => {
    if (value) {
      const suggestions = companyNames.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const downloadCSV = () => {
    if (!result) return;

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

    const patentInfo = [
      `"${result.patent_title}"`,
      `"${result.patent_id}"`,
      `"${result.company_name}"`,
      `"${result.overall_risk_assessment}"`
    ];

    result.top_infringing_products.forEach(product => {
      const claimsAtIssue = product.claims_at_issue.join('; ');
      const productData = [
        ...patentInfo, 
        `"${product.product_name}"`,
        `"${product.infringement_likelihood}"`,
        `"${product.explanation}"`,
        `"${product.specific_features}"`,
        `"${claimsAtIssue}"`
      ];
      csvRows.push(productData.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'patent_results.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center' }}>Patent Checker</h2>
        <form style={{ width: '100%' }} onSubmit={handleCheckPatent}>
          <input
            type="text"
            placeholder="Input a patent ID (1-100, positive integer)"
            value={patentId}
            onChange={(e) => setPatentId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Input a company name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              handleCompanyNameChange(e.target.value);
            }}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          {filteredSuggestions.length > 0 && (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {filteredSuggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  onClick={() => {
                    setCompanyName(suggestion);
                    setFilteredSuggestions([]);
                  }}
                  style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '5px' }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <button type="submit" style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>Check Patent</button>
          {isChecked && (
            <button type="button" onClick={handleReload} style={{ width: '100%', padding: '8px' }}>
              Reload
            </button>
          )}
        </form>
        {result && (
          <button onClick={downloadCSV} style={{ width: '100%', padding: '8px', marginTop: '10px' }}>
            Download Results as CSV
          </button>
        )}
      </div>
      {result && (
        <div>
          <h3>Patent Title: {result.patent_title}</h3>
          <p>Patent ID: {result.patent_id}</p>
          <p>Company Name: {result.company_name}</p>
          <p>Overall Risk Assessment: {result.overall_risk_assessment}</p>
          {result && result.top_infringing_products && result.top_infringing_products.length > 0 && (
            <div>
              <h4>Top Infringing Products:</h4>
              <ul>
                {result.top_infringing_products.map((product, index) => (
                  <li key={index}>
                    <strong>Product Name:</strong> {product.product_name}<br />
                    <strong>Infringement Likelihood:</strong> {product.infringement_likelihood}<br />
                    <strong>Explanation:</strong> {product.explanation}<br />
                    <strong>Specific Features:</strong> {product.specific_features}<br />
                    {product.claims_at_issue.length > 0 && (
                      <div>
                        <strong>Claims at Issue:</strong>
                        <ul>
                          {product.claims_at_issue.map((claim: string, claimIndex: number) => (
                            <li key={claimIndex}>{claim}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isChecked && (
            <button type="button" onClick={handleReload} style={{ width: '100%', padding: '8px' }}>
              Reload
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PatentChecker; 