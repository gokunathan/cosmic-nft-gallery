
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNFTDetails } from '@/services/nftService';
import { useNFTContext } from '@/context/NFTContext';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Eye, 
  Share2, 
  Clock, 
  ShoppingCart, 
  ArrowRight, 
  ArrowLeft,
  Info,
  BarChart3,
  History,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

export default function NFTDetail() {
  const { id } = useParams<{ id: string }>();
  const { likedNFTs, toggleLikeNFT, addToCart, isInCart } = useNFTContext();
  const [tabValue, setTabValue] = useState('properties');
  
  // Fetch NFT details
  const { data: nft, isLoading, error } = useQuery({
    queryKey: ['nft', id],
    queryFn: () => getNFTDetails(id || ''),
    enabled: !!id
  });
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get remaining time for auctions
  const getRemainingTime = (endTime: string): string => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const distance = end - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} days ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    } else if (minutes > 0) {
      return `${minutes} minutes`;
    } else {
      return 'Ending soon';
    }
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: nft?.name || 'NFT Details',
        text: nft?.description || 'Check out this NFT!',
        url: window.location.href
      })
      .then(() => toast('Shared successfully!'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast('Link copied to clipboard!'))
        .catch((error) => console.error('Error copying to clipboard:', error));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <Header />
        <div className="container mx-auto pt-24 px-4 pb-16 flex justify-center items-center h-[80vh]">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 aspect-square bg-dark-lighter rounded-2xl"></div>
              <div className="md:w-1/2 space-y-4">
                <div className="h-8 bg-dark-lighter rounded-md w-3/4"></div>
                <div className="h-4 bg-dark-lighter rounded-md w-1/2"></div>
                <div className="h-20 bg-dark-lighter rounded-md w-full"></div>
                <div className="h-12 bg-dark-lighter rounded-md w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !nft) {
    return (
      <div className="min-h-screen bg-dark text-white">
        <Header />
        <div className="container mx-auto pt-24 px-4 pb-16 flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">NFT Not Found</h2>
            <p className="text-gray-400 mb-8">The NFT you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/explore">Back to Explore</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const isLiked = likedNFTs[nft.id] || false;

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <div className="container mx-auto pt-24 px-4 pb-16">
        {/* Navigation */}
        <div className="flex items-center space-x-2 mb-8 text-sm">
          <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
          <span className="text-gray-600">/</span>
          <Link to="/explore" className="text-gray-400 hover:text-white">Explore</Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-200">{nft.name}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column - NFT Image */}
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={nft.image} 
                alt={nft.name} 
                className="w-full h-auto object-cover aspect-square rounded-2xl"
              />
              
              {/* Collection Badge */}
              <Link to={`/collection/${nft.collection.id}`}>
                <Badge className="absolute top-4 left-4 bg-dark/70 backdrop-blur-sm text-white border-none hover:bg-dark/90">
                  {nft.collection.name}
                </Badge>
              </Link>
              
              {/* Auction Badge */}
              {nft.auction && (
                <Badge className="absolute top-4 right-4 bg-neon-purple text-white border-none">
                  On Auction
                </Badge>
              )}
            </div>
            
            {/* Share and like buttons */}
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                className="border-white/10 hover:bg-white/5"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              <Button
                variant={isLiked ? "default" : "outline"}
                className={isLiked ? "bg-neon-pink/20 text-neon-pink border-neon-pink hover:bg-neon-pink/30" : "border-white/10 hover:bg-white/5"}
                onClick={() => toggleLikeNFT(nft.id)}
              >
                <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-neon-pink' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
            </div>
          </div>
          
          {/* Right column - NFT Details */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
            
            {/* Creator info */}
            <div className="flex items-center mt-4 mb-6">
              <Avatar className="h-10 w-10 mr-3 border border-neon-purple/20">
                <img src={nft.creator.avatar} alt={nft.creator.name} />
              </Avatar>
              <div>
                <p className="text-sm text-gray-400">Created by</p>
                <div className="flex items-center">
                  <Link to={`/creator/${nft.creator.id}`} className="font-medium hover:text-neon-purple">
                    {nft.creator.name}
                  </Link>
                  {nft.creator.verified && (
                    <svg className="w-4 h-4 ml-1 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 mb-6">{nft.description}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-dark-card rounded-xl p-4">
                <p className="text-sm text-gray-400 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Views
                </p>
                <p className="text-lg font-medium">{nft.views}</p>
              </div>
              
              <div className="bg-dark-card rounded-xl p-4">
                <p className="text-sm text-gray-400 flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  Likes
                </p>
                <p className="text-lg font-medium">{nft.likes}</p>
              </div>
              
              <div className="bg-dark-card rounded-xl p-4">
                <p className="text-sm text-gray-400 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Blockchain
                </p>
                <p className="text-lg font-medium">{nft.blockchain}</p>
              </div>
            </div>
            
            {/* Price and action */}
            <div className="bg-gradient-featured rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-400">Current price</p>
                {nft.auction && nft.endTime && (
                  <div className="flex items-center text-neon-yellow">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Ends in {getRemainingTime(nft.endTime)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{nft.price} {nft.currency}</p>
                  <p className="text-sm text-gray-400">≈ $1,234.56</p>
                </div>
                {nft.auction ? (
                  <Button className="bg-neon-purple hover:bg-neon-purple/90">Place a Bid</Button>
                ) : (
                  <Button 
                    className="bg-neon-purple hover:bg-neon-purple/90"
                    onClick={() => addToCart(nft)}
                    disabled={isInCart(nft.id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isInCart(nft.id) ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Tabs with details */}
            <Tabs defaultValue="properties" value={tabValue} onValueChange={setTabValue}>
              <TabsList className="grid grid-cols-4 border-b border-white/10 bg-transparent">
                <TabsTrigger 
                  value="properties" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-neon-purple data-[state=active]:rounded-none rounded-none"
                >
                  Properties
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-neon-purple data-[state=active]:rounded-none rounded-none"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="rarity" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-neon-purple data-[state=active]:rounded-none rounded-none"
                >
                  Rarity
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-neon-purple data-[state=active]:rounded-none rounded-none"
                >
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="py-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {nft.attributes.map((attr, i) => (
                    <div key={i} className="bg-dark-card border border-neon-purple/10 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">{attr.trait_type}</p>
                      <p className="font-medium text-neon-purple">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="py-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract Address</span>
                    <span className="font-mono">0x1a2b...4d5e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID</span>
                    <span>{nft.id.split('-')[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Standard</span>
                    <span>ERC-721</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blockchain</span>
                    <span>{nft.blockchain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Listed</span>
                    <span>{formatDate(nft.listed)}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rarity" className="py-4">
                <div className="bg-dark-card rounded-xl p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-neon-purple" />
                      Rarity Score
                    </span>
                    <span className="text-neon-purple font-bold">{nft.rarity.score}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400 text-sm">Rank {nft.rarity.rank} of {nft.rarity.totalInCollection}</span>
                    <span className="text-gray-400 text-sm">Top {Math.round((nft.rarity.rank / nft.rarity.totalInCollection) * 100)}%</span>
                  </div>
                  <Progress
                    value={(1 - (nft.rarity.rank / nft.rarity.totalInCollection)) * 100}
                    className="h-2 bg-gray-700"
                  />
                </div>
                
                <h4 className="font-medium mb-3">Trait Rarity</h4>
                <div className="space-y-3">
                  {nft.attributes.map((attr, i) => (
                    <div key={i} className="bg-dark-card rounded-xl p-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">{attr.trait_type}</span>
                        <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full">
                          {Math.floor(Math.random() * 15) + 1}% have this
                        </span>
                      </div>
                      <p className="font-medium">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="py-4">
                <div className="space-y-4">
                  {nft.history.map((event, i) => (
                    <div key={i} className="bg-dark-card rounded-xl p-4">
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <History className="w-4 h-4 mr-2 text-neon-blue" />
                          <span className="font-medium">{event.event}</span>
                        </span>
                        <span className="text-gray-400">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">From</p>
                          <p className="font-mono">{event.from === "0x0000000000000000000000000000000000000000" ? "NullAddress" : event.from}</p>
                        </div>
                        <div className="self-center">
                          <ArrowRight className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 mb-1">To</p>
                          <p className="font-mono">{event.to}</p>
                        </div>
                      </div>
                      {event.price && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <p className="text-gray-400 text-sm">Price</p>
                          <p>{event.price} {event.currency}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* More from this collection */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">More from this collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nft.collection && nfts
              .filter(item => item.collection.id === nft.collection.id && item.id !== nft.id)
              .slice(0, 4)
              .map(relatedNft => (
                <Link to={`/nft/${relatedNft.id}`} key={relatedNft.id} className="block">
                  <div className="relative overflow-hidden rounded-xl group">
                    <img 
                      src={relatedNft.previewImage} 
                      alt={relatedNft.name} 
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div>
                        <h3 className="font-medium text-white">{relatedNft.name}</h3>
                        <p className="text-sm text-gray-300">{relatedNft.price} {relatedNft.currency}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mocked NFT array just for the "More from collection" section
const nfts = [
  {
    id: "nft-12345",
    name: "Cosmic Dreamer #42",
    description: "An interdimensional being floating through the cosmic void",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 1.2,
    currency: "ETH",
    collection: { id: "collection-123", name: "Cosmic Dreamers" }
  },
  {
    id: "nft-12346",
    name: "Cosmic Dreamer #137",
    description: "A dreamlike entity with a glimpse into another universe",
    image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 0.95,
    currency: "ETH",
    collection: { id: "collection-123", name: "Cosmic Dreamers" }
  },
  {
    id: "nft-12347",
    name: "Cosmic Dreamer #89",
    description: "A celestial being manifested from cosmic energy",
    image: "https://images.unsplash.com/photo-1631651363531-ee148a88cbf2?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1631651363531-ee148a88cbf2?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 1.5,
    currency: "ETH",
    collection: { id: "collection-123", name: "Cosmic Dreamers" }
  },
  {
    id: "nft-12348",
    name: "Cosmic Dreamer #215",
    description: "A fragment of consciousness traveling across dimensions",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 1.1,
    currency: "ETH",
    collection: { id: "collection-123", name: "Cosmic Dreamers" }
  },
  {
    id: "nft-23456",
    name: "Voxel Spacecraft #08",
    description: "A meticulously crafted voxel spacecraft hovering above an alien landscape",
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    previewImage: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    price: 1.45,
    currency: "ETH",
    collection: { id: "collection-124", name: "Ethernal Voxels" }
  }
];
