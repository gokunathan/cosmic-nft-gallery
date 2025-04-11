
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NFT } from '@/services/nftService';
import { Heart, Eye, Clock, ShoppingCart } from 'lucide-react';
import { useNFTContext } from '@/context/NFTContext';
import { Link } from 'react-router-dom';

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const { likedNFTs, toggleLikeNFT, addToCart, isInCart } = useNFTContext();
  const isLiked = likedNFTs[nft.id] || false;

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getRemainingTime = (endTime: string): string => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const distance = end - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Ending soon';
    }
  };

  return (
    <Card className="overflow-hidden card-glass group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-purple">
      <div className="relative">
        <Link to={`/nft/${nft.id}`}>
          <div className="relative overflow-hidden aspect-square">
            <img 
              src={nft.previewImage} 
              alt={nft.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Collection badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-dark/70 backdrop-blur-sm text-white border-none text-xs">
                {nft.collection.name}
              </Badge>
            </div>
            
            {/* Auction badge */}
            {nft.auction && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-neon-purple/80 text-white border-none text-xs">
                  Auction
                </Badge>
              </div>
            )}
          </div>
        </Link>
        
        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeNFT(nft.id);
            }}
            className="w-9 h-9 rounded-full bg-dark-card/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-neon-pink text-neon-pink' : 'text-white'}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(nft);
            }}
            disabled={isInCart(nft.id)}
            className={`w-9 h-9 rounded-full bg-dark-card/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 ${isInCart(nft.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/nft/${nft.id}`} className="block">
          <h3 className="font-bold text-lg mb-1 text-white truncate">{nft.name}</h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6 border border-neon-purple/30">
            <img src={nft.creator.avatar} alt={nft.creator.name} />
          </Avatar>
          <span className="text-sm text-gray-300 truncate">
            @{nft.creator.name}
          </span>
          {nft.creator.verified && (
            <svg className="w-4 h-4 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Current Price</span>
            <span className="text-lg font-bold text-white">{formatPrice(nft.price)} {nft.currency}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{nft.views}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-400">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-neon-pink text-neon-pink' : ''}`} />
              <span className="text-sm">{isLiked ? nft.likes + 1 : nft.likes}</span>
            </div>
          </div>
        </div>
        
        {nft.auction && nft.endTime && (
          <div className="mt-3 flex items-center text-neon-yellow">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Ends in {getRemainingTime(nft.endTime)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
