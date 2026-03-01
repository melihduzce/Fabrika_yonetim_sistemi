/**
 * Tema (dark/light) için ortak sınıf isimleri
 */

export const getThemeClasses = (isDark) => ({
  bgMain: isDark ? 'bg-gray-900' : 'bg-gray-100',
  bgCard: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
  textTitle: isDark ? 'text-white' : 'text-gray-800',
  textSub: isDark ? 'text-gray-400' : 'text-gray-500',
  borderCol: isDark ? 'border-gray-700' : 'border-gray-200',
});
