// import axios from 'axios';

const apiUrl = 'http://localhost:3000/api'; 

export const registerUser = async (username, password ) => {
  try {
    console.log('Requesting registration...');
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    console.log('Requesting registration...');
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};





// const apiUrl = process.env.API_URL; 

// export const registerUser = async (username, password) => {
//   try {
//     const response = await axios.post(`${apiUrl}/register`, { username, password });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginUser = async (username, password) => {
//   try {
//     const response = await axios.post(`${apiUrl}/login`, { username, password });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

