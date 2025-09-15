import axios from 'axios';

class ApiService {
  async getShiftsByLocation(latitude: number, longitude: number) {
    try {
      // Используем реальный endpoint из задания
      const response = await axios.post('https://api.example.com/shifts', {
        latitude,
        longitude
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default new ApiService();