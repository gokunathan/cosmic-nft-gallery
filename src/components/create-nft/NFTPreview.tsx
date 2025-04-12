
import React from 'react';
import { useCreateNFT } from '@/context/CreateNFTContext';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Heart, Eye, Clock } from 'lucide-react';

const NFTPreview = () => {
  const { formData } = useCreateNFT();
  
  // Find the primary asset to display (first image if available)
  const primaryAsset = formData.assetPreviews.find(preview => preview.fileType === 'image') || 
                        formData.assetPreviews[0];
  
  // Mock creator data (normally would come from context/auth)
  const creatorData = {
    name: 'YourUsername',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
  };
  
  const formatPrice = (price: number | undefined, currency: string): string => {
    if (!price) return '';
    return `${price.toFixed(2)} ${currency}`;
  };
  
  const getCollectionName = (): string => {
    if (formData.collectionType === 'existing') {
      // In a real app, you would look up the collection name by ID
      return 'Selected Collection';
    } else if (formData.collectionType === 'new' && formData.newCollection?.name) {
      return formData.newCollection.name;
    }
    return 'No Collection';
  };
  
  // Show a skeleton placeholder if no content is provided yet
  if (!primaryAsset || !formData.name) {
    return (
      <div className="rounded-lg overflow-hidden">
        <div className="aspect-square bg-dark-card animate-pulse"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-dark-card rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-dark-card rounded animate-pulse"></div>
          <div className="flex items-center gap-2 pt-2">
            <div className="w-6 h-6 rounded-full bg-dark-card animate-pulse"></div>
            <div className="h-3 w-20 bg-dark-card rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg overflow-hidden border border-white/10">
      {/* Image display */}
      <div className="relative aspect-square bg-black flex items-center justify-center">
        {primaryAsset.fileType === 'image' && (
          <img 
            src={primaryAsset.previewUrl} 
            alt={formData.name} 
            className="w-full h-full object-contain"
          />
        )}
        
        {primaryAsset.fileType === 'video' && (
          <video 
            src={primaryAsset.previewUrl} 
            className="w-full h-full object-contain"
            controls
          />
        )}
        
        {primaryAsset.fileType === 'audio' && (
          <div className="w-full h-full flex items-center justify-center flex-col p-4">
            <div className="w-full h-3/4 bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 flex items-center justify-center rounded-lg">
              <span className="text-white text-lg font-medium">{formData.name}</span>
            </div>
            <audio 
              src={primaryAsset.previewUrl} 
              controls
              className="w-full mt-4"
            />
          </div>
        )}
        
        {primaryAsset.fileType === '3d' && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-purple/20 to-neon-blue/20">
            <span className="text-white text-lg font-medium">3D Model Preview</span>
          </div>
        )}
        
        {/* Collection badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-dark/70 backdrop-blur-sm text-white border-none text-xs">
            {getCollectionName()}
          </Badge>
        </div>
        
        {/* Auction badge */}
        {formData.saleType === 'auction' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-neon-purple/80 text-white border-none text-xs">
              Auction
            </Badge>
          </div>
        )}
      </div>
      
      {/* NFT info */}
      <div className="p-4 bg-dark-card">
        <h3 className="font-bold text-lg mb-1 text-white truncate">{formData.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6 border border-neon-purple/30">
            <img src={creatorData.avatar} alt={creatorData.name} />
          </Avatar>
          <span className="text-sm text-gray-300 truncate">
            @{creatorData.name}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">
              {formData.saleType === 'fixed' ? 'Price' : 
               formData.saleType === 'auction' ? 'Starting Price' : 
               'Min. Offer'}
            </span>
            <span className="text-lg font-bold text-white">
              {formData.saleType === 'fixed' ? formatPrice(formData.price, formData.currency) : 
               formData.saleType === 'auction' ? formatPrice(formData.auctionDetails?.startingPrice, formData.currency) : 
               formatPrice(formData.minimumOffer, formData.currency) || 'Open to offers'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">0</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm">0</span>
            </div>
          </div>
        </div>
        
        {formData.scheduledListing && formData.startDate && (
          <div className="mt-3 flex items-center text-neon-yellow">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              {new Date() < formData.startDate ? 
                `Scheduled for ${formData.startDate.toLocaleDateString()}` : 
                'Available now'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTPreview;
