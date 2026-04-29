import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const submitScore = async (scoreData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scores`, scoreData);
    return response.data;
  } catch (error) {
    console.error('Error submitting score:', error);
    return { message: 'Error submitting score' };
  }
};

export const fetchResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};
