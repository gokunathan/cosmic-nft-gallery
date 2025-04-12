
import React, { useState } from 'react';

interface NFTImageProps {
  src: string;
  alt: string;
  className?: string;
  collectionName?: string;
}

const NFTImage: React.FC<NFTImageProps> = ({ src, alt, className = '', collectionName }) => {
  const [hasError, setHasError] = useState(false);
  
  // Get appropriate fallback based on collection
  const getFallbackImage = () => {
    switch(collectionName) {
      case 'Voxel Mech':
        return 'https://images.unsplash.com/photo-1635623129740-e2ead466089a';
      case 'Digital Fauna':
        return 'https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1';
      default:
        return 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?q=80&w=300';
    }
  };
  
  // Handle image load errors
  const handleError = () => {
    setHasError(true);
  };
  
  return (
    <div className="relative overflow-hidden">
      <img 
        src={hasError ? getFallbackImage() : src}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
      {hasError && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-sm font-medium bg-black/70 px-2 py-1 rounded">Preview Unavailable</span>
        </div>
      )}
    </div>
  );
};

export default NFTImage;
