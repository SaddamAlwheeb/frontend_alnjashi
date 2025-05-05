/**
 * Format a date string into a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // If less than a day, show relative time
  if (diff < 86400000) { // 24 hours in milliseconds
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `منذ ${minutes} دقيقة`;
    }
    return `منذ ${hours} ساعة`;
  }
  
  // If less than a week, show day
  if (diff < 604800000) { // 7 days in milliseconds
    const days = Math.floor(diff / 86400000);
    return `منذ ${days} يوم`;
  }
  
  // Otherwise, show full date
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ar-SA', options);
}