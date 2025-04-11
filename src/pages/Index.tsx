
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNFTs, getTrendingCollections } from '@/services/nftService';
import NFTCard from '@/components/NFTCard';
import CollectionCard from '@/components/CollectionCard';
import Header from '@/components/Header';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Index() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Trending NFTs query
  const { data: trendingNFTs, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingNFTs'],
    queryFn: () => getNFTs({ status: ['on-auction'] }, 'most-viewed', 1)
  });

  // Recent NFTs query
  const { data: recentNFTs, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['recentNFTs'],
    queryFn: () => getNFTs({}, 'recently-listed', 1)
  });

  // Trending Collections query
  const { data: trendingCollections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['trendingCollections'],
    queryFn: getTrendingCollections
  });

  // Hide scroll indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="h-screen relative">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-neon-purple/20 via-dark to-dark z-10 opacity-80"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-20 pt-16">
          <div className="max-w-2xl mx-auto text-center md:text-left md:mx-0">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
              <span className="text-gradient-purple">Discover</span> & Collect Extraordinary NFTs
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore a curated marketplace of digital art, collectibles, and beyond. 
              Own, buy, and sell unique digital items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild className="bg-neon-purple hover:bg-neon-purple/90 text-white px-8 py-6 rounded-xl shadow-neon-purple">
                <Link to="/explore">Explore</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-6 rounded-xl">
                <Link to="/create">Create</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
            <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </section>

      {/* Trending NFTs Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-purple" />
              <span>Trending Auctions</span>
            </h2>
            <Button asChild variant="ghost" className="text-neon-purple hover:text-neon-purple hover:bg-neon-purple/10">
              <Link to="/explore?sort=most-viewed&status=on-auction" className="flex items-center">
                <span>View All</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingTrending ? (
              // Skeleton loading state
              Array(3).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-dark-lighter aspect-square rounded-xl mb-4"></div>
                  <div className="h-6 bg-dark-lighter rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-dark-lighter rounded-md w-1/2"></div>
                </div>
              ))
            ) : (
              trendingNFTs?.nfts.slice(0, 3).map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Collections Section */}
      <section className="py-20 px-4 bg-dark-lighter">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Popular Collections</h2>
            <Button asChild variant="ghost" className="text-neon-purple hover:text-neon-purple hover:bg-neon-purple/10">
              <Link to="/collections" className="flex items-center">
                <span>View All</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingCollections ? (
              // Skeleton loading state
              Array(4).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-dark aspect-video rounded-xl mb-4"></div>
                  <div className="h-6 bg-dark rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-dark rounded-md w-1/2"></div>
                </div>
              ))
            ) : (
              trendingCollections?.slice(0, 4).map(collection => (
                <CollectionCard
                  key={collection.id}
                  {...collection}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Recently Listed Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Recently Listed</h2>
            <Button asChild variant="ghost" className="text-neon-purple hover:text-neon-purple hover:bg-neon-purple/10">
              <Link to="/explore?sort=recently-listed" className="flex items-center">
                <span>View All</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingRecent ? (
              // Skeleton loading state
              Array(3).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-dark-lighter aspect-square rounded-xl mb-4"></div>
                  <div className="h-6 bg-dark-lighter rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-dark-lighter rounded-md w-1/2"></div>
                </div>
              ))
            ) : (
              recentNFTs?.nfts.slice(0, 6).map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Feature Highlight Section */}
      <section className="py-20 px-4 bg-gradient-featured">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-purple">The Ultimate NFT Experience</h2>
            <p className="text-xl text-gray-300">
              Discover why collectors and creators choose NFTVerse for their digital asset journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="p-6 rounded-xl glass">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Curated Collections</h3>
              <p className="text-gray-300">
                Discover carefully vetted collections from the most talented creators in the digital art space.
              </p>
            </div>
            
            <div className="p-6 rounded-xl glass">
              <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-gray-300">
                Every transaction is secured by blockchain technology, ensuring authenticity and ownership.
              </p>
            </div>
            
            <div className="p-6 rounded-xl glass">
              <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Payment Options</h3>
              <p className="text-gray-300">
                Pay with your preferred cryptocurrency or traditional payment methods for maximum flexibility.
              </p>
            </div>
            
            <div className="p-6 rounded-xl glass">
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Filters</h3>
              <p className="text-gray-300">
                Find exactly what you're looking for with our comprehensive filtering and sorting system.
              </p>
            </div>
            
            <div className="p-6 rounded-xl glass">
              <div className="w-12 h-12 rounded-xl bg-neon-yellow/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neon-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AR Preview</h3>
              <p className="text-gray-300">
                Preview NFTs in your physical space with our augmented reality feature before you buy.
              </p>
            </div>
            
            <div className="p-6 rounded-xl glass">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Gas Optimization</h3>
              <p className="text-gray-300">
                Our smart contract interactions are optimized to minimize gas fees and save you money.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-neon-purple/10 to-dark opacity-80 z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to start your NFT journey?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of collectors and creators in the future of digital ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-neon-purple hover:bg-neon-purple/90 text-white px-8 py-6 rounded-xl shadow-neon-purple">
                <Link to="/explore">Start Exploring</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-6 rounded-xl">
                <Link to="/create">Create NFT</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-dark-card py-10 px-4 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
                  <span className="text-xl font-bold text-white">N</span>
                </div>
                <span className="text-xl font-bold text-gradient-purple">NFTVerse</span>
              </Link>
              <p className="text-gray-400">
                The ultimate NFT marketplace for collectors and creators.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Marketplace</h3>
              <ul className="space-y-2">
                <li><Link to="/explore" className="text-gray-400 hover:text-neon-purple">Explore</Link></li>
                <li><Link to="/collections" className="text-gray-400 hover:text-neon-purple">Collections</Link></li>
                <li><Link to="/creators" className="text-gray-400 hover:text-neon-purple">Creators</Link></li>
                <li><Link to="/auctions" className="text-gray-400 hover:text-neon-purple">Live Auctions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/profile" className="text-gray-400 hover:text-neon-purple">Profile</Link></li>
                <li><Link to="/favorites" className="text-gray-400 hover:text-neon-purple">Favorites</Link></li>
                <li><Link to="/create" className="text-gray-400 hover:text-neon-purple">Create</Link></li>
                <li><Link to="/settings" className="text-gray-400 hover:text-neon-purple">Settings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-neon-purple">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-neon-purple">Careers</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-neon-purple">Support</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-neon-purple">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 NFTVerse. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-neon-purple">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-purple">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-purple">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-purple">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
