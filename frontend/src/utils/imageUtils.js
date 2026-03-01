/**
 * Constructs full URL for images from relative backend paths
 * @param {string} imagePath - The image path (can be relative like '/uploads/file.jpg' or full URL)
 * @returns {string} - Full URL to the image
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('getFullImageUrl: imagePath is empty');
    return null;
  }
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('getFullImageUrl: Already full URL:', imagePath);
    return imagePath;
  }
  
  // If it's a relative path from backend, construct full URL
  if (imagePath.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiBase.replace('/api', ''); // Remove /api suffix
    const fullUrl = baseUrl + imagePath;
    console.log('getFullImageUrl: Constructed full URL:', fullUrl);
    return fullUrl;
  }
  
  // If it's a data URL (from FileReader), return as-is
  if (imagePath.startsWith('data:')) {
    console.log('getFullImageUrl: Data URL');
    return imagePath;
  }
  
  console.log('getFullImageUrl: Returning as-is:', imagePath);
  return imagePath;
};
