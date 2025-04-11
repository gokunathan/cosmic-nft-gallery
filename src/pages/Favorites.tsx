
import { useState, useMemo } from 'react';
import { useNFTContext } from '@/context/NFTContext';
import { useQuery } from '@tanstack/react-query';
import { nfts as allNfts } from '@/services/nftService';
import NFTCard from '@/components/NFTCard';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { likedNFTs } = useNFTContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get all liked NFTs
  const favoriteNFTs = useMemo(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Filter NFTs that are in the liked list
    return allNfts.filter(nft => likedNFTs[nft.id]);
  }, [likedNFTs]);

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <div className="container mx-auto pt-24 px-4 pb-16">
        <h1 className="text-4xl font-bold mb-8">Your Favorites</h1>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
          </div>
        ) : favoriteNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteNFTs.map(nft => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-bold mb-2">No Favorites Yet</h3>
            <p className="text-gray-400 mb-6">Start adding NFTs to your favorites by clicking the heart icon.</p>
            <Button asChild>
              <Link to="/explore">Explore NFTs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
