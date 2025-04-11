
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilterCategory, filterCategories } from '@/services/nftService';
import { Search, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterSidebarProps {
  filters: Record<string, string[]>;
  setFilters: (filters: Record<string, string[]>) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function FilterSidebar({
  filters,
  setFilters,
  isMobileOpen,
  setIsMobileOpen
}: FilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    filterCategories.reduce((acc, category) => {
      acc[category.id] = true; // All categories expanded by default
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const handleFilterChange = (categoryId: string, optionId: string, checked: boolean) => {
    setFilters({
      ...filters,
      [categoryId]: checked 
        ? [...(filters[categoryId] || []), optionId]
        : (filters[categoryId] || []).filter(id => id !== optionId)
    });
  };
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  const activeFilterCount = Object.values(filters).flat().length;

  // Filter categories by search term
  const filteredCategories = filterCategories.map(category => {
    const filteredOptions = category.options.filter(
      option => option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...category, options: filteredOptions };
  }).filter(category => category.options.length > 0);

  return (
    <>
      {/* Mobile filter toggle button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-20">
        <Button
          onClick={() => setIsMobileOpen(true)}
          className="rounded-full shadow-neon-purple w-12 h-12 p-0"
          variant="outline"
        >
          <Filter className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-neon-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    
      {/* Filter sidebar - responsive */}
      <aside className={`
        ${isMobileOpen ? 'fixed inset-0 z-50' : 'hidden lg:block'}
        lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] bg-dark-card rounded-xl w-full lg:w-64 overflow-hidden transition-transform duration-300
      `}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-card z-10">
          <h2 className="font-bold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
            )}
          </h2>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-4 sticky top-[64px] bg-dark-card z-10">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search filters..."
              className="pl-8 bg-dark-lighter border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-124px)] p-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="mb-6">
                <button
                  className="flex justify-between items-center w-full text-left font-semibold mb-2"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedCategories[category.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedCategories[category.id] && (
                  <div className="space-y-2 ml-1">
                    {category.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${category.id}-${option.id}`}
                          checked={filters[category.id]?.includes(option.id) || false}
                          onCheckedChange={(checked) => 
                            handleFilterChange(category.id, option.id, checked === true)
                          }
                          className="border-white/20 data-[state=checked]:bg-neon-purple data-[state=checked]:border-neon-purple"
                        />
                        <label
                          htmlFor={`${category.id}-${option.id}`}
                          className="text-sm flex items-center justify-between w-full cursor-pointer"
                        >
                          <span>{option.name}</span>
                          {option.count !== undefined && (
                            <span className="text-muted-foreground text-xs">({option.count})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No filters match your search.</p>
          )}
          
          {activeFilterCount > 0 && (
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="w-full mt-4 border-white/10 hover:bg-neon-purple/20"
            >
              Clear All Filters
            </Button>
          )}
        </ScrollArea>
      </aside>
    </>
  );
}
