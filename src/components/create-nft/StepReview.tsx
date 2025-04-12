
import React from 'react';
import { useCreateNFT } from '@/context/CreateNFTContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const SectionHeader = ({ title, isComplete, onEdit }: { title: string; isComplete: boolean; onEdit: () => void }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {isComplete ? (
        <CheckCircle2 size={18} className="text-green-500" />
      ) : (
        <AlertCircle size={18} className="text-yellow-500" />
      )}
    </div>
    <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
      <Edit2 size={16} className="mr-1" />
      Edit
    </Button>
  </div>
);

const StepReview = () => {
  const { formData, isStepComplete, setCurrentStep } = useCreateNFT();

  const getCurrencySymbol = (currency: string): string => {
    switch (currency) {
      case 'ETH': return 'Ξ';
      case 'MATIC': return 'MATIC';
      case 'SOL': return '◎';
      default: return currency;
    }
  };
  
  const getBlockchainName = (blockchain: string): string => {
    switch (blockchain) {
      case 'ethereum': return 'Ethereum';
      case 'polygon': return 'Polygon';
      case 'solana': return 'Solana';
      default: return blockchain;
    }
  };
  
  const getSaleTypeDisplay = (): string => {
    switch (formData.saleType) {
      case 'fixed': return `Fixed Price: ${getCurrencySymbol(formData.currency)}${formData.price}`;
      case 'auction': return `Auction: Starting at ${getCurrencySymbol(formData.currency)}${formData.auctionDetails?.startingPrice} for ${formData.auctionDetails?.duration} days`;
      case 'offers': return `Open to Offers${formData.minimumOffer ? ` (Min: ${getCurrencySymbol(formData.currency)}${formData.minimumOffer})` : ''}`;
      default: return '';
    }
  };

  const getCollectionDisplay = (): React.ReactNode => {
    if (formData.collectionType === 'existing') {
      // In a real app, you would fetch the collection details
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
          <span>Existing Collection</span>
        </div>
      );
    } else if (formData.collectionType === 'new' && formData.newCollection) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neon-purple/20 rounded-full flex items-center justify-center">
            {formData.newCollection.logoPreview ? (
              <img 
                src={formData.newCollection.logoPreview}
                alt={formData.newCollection.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xs">{formData.newCollection.name.charAt(0)}</span>
            )}
          </div>
          <span>{formData.newCollection.name} ({formData.newCollection.symbol})</span>
        </div>
      );
    }
    return 'No collection selected';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Review Your NFT</h2>
        <p className="text-gray-300 mb-4">
          Review your NFT details before creating
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Asset Review */}
        <Card className="bg-black/30 border-white/10 p-5">
          <SectionHeader 
            title="Asset" 
            isComplete={isStepComplete('upload')} 
            onEdit={() => setCurrentStep('upload')} 
          />
          
          <div className="flex flex-wrap gap-4">
            {formData.assetPreviews.map((preview) => (
              <div key={preview.id} className="relative w-24 h-24 rounded-lg overflow-hidden bg-dark-card">
                {preview.fileType === 'image' && (
                  <img 
                    src={preview.previewUrl} 
                    alt={preview.name} 
                    className="w-full h-full object-cover"
                  />
                )}
                {preview.fileType === 'video' && (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <span className="text-xs text-gray-400">Video</span>
                  </div>
                )}
                {preview.fileType === 'audio' && (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <span className="text-xs text-gray-400">Audio</span>
                  </div>
                )}
                {preview.fileType === '3d' && (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <span className="text-xs text-gray-400">3D Model</span>
                  </div>
                )}
                
                <Badge className="absolute bottom-1 right-1 text-[10px] py-0 px-1">
                  {preview.fileType}
                </Badge>
              </div>
            ))}
            
            {formData.assetPreviews.length === 0 && (
              <div className="w-full text-center py-4">
                <p className="text-gray-400">No assets uploaded</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Details Review */}
        <Card className="bg-black/30 border-white/10 p-5">
          <SectionHeader 
            title="Details" 
            isComplete={isStepComplete('details')} 
            onEdit={() => setCurrentStep('details')} 
          />
          
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-400 text-sm mb-1">Name</h4>
              <p className="text-white">{formData.name || 'Not set'}</p>
            </div>
            
            <div>
              <h4 className="text-gray-400 text-sm mb-1">Description</h4>
              <p className="text-white">{formData.description || 'Not set'}</p>
            </div>
            
            {formData.attributes.length > 0 && (
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Properties</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.attributes.map((attr, index) => (
                    <div key={index} className="px-3 py-1 rounded-md bg-dark-card border border-white/10">
                      <span className="text-gray-400 text-xs">{attr.traitType}:</span>{' '}
                      <span className="text-white text-sm">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.hasUnlockableContent && (
              <div>
                <h4 className="text-gray-400 text-sm mb-1">Unlockable Content</h4>
                <Badge>Included</Badge>
              </div>
            )}
          </div>
        </Card>
        
        {/* Collection Review */}
        <Card className="bg-black/30 border-white/10 p-5">
          <SectionHeader 
            title="Collection" 
            isComplete={isStepComplete('collection')} 
            onEdit={() => setCurrentStep('collection')} 
          />
          
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-400 text-sm mb-1">Collection</h4>
              <div className="text-white">{getCollectionDisplay()}</div>
            </div>
            
            {formData.collectionType === 'new' && formData.newCollection?.categories?.length > 0 && (
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.newCollection.categories.map((category) => (
                    <Badge key={category} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Pricing Review */}
        <Card className="bg-black/30 border-white/10 p-5">
          <SectionHeader 
            title="Pricing & Settings" 
            isComplete={isStepComplete('pricing')} 
            onEdit={() => setCurrentStep('pricing')} 
          />
          
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-400 text-sm mb-1">Sale Type</h4>
              <p className="text-white">{getSaleTypeDisplay()}</p>
            </div>
            
            {formData.scheduledListing && (
              <div>
                <h4 className="text-gray-400 text-sm mb-1">Scheduled Listing</h4>
                <div className="flex gap-2 items-center">
                  <Badge className="bg-yellow-500">Scheduled</Badge>
                  <span className="text-white">
                    {formData.startDate && `Starts: ${format(formData.startDate, 'PPP')}`}
                    {formData.endDate && ` - Ends: ${format(formData.endDate, 'PPP')}`}
                  </span>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-gray-400 text-sm mb-1">Royalty</h4>
              <p className="text-white">{formData.royaltyPercentage}%</p>
            </div>
            
            <div>
              <h4 className="text-gray-400 text-sm mb-1">Blockchain</h4>
              <p className="text-white">{getBlockchainName(formData.blockchain)}</p>
            </div>
            
            {formData.supply > 1 && (
              <div>
                <h4 className="text-gray-400 text-sm mb-1">Supply</h4>
                <p className="text-white">{formData.supply} editions</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              {formData.lazyMint && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm text-white">Lazy Minting</span>
                </div>
              )}
              
              {formData.freezeMetadata && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm text-white">Frozen Metadata</span>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Fee Summary */}
        <Card className="bg-black/30 border-white/10 p-5">
          <h3 className="text-lg font-medium text-white mb-4">Fee Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Marketplace Fee (2.5%)</span>
              <span className="text-white">
                {formData.saleType === 'fixed' && formData.price ? 
                  `${(formData.price * 0.025).toFixed(4)} ${formData.currency}` : 
                  'Varies by sale price'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gas Fee (estimated)</span>
              <span className="text-white">
                {formData.lazyMint ? 'Deferred until purchase' : `~0.003 ${formData.blockchain === 'ethereum' ? 'ETH' : formData.blockchain === 'polygon' ? 'MATIC' : 'SOL'}`}
              </span>
            </div>
            
            <Separator className="my-2 bg-white/10" />
            
            {formData.saleType === 'fixed' && formData.price ? (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">You'll Receive</span>
                <span className="text-green-400 font-medium">
                  {(formData.price * 0.975).toFixed(4)} {formData.currency}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Creator Royalties</span>
                <span className="text-white">{formData.royaltyPercentage}% of each sale</span>
              </div>
            )}
          </div>
        </Card>
        
        {/* Terms */}
        <div className="text-sm text-gray-400">
          <p className="mb-2">By creating this NFT, you confirm that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You own or have rights to the content you're creating as an NFT</li>
            <li>You're not violating any copyright or intellectual property rights</li>
            <li>You accept the marketplace terms and conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
