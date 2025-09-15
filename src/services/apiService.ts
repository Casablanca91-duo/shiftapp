import axios from 'axios';
import { mockShifts } from '../utils/mockData';
import { Shift } from '../types';

class ApiService {
  // В продакшене заменить на реальный URL
  private baseUrl = 'https://api.example.com';

  async getShiftsByLocation(latitude: number, longitude: number): Promise<{ data: Shift[], status: number }> {
    try {
      // Для демонстрации используем mock данные
      // В реальном приложении будет реальный API запрос
      console.log('Запрос смен по координатам:', { latitude, longitude });
      
      // Имитация задержки сети
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      // Возвращаем mock данные
      return {
        data: mockShifts,
        status: 200
      };
      
      // Реальный запрос (раскомментировать в продакшене):
      /*
      const response = await axios.post(`${this.baseUrl}/shifts`, {
        latitude,
        longitude
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default new ApiService();