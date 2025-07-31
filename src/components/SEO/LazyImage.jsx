import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  placeholder = "/fallback.jpg",
  loading = "lazy",
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const observerRef = useRef();

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc === placeholder) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: "75%",
          }
        );
        observer.observe(imageRef);
      } else {
        // Fallback for older browsers
        setImageSrc(src);
      }
    }

    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setImageSrc(placeholder);
    setIsLoaded(false);
  };

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        transition: 'opacity 0.3s ease-in-out',
      }}
      {...props}
    />
  );
};

export default LazyImage; 