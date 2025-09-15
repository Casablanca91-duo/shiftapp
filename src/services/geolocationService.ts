import Geolocation, { GeoError } from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

// Константы кодов ошибок
const PERMISSION_DENIED = 1;
const POSITION_UNAVAILABLE = 2;
const TIMEOUT = 3;

class GeolocationService {
  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Доступ к геолокации',
            message: 'Приложению нужен доступ к геолокации для поиска смен поблизости',
            buttonNeutral: 'Спросить позже',
            buttonNegative: 'Отмена',
            buttonPositive: 'Разрешить',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    } else if (Platform.OS === 'ios') {
      // Для iOS разрешения запрашиваются автоматически
      return true;
    }
    return false;
  }

  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Геолокация получена:', position);
          resolve(position);
        },
        (error: GeoError) => {
          console.error('Геолокация ошибка:', error);
          switch (error.code) {
            case PERMISSION_DENIED:
              reject(new Error('Пользователь отклонил запрос на геолокацию'));
              break;
            case POSITION_UNAVAILABLE:
              reject(new Error('Информация о местоположении недоступна'));
              break;
            case TIMEOUT:
              reject(new Error('Время запроса геолокации истекло'));
              break;
            default:
              reject(new Error('Произошла неизвестная ошибка'));
              break;
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000
        }
      );
    });
  }

  // Метод для наблюдения за изменением местоположения
  watchPosition(callback: (position: any) => void): number {
    return Geolocation.watchPosition(
      callback,
      (error) => {
        console.error('Watch position error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000
      }
    );
  }

  // Остановка наблюдения
  clearWatch(watchId: number) {
    Geolocation.clearWatch(watchId);
  }
}

export default new GeolocationService();