// Image optimization utilities for better performance and SEO

export const imageOptimizer = {
  // Generate responsive image URLs
  getResponsiveImageUrl: (originalUrl, width, quality = 80) => {
    if (!originalUrl) return '';
    
    // For external images (like Unsplash), we can use their optimization parameters
    if (originalUrl.includes('unsplash.com')) {
      return `${originalUrl}?w=${width}&q=${quality}&fit=crop&crop=center`;
    }
    
    // For local images, return the original URL
    // In production, you might want to use a CDN or image optimization service
    return originalUrl;
  },

  // Generate srcset for responsive images
  generateSrcSet: (originalUrl, sizes = [320, 640, 960, 1280, 1920]) => {
    if (!originalUrl) return '';
    
    return sizes
      .map(size => `${imageOptimizer.getResponsiveImageUrl(originalUrl, size)} ${size}w`)
      .join(', ');
  },

  // Get appropriate image sizes for different contexts
  getImageSizes: (context = 'default') => {
    const sizes = {
      hero: [320, 640, 960, 1280, 1920],
      thumbnail: [150, 300, 450],
      gallery: [320, 640, 960, 1280],
      room: [320, 640, 960, 1280],
      default: [320, 640, 960]
    };
    
    return sizes[context] || sizes.default;
  },

  // Lazy loading configuration
  getLazyLoadingConfig: (priority = false) => {
    return {
      loading: priority ? 'eager' : 'lazy',
      decoding: 'async',
      importance: priority ? 'high' : 'auto'
    };
  },

  // Generate alt text suggestions
  generateAltText: (imageName, context = '') => {
    const baseAlt = imageName
      .replace(/[-_]/g, ' ')
      .replace(/\.[^/.]+$/, '') // Remove file extension
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return context ? `${baseAlt} - ${context}` : baseAlt;
  },

  // WebP support detection
  supportsWebP: () => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  // Get optimized image format
  getOptimizedFormat: async (originalUrl) => {
    const supportsWebP = await imageOptimizer.supportsWebP();
    
    if (supportsWebP && originalUrl.includes('unsplash.com')) {
      return originalUrl + '&fm=webp';
    }
    
    return originalUrl;
  }
};

// Preload critical images
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Intersection Observer for lazy loading
export const createImageObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Image compression suggestions
export const getCompressionSuggestions = (fileSize, dimensions) => {
  const suggestions = [];
  
  if (fileSize > 500 * 1024) { // 500KB
    suggestions.push('Consider compressing this image to reduce file size');
  }
  
  if (dimensions.width > 1920 || dimensions.height > 1080) {
    suggestions.push('Consider resizing this image for web use');
  }
  
  return suggestions;
}; 