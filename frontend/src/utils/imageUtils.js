export const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Blob URLs from local preview
  if (imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // GridFS ID (MongoDB ObjectId is a 24-character hex string)
  // We check if it's a 24-char hex string and doesn't start with / (relative path)
  const isGridFsId = /^[0-9a-fA-F]{24}$/.test(imagePath);
  
  if (isGridFsId) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${apiBase}/files/${imagePath}`;
  }
  
  // If it's a relative path from backend (legacy), construct full URL
  if (imagePath.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiBase.replace('/api', ''); // Remove /api suffix
    return baseUrl + imagePath;
  }
  
  // Data URLs
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  return imagePath;
};

