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
  console.log('[submitScore] Sending score data:', scoreData);

  try {
    const response = await axios.post(`${API_BASE_URL}/scores`, scoreData);
    console.log('[submitScore] Backend response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[submitScore] Error submitting score:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_BASE_URL}/scores`
    });

    return error.response?.data || { message: 'Error submitting score' };
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
