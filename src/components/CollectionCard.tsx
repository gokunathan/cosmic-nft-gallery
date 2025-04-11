
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

interface CollectionProps {
  id: string;
  name: string;
  bannerImage?: string; // Changed from required to optional
  verified: boolean;
  floorPrice: number;
  itemCount: number;
  volumeTraded: number;
  creator?: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
}

export default function CollectionCard({
  name,
  bannerImage = "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3", // Added default value
  verified,
  floorPrice,
  itemCount,
  volumeTraded,
  creator
}: CollectionProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl card-glass">
      {/* Banner Image */}
      <div className="aspect-video w-full relative">
        <img
          src={bannerImage}
          alt={`${name} collection`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-60"></div>
      </div>
      
      {/* Collection Info */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          {verified && (
            <svg className="w-4 h-4 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          )}
        </div>
        
        {creator && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-5 h-5">
              <img src={creator.avatar} alt={creator.name} />
            </Avatar>
            <span className="text-xs text-gray-300">@{creator.name}</span>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-dark/60 backdrop-blur-sm rounded-md p-2">
            <p className="text-xs text-gray-400">Floor</p>
            <p className="text-sm font-medium">{floorPrice} ETH</p>
          </div>
          
          <div className="bg-dark/60 backdrop-blur-sm rounded-md p-2">
            <p className="text-xs text-gray-400">Volume</p>
            <p className="text-sm font-medium">{volumeTraded} ETH</p>
          </div>
          
          <div className="bg-dark/60 backdrop-blur-sm rounded-md p-2">
            <p className="text-xs text-gray-400">Items</p>
            <p className="text-sm font-medium">{itemCount}</p>
          </div>
        </div>
      </div>
      
      {/* Hover State Badge */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Badge className="bg-neon-purple text-white border-none">View Collection</Badge>
      </div>
    </div>
  );
}
