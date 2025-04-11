
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { 
  Layout, 
  LayoutGrid, 
  ListIcon, 
  ChevronDown, 
  ArrowDownAZ, 
  ArrowUpAZ
} from 'lucide-react';
import { getTrendingCollections } from '@/services/nftService';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollectionCard from '@/components/CollectionCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface ViewPreferences {
  layout: 'grid' | 'list';
  sortBy: string;
}

const Collections = () => {
  // Search params for filtering and sorting
  const [searchParams, setSearchParams] = useSearchParams();
  
  // View preferences with local storage persistence
  const [viewPreferences, setViewPreferences] = useState<ViewPreferences>(() => {
    const saved = localStorage.getItem('collectionViewPreferences');
    const initial: ViewPreferences = { layout: 'grid', sortBy: 'volume_24h' };
    
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initial;
      }
    }
    
    return initial;
  });
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('collectionViewPreferences', JSON.stringify(viewPreferences));
  }, [viewPreferences]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get sort from URL or default
  const sortParam = searchParams.get('sort') || viewPreferences.sortBy;
  
  // Query collections
  const { data, isLoading } = useQuery({
    queryKey: ['collections', sortParam, currentPage],
    queryFn: () => getTrendingCollections(),
    placeholderData: (previousData) => previousData
  });
  
  // Sorting options
  const sortOptions = [
    { value: 'volume_24h', label: 'Volume (24h)' },
    { value: 'volume_7d', label: 'Volume (7d)' },
    { value: 'volume_30d', label: 'Volume (30d)' },
    { value: 'floor_price_asc', label: 'Floor Price (Low to High)' },
    { value: 'floor_price_desc', label: 'Floor Price (High to Low)' },
    { value: 'recently_added', label: 'Recently Added' }
  ];
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setViewPreferences(prev => ({ ...prev, sortBy: value }));
    searchParams.set('sort', value);
    setSearchParams(searchParams);
  };
  
  // Handle layout change
  const handleLayoutChange = (layout: 'grid' | 'list') => {
    setViewPreferences(prev => ({ ...prev, layout }));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Calculate total pages (for demo, hardcoded to 5)
  const totalPages = 5;
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          href="#" 
          isActive={currentPage === 1} 
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If there are many pages, add ellipsis and nearby pages
    if (totalPages > 5) {
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show current page and neighbors
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i} 
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if there are few
      for (let i = 2; i < totalPages; i++) {
        items.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i} 
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === totalPages} 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Collections</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover, collect, and sell extraordinary NFTs from top artists and creators around the world
          </p>
        </div>
        
        {/* Filters and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            {/* View Layout Toggle */}
            <RadioGroup 
              value={viewPreferences.layout} 
              className="flex items-center gap-2"
              onValueChange={(value) => handleLayoutChange(value as 'grid' | 'list')}
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="grid" id="grid" className="sr-only" />
                <Label
                  htmlFor="grid"
                  className={`p-2 rounded-md cursor-pointer ${
                    viewPreferences.layout === 'grid' 
                      ? 'bg-neon-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Label>
              </div>
              
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="list" id="list" className="sr-only" />
                <Label
                  htmlFor="list"
                  className={`p-2 rounded-md cursor-pointer ${
                    viewPreferences.layout === 'list' 
                      ? 'bg-neon-purple/20 text-white' 
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <Select value={sortParam} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px] bg-dark-card border-gray-700">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-gray-700">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Collections Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video w-full rounded-xl bg-dark-card"></div>
            ))}
          </div>
        ) : viewPreferences.layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((collection) => (
              <CollectionCard
                key={collection.id}
                id={collection.id}
                name={collection.name}
                bannerImage={collection.bannerImage}
                verified={collection.verified}
                floorPrice={collection.floorPrice}
                itemCount={collection.itemCount}
                volumeTraded={collection.volumeTraded}
                creator={collection.creator}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((collection) => (
              <Card key={collection.id} className="bg-dark-card border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-[160px] md:h-auto">
                      <img 
                        src={collection.bannerImage || "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d"} 
                        alt={collection.name} 
                        className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                    </div>
                    <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{collection.name}</h3>
                          {collection.verified && (
                            <svg className="w-4 h-4 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                        
                        {collection.creator && (
                          <div className="flex items-center gap-2">
                            <img 
                              src={collection.creator.avatar} 
                              alt={collection.creator.name} 
                              className="w-5 h-5 rounded-full"
                            />
                            <span className="text-sm text-gray-400">@{collection.creator.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-xs text-gray-400">Floor</p>
                          <p className="text-sm font-medium">{collection.floorPrice} ETH</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400">Volume</p>
                          <p className="text-sm font-medium">{collection.volumeTraded} ETH</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400">Items</p>
                          <p className="text-sm font-medium">{collection.itemCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-6 flex items-center">
                      <Button variant="outline" size="sm" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10">
                        View Collection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Collections;
