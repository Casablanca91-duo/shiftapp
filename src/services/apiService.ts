import axios from 'axios';

class ApiService {
  private baseUrl = 'https://api.example.com'; // Замени на реальный URL API

  async getShiftsByLocation(latitude: number, longitude: number) {
    try {
      // Пример запроса - замени на реальный endpoint
      const response = await axios.post('https://api.example.com/shifts', {
        latitude,
        longitude
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default new ApiService();