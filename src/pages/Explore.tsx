
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getNFTs, sortOptions } from '@/services/nftService';
import NFTCard from '@/components/NFTCard';
import FilterSidebar from '@/components/FilterSidebar';
import Header from '@/components/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Get sort from URL or default to "recently-listed"
  const sortParam = searchParams.get('sort') || 'recently-listed';
  
  // Parse filters from URL
  const getFiltersFromUrl = () => {
    const filtersFromUrl: Record<string, string[]> = {};
    
    // Get collection filters
    const collections = searchParams.getAll('collections');
    if (collections.length > 0) {
      filtersFromUrl.collections = collections;
    }
    
    // Get price filters
    const price = searchParams.getAll('price');
    if (price.length > 0) {
      filtersFromUrl.price = price;
    }
    
    // Get blockchain filters
    const blockchain = searchParams.getAll('blockchain');
    if (blockchain.length > 0) {
      filtersFromUrl.blockchain = blockchain;
    }
    
    // Get status filters
    const status = searchParams.getAll('status');
    if (status.length > 0) {
      filtersFromUrl.status = status;
    }
    
    return filtersFromUrl;
  };
  
  const [filters, setFilters] = useState<Record<string, string[]>>(getFiltersFromUrl());
  
  // When filters or sort changes, update URL and reset to page 1
  const updateFiltersAndSort = (newFilters: Record<string, string[]>, newSort?: string) => {
    const params = new URLSearchParams();
    
    // Add sort parameter
    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.set('sort', sortParam);
    }
    
    // Add filter parameters
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach(value => {
        params.append(key, value);
      });
    });
    
    setSearchParams(params);
    setCurrentPage(1);
    setFilters(newFilters);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    updateFiltersAndSort(filters, value);
  };
  
  // Query NFTs with current filters, sort, and page
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['nfts', filters, sortParam, currentPage],
    queryFn: () => getNFTs(filters, sortParam, currentPage),
    keepPreviousData: true
  });
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Create pagination controls
  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;
    
    const paginationItems = [];
    
    // Previous button
    paginationItems.push(
      <Button
        key="prev"
        variant="outline"
        size="icon"
        className="border-white/10 hover:bg-white/10"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    );
    
    // First page
    if (currentPage > 3) {
      paginationItems.push(
        <Button
          key="page1"
          variant={currentPage === 1 ? "default" : "outline"}
          size="icon"
          className={currentPage === 1 ? "bg-neon-purple hover:bg-neon-purple/90" : "border-white/10 hover:bg-white/10"}
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
      
      if (currentPage > 4) {
        paginationItems.push(
          <Button key="ellipsis1" variant="ghost" size="icon" disabled>
            ...
          </Button>
        );
      }
    }
    
    // Page numbers around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(data.totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i <= 0 || i > data.totalPages) continue;
      
      paginationItems.push(
        <Button
          key={`page${i}`}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          className={currentPage === i ? "bg-neon-purple hover:bg-neon-purple/90" : "border-white/10 hover:bg-white/10"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }
    
    // Last page ellipsis
    if (currentPage < data.totalPages - 2) {
      if (currentPage < data.totalPages - 3) {
        paginationItems.push(
          <Button key="ellipsis2" variant="ghost" size="icon" disabled>
            ...
          </Button>
        );
      }
      
      paginationItems.push(
        <Button
          key={`page${data.totalPages}`}
          variant={currentPage === data.totalPages ? "default" : "outline"}
          size="icon"
          className={currentPage === data.totalPages ? "bg-neon-purple hover:bg-neon-purple/90" : "border-white/10 hover:bg-white/10"}
          onClick={() => handlePageChange(data.totalPages)}
        >
          {data.totalPages}
        </Button>
      );
    }
    
    // Next button
    paginationItems.push(
      <Button
        key="next"
        variant="outline"
        size="icon"
        className="border-white/10 hover:bg-white/10"
        disabled={currentPage === data.totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    );
    
    return (
      <div className="flex justify-center mt-10 gap-2">
        {paginationItems}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      <div className="container mx-auto pt-24 px-4 pb-16">
        <h1 className="text-4xl font-bold mb-8">Explore NFTs</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterSidebar 
              filters={filters} 
              setFilters={(newFilters) => updateFiltersAndSort(newFilters)}
              isMobileOpen={isMobileFilterOpen}
              setIsMobileOpen={setIsMobileFilterOpen}
            />
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-400">
                {data?.total ? (
                  <span>Showing {data.total} results</span>
                ) : (
                  <span>&nbsp;</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <Select value={sortParam} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] bg-dark-card border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-white/10">
                    {sortOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
              </div>
            )}
            
            {/* No results */}
            {!isLoading && data?.nfts && data.nfts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No NFTs Found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <Button 
                  variant="outline" 
                  className="border-white/10 hover:bg-white/10"
                  onClick={() => updateFiltersAndSort({})}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            
            {/* NFT Grid */}
            {!isLoading && data?.nfts && data.nfts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.nfts.map(nft => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
            
            {/* Results fading effect when fetching next page */}
            {isFetching && !isLoading && (
              <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
              </div>
            )}
            
            {/* Pagination */}
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
