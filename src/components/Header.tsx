
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  SearchIcon, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X, 
  Wallet,
  User,
  LogOut,
  Grid,
  GridIcon,
  Plus
} from 'lucide-react';
import { useNFTContext } from '@/context/NFTContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, removeFromCart } = useNFTContext();
  const location = useLocation();
  const isCreatePage = location.pathname === '/create';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          {/* Sacred Geometry Logo with Animation */}
          <div className="relative w-12 h-12">
            {/* Hexagonal Outer Shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3A1C71] via-[#D76D77] to-[#FFAF7B] rounded-xl opacity-80 animate-[spin_40s_linear_infinite]"></div>
            
            {/* Triangular Inner Elements */}
            <div className="absolute inset-[2px] bg-dark rounded-xl flex items-center justify-center overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                {/* Sacred Geometry Inner Pattern */}
                <div className="relative w-8 h-8">
                  {/* Triangle 1 */}
                  <div className="absolute inset-0 border-2 border-[#D76D77]/60 transform rotate-0 animate-[spin_30s_linear_infinite] rounded-lg"></div>
                  
                  {/* Triangle 2 */}
                  <div className="absolute inset-0 border-2 border-[#FFAF7B]/60 transform rotate-45 animate-[spin_25s_linear_reverse_infinite] rounded-lg"></div>
                  
                  {/* Ethereal Symbol */}
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl tracking-wider">
                    Ξ
                  </div>
                  
                  {/* Glowing Aura */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3A1C71]/20 via-transparent to-[#D76D77]/20 blur-md animate-pulse"></div>
                  
                  {/* Floating Particles */}
                  <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-75 animate-[pulse_4s_ease-in-out_infinite]"></div>
                  <div className="absolute bottom-1 left-2 w-1 h-1 bg-white rounded-full opacity-50 animate-[pulse_5s_ease-in-out_infinite_0.5s]"></div>
                  <div className="absolute top-2 left-1 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-[pulse_3s_ease-in-out_infinite_1s]"></div>
                </div>
              </div>
            </div>
            
            {/* Cosmic Background */}
            <div className="absolute inset-0 bg-gradient-radial from-[#3A1C71]/10 via-transparent to-transparent opacity-70 animate-pulse rounded-xl"></div>
          </div>
          
          {/* Typography */}
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-[4px] text-transparent bg-clip-text bg-gradient-to-r from-[#3A1C71] via-[#D76D77] to-[#FFAF7B]">ETHEREAL</span>
            <div className="flex items-center">
              <span className="h-px w-4 bg-gradient-to-r from-transparent via-[#D76D77] to-transparent mr-1"></span>
              <span className="text-sm tracking-[2px] text-gray-400">NFT GALLERY</span>
              <span className="h-px w-4 bg-gradient-to-r from-[#D76D77] via-transparent to-transparent ml-1"></span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 transition-colors ${
              isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link 
            to="/explore" 
            className={`flex items-center space-x-1 transition-colors ${
              isActive('/explore') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <SearchIcon className="w-5 h-5" />
            <span>Explore</span>
          </Link>
          <Link 
            to="/collections" 
            className={`flex items-center space-x-1 transition-colors ${
              isActive('/collections') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <GridIcon className="w-5 h-5" />
            <span>Collections</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-neon-purple">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-dark-lighter border-l border-white/10">
              <SheetHeader>
                <SheetTitle className="text-white">Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <ShoppingCart className="w-12 h-12 text-gray-500 mb-2" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => window.location.href = "/explore"}
                    >
                      Explore NFTs
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4 mb-6 max-h-[60vh] overflow-auto">
                      {cart.map((nft) => (
                        <div key={nft.id} className="flex items-center space-x-4 p-2 rounded-lg bg-dark-card">
                          <img src={nft.previewImage} alt={nft.name} className="w-16 h-16 object-cover rounded-md" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{nft.name}</h4>
                            <p className="text-gray-400 text-sm">{nft.price} {nft.currency}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(nft.id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Total:</span>
                        <span className="font-medium">
                          {cart.reduce((sum, nft) => sum + nft.price, 0).toFixed(2)} ETH
                        </span>
                      </div>
                      <Button className="w-full bg-neon-purple hover:bg-neon-purple/80">
                        Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/favorites">
              <Heart className="w-5 h-5" />
            </Link>
          </Button>
          
          <div className="hidden md:block ml-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <img src="https://randomuser.me/api/portraits/men/18.jpg" alt="User" />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1 bg-dark-lighter border border-white/10">
                  <div className="flex items-center p-2">
                    <Avatar className="w-8 h-8 mr-2">
                      <img src="https://randomuser.me/api/portraits/men/18.jpg" alt="User" />
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-medium">Alex Johnson</span>
                      <span className="text-xs text-gray-400 truncate">@alexjohnson</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    <span>My Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center text-red-500" 
                    onClick={() => setIsLoggedIn(false)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                onClick={() => setIsLoggedIn(true)}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 md:hidden">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex flex-col items-center gap-6 p-6">
            {isLoggedIn ? (
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-20 h-20 mb-2">
                  <img src="https://randomuser.me/api/portraits/men/18.jpg" alt="User" />
                </Avatar>
                <span className="text-lg font-medium">Alex Johnson</span>
                <span className="text-sm text-gray-400">@alexjohnson</span>
              </div>
            ) : (
              <Button 
                className="w-full bg-neon-purple hover:bg-neon-purple/80 mb-6"
                onClick={() => setIsLoggedIn(true)}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            )}
            
            <Link 
              to="/" 
              className={`flex items-center space-x-2 text-lg py-3 ${
                isActive('/') ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-6 h-6" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/explore" 
              className={`flex items-center space-x-2 text-lg py-3 ${
                isActive('/explore') ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <SearchIcon className="w-6 h-6" />
              <span>Explore</span>
            </Link>
            
            <Link 
              to="/collections" 
              className={`flex items-center space-x-2 text-lg py-3 ${
                isActive('/collections') ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <GridIcon className="w-6 h-6" />
              <span>Collections</span>
            </Link>
            
            <Link 
              to="/favorites" 
              className={`flex items-center space-x-2 text-lg py-3 ${
                isActive('/favorites') ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="w-6 h-6" />
              <span>Favorites</span>
            </Link>

            <Link 
              to="/create" 
              className={`flex items-center space-x-2 text-lg py-3 ${
                isActive('/create') ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="w-6 h-6" />
              <span>Create NFT</span>
            </Link>
            
            {isLoggedIn && (
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-lg py-3 text-red-500"
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
