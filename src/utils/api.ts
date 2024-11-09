import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001';

let cachedCompanyNames: string[] | null = null;

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error; // Rethrow the error if needed
  }
};

export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await axios.post(`${API_URL}/api/auth/refresh`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const checkPatentInfringement = async (patentId: string, companyName: string, uid: number | null) => {
  try {
    const response = await axios.post(`${API_URL}/api/patent/infringements`, {
      patent_id: patentId,
      company_name: companyName,
      uid: uid,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('<h1>An error occurred</h1><p>Please try again later.</p>');
  }
};

export const fetchCompanySuggestions = async () => {
    if (cachedCompanyNames) {
        return { success: true, data: cachedCompanyNames };
    }

    try {
        const response = await fetch(`${API_URL}/api/patent/fuzzy_find_company`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        cachedCompanyNames = result.data; 
        return { success: true, data: cachedCompanyNames };
    } catch (error) {
        console.error('Error fetching company data:', error);
        return { success: false, data: [] };
    }
}; 