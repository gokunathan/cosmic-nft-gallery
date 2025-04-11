
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NFT } from '@/services/nftService';
import { toast } from 'sonner';

interface NFTContextType {
  likedNFTs: Record<string, boolean>;
  toggleLikeNFT: (nftId: string) => void;
  cart: NFT[];
  addToCart: (nft: NFT) => void;
  removeFromCart: (nftId: string) => void;
  isInCart: (nftId: string) => boolean;
  clearCart: () => void;
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedNFTs, setLikedNFTs] = useState<Record<string, boolean>>({});
  const [cart, setCart] = useState<NFT[]>([]);

  // Load liked NFTs from localStorage
  useEffect(() => {
    const savedLikedNFTs = localStorage.getItem('likedNFTs');
    if (savedLikedNFTs) {
      setLikedNFTs(JSON.parse(savedLikedNFTs));
    }
    
    const savedCart = localStorage.getItem('nftCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save liked NFTs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('likedNFTs', JSON.stringify(likedNFTs));
  }, [likedNFTs]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nftCart', JSON.stringify(cart));
  }, [cart]);

  const toggleLikeNFT = (nftId: string) => {
    setLikedNFTs(prev => {
      const newState = { ...prev, [nftId]: !prev[nftId] };
      
      // Show feedback toast
      if (newState[nftId]) {
        toast('Added to favorites', {
          description: 'NFT has been added to your favorites'
        });
      } else {
        toast('Removed from favorites', {
          description: 'NFT has been removed from your favorites'
        });
      }
      
      return newState;
    });
  };
  
  const addToCart = (nft: NFT) => {
    if (cart.some(item => item.id === nft.id)) {
      toast('Already in cart', {
        description: 'This NFT is already in your cart'
      });
      return;
    }
    
    setCart(prev => [...prev, nft]);
    toast('Added to cart', {
      description: `${nft.name} has been added to your cart`
    });
  };
  
  const removeFromCart = (nftId: string) => {
    setCart(prev => prev.filter(nft => nft.id !== nftId));
    toast('Removed from cart', {
      description: 'NFT has been removed from your cart'
    });
  };
  
  const isInCart = (nftId: string) => {
    return cart.some(nft => nft.id === nftId);
  };
  
  const clearCart = () => {
    setCart([]);
    toast('Cart cleared', {
      description: 'All items have been removed from your cart'
    });
  };

  return (
    <NFTContext.Provider value={{ 
      likedNFTs, 
      toggleLikeNFT, 
      cart, 
      addToCart, 
      removeFromCart, 
      isInCart,
      clearCart
    }}>
      {children}
    </NFTContext.Provider>
  );
};

export const useNFTContext = () => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFTContext must be used within a NFTProvider');
  }
  return context;
};
