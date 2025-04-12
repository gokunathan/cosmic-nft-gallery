import React, { useState, useEffect } from 'react';
import { useCreateNFT, CollectionOption } from '@/context/CreateNFTContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUp, Loader2, Verified, Search } from 'lucide-react';
import { toast } from 'sonner';

// Mock collection data
const MOCK_COLLECTIONS: CollectionOption[] = [
  {
    id: 'collection-1',
    name: 'Nebula Dreams',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
    floorPrice: 0.85,
    itemCount: 10000,
    verified: true
  },
  {
    id: 'collection-2',
    name: 'Digital Nomads',
    image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb',
    floorPrice: 1.2,
    itemCount: 5000,
    verified: true
  },
  {
    id: 'collection-3',
    name: 'Abstract Thoughts',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    floorPrice: 0.75,
    itemCount: 3000,
    verified: true
  },
  {
    id: 'collection-4',
    name: 'Retro Pixels',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    floorPrice: 0.45,
    itemCount: 8000,
    verified: false
  },
];

// Categories for collection
const CATEGORIES = [
  'Art', 'Collectibles', 'Domain Names', 'Music', 'Photography',
  'Sports', 'Trading Cards', 'Utility', 'Virtual Worlds'
];

const StepCollection = () => {
  const { formData, updateFormData } = useCreateNFT();
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Load mock collections
  useEffect(() => {
    const loadCollections = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setCollections(MOCK_COLLECTIONS);
      setLoading(false);
    };
    
    loadCollections();
  }, []);
  
  const handleCollectionTypeChange = (type: 'existing' | 'new') => {
    updateFormData({ collectionType: type });
    
    if (type === 'new' && !formData.newCollection) {
      updateFormData({
        newCollection: {
          name: '',
          symbol: '',
          description: '',
          categories: []
        }
      });
    }
  };
  
  const handleCollectionSelect = (collectionId: string) => {
    updateFormData({ existingCollectionId: collectionId });
  };
  
  const handleNewCollectionUpdate = (updates: Partial<typeof formData.newCollection>) => {
    if (!formData.newCollection) return;
    
    updateFormData({
      newCollection: {
        ...formData.newCollection,
        ...updates
      }
    });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Logo image must be under 5MB'
      });
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    
    handleNewCollectionUpdate({
      logoFile: file,
      logoPreview: previewUrl
    });
  };
  
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Banner image must be under 10MB'
      });
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    
    handleNewCollectionUpdate({
      bannerFile: file,
      bannerPreview: previewUrl
    });
  };
  
  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    
    if (formData.newCollection) {
      handleNewCollectionUpdate({
        categories: newCategories
      });
    }
  };
  
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Collection</h2>
        <p className="text-gray-300 mb-4">
          Choose an existing collection or create a new one for your NFT
        </p>
      </div>
      
      <RadioGroup 
        value={formData.collectionType} 
        onValueChange={(value: 'existing' | 'new') => handleCollectionTypeChange(value)}
        className="space-y-6"
      >
        {/* Existing Collection Option */}
        <div className={`p-4 border ${formData.collectionType === 'existing' ? 'border-neon-purple' : 'border-white/10'} rounded-lg`}>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="existing" id="existing" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="existing" className="text-lg font-medium text-white cursor-pointer">Use existing collection</Label>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Add this NFT to one of your existing collections
              </p>
              
              {formData.collectionType === 'existing' && (
                <div className="mt-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search collections"
                      className="pl-10 bg-dark-card border-white/10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {loading ? (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-neon-purple mr-2" size={24} />
                        <span className="text-gray-300">Loading collections...</span>
                      </div>
                    ) : filteredCollections.length === 0 ? (
                      <div className="col-span-full text-center py-8 border border-dashed border-white/10 rounded-lg">
                        <p className="text-gray-400">No collections found</p>
                      </div>
                    ) : (
                      filteredCollections.map((collection) => (
                        <div 
                          key={collection.id} 
                          onClick={() => handleCollectionSelect(collection.id)}
                          className={`cursor-pointer p-3 rounded-lg border ${formData.existingCollectionId === collection.id ? 'border-neon-purple bg-neon-purple/10' : 'border-white/10 hover:border-white/20'}`}
                        >
                          <div className="relative aspect-square rounded-md overflow-hidden mb-3">
                            <img 
                              src={collection.image} 
                              alt={collection.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-medium text-white truncate">{collection.name}</h4>
                            {collection.verified && (
                              <Verified size={16} className="text-neon-blue shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>{collection.itemCount} items</span>
                            <span>Floor: {collection.floorPrice} ETH</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Create New Collection Option */}
        <div className={`p-4 border ${formData.collectionType === 'new' ? 'border-neon-purple' : 'border-white/10'} rounded-lg`}>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="new" id="new" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="new" className="text-lg font-medium text-white cursor-pointer">Create new collection</Label>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Create a brand new collection for your NFTs
              </p>
              
              {formData.collectionType === 'new' && formData.newCollection && (
                <div className="mt-4 space-y-6">
                  {/* Collection Name */}
                  <div>
                    <Label htmlFor="collectionName" className="text-white">
                      Collection Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="collectionName"
                      value={formData.newCollection.name}
                      onChange={(e) => handleNewCollectionUpdate({ name: e.target.value })}
                      placeholder="Enter a name for your collection"
                      className="mt-1.5 bg-dark-card border-white/10"
                    />
                  </div>
                  
                  {/* Collection Symbol */}
                  <div>
                    <Label htmlFor="collectionSymbol" className="text-white">
                      Symbol <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="collectionSymbol"
                      value={formData.newCollection.symbol}
                      onChange={(e) => handleNewCollectionUpdate({ symbol: e.target.value.toUpperCase() })}
                      placeholder="ENS, BAYC, etc."
                      className="mt-1.5 bg-dark-card border-white/10"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      A short symbol/ticker for your collection (max 10 characters)
                    </p>
                  </div>
                  
                  {/* Collection Description */}
                  <div>
                    <Label htmlFor="collectionDescription" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="collectionDescription"
                      value={formData.newCollection.description || ''}
                      onChange={(e) => handleNewCollectionUpdate({ description: e.target.value })}
                      placeholder="Tell collectors about your collection, its themes, and vision"
                      className="mt-1.5 h-32 bg-dark-card border-white/10"
                    />
                  </div>
                  
                  {/* Collection Logo */}
                  <div>
                    <Label htmlFor="collectionLogo" className="text-white mb-1.5 block">
                      Logo Image
                    </Label>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-dark-card border border-white/10 flex items-center justify-center">
                        {formData.newCollection.logoPreview ? (
                          <img 
                            src={formData.newCollection.logoPreview} 
                            alt="Collection logo" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileUp size={24} className="text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Label htmlFor="logoUpload" className="cursor-pointer">
                          <div className="py-2 px-4 bg-dark-card border border-white/10 rounded-md hover:border-white/30 transition-colors text-center">
                            {formData.newCollection.logoFile ? 'Replace Logo' : 'Upload Logo'}
                          </div>
                          <input 
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleLogoUpload}
                          />
                        </Label>
                        <p className="text-xs text-gray-400 mt-1.5">
                          Recommended: 350x350px. Max size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collection Banner */}
                  <div>
                    <Label htmlFor="collectionBanner" className="text-white mb-1.5 block">
                      Banner Image
                    </Label>
                    
                    <div className="flex flex-col gap-3">
                      <div className="w-full h-36 rounded-lg overflow-hidden bg-dark-card border border-white/10 flex items-center justify-center">
                        {formData.newCollection.bannerPreview ? (
                          <img 
                            src={formData.newCollection.bannerPreview} 
                            alt="Collection banner" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileUp size={24} className="text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="bannerUpload" className="cursor-pointer">
                          <div className="py-2 px-4 bg-dark-card border border-white/10 rounded-md hover:border-white/30 transition-colors text-center">
                            {formData.newCollection.bannerFile ? 'Replace Banner' : 'Upload Banner'}
                          </div>
                          <input 
                            id="bannerUpload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleBannerUpload}
                          />
                        </Label>
                        <p className="text-xs text-gray-400 mt-1.5">
                          Recommended: 1400x400px. Max size: 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collection Categories */}
                  <div>
                    <Label className="text-white mb-3 block">
                      Categories (Select up to 3)
                    </Label>
                    
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((category) => (
                        <Button
                          key={category}
                          type="button"
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          className={selectedCategories.includes(category) ? "bg-neon-purple hover:bg-neon-purple/90" : ""}
                          size="sm"
                          onClick={() => handleCategoryToggle(category)}
                          disabled={!selectedCategories.includes(category) && selectedCategories.length >= 3}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Categories help collectors discover your collection
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StepCollection;
