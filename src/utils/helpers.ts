// Функция для форматирования рейтинга
export const formatRating = (rating: number | null): string => {
  if (rating === null) return 'Нет рейтинга';
  return rating.toFixed(1);
};

// Функция для определения цвета прогресса
export const getProgressColor = (current: number, plan: number): string => {
  const progress = current / plan;
  if (progress >= 1) return '#ff3b30'; // Красный - набрано
  if (progress >= 0.8) return '#ff9500'; // Оранжевый - почти набрано
  return '#007AFF'; // Синий - нормально
};

// Функция для форматирования даты
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString.split('.').reverse().join('-'));
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

// Функция для проверки, завершена ли смена
export const isShiftFull = (current: number, plan: number): boolean => {
  return current >= plan;
};