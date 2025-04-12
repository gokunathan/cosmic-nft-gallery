
import React, { useState } from 'react';
import { useCreateNFT } from '@/context/CreateNFTContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Info } from "lucide-react";

const DURATION_OPTIONS = [
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
];

const BLOCKCHAINS = [
  { value: 'ethereum', label: 'Ethereum', icon: '🌐', fee: 'Medium Gas Fees' },
  { value: 'polygon', label: 'Polygon', icon: '🟣', fee: 'Low Gas Fees' },
  { value: 'solana', label: 'Solana', icon: '🟢', fee: 'Very Low Gas Fees' },
];

const StepPricing = () => {
  const { formData, updateFormData } = useCreateNFT();
  
  const handleSaleTypeChange = (type: 'fixed' | 'auction' | 'offers') => {
    updateFormData({ saleType: type });
    
    if (type === 'auction' && !formData.auctionDetails) {
      updateFormData({
        auctionDetails: {
          startingPrice: 0.1,
          duration: 7
        }
      });
    }
  };
  
  const handleAuctionUpdate = (updates: Partial<typeof formData.auctionDetails>) => {
    if (!formData.auctionDetails) return;
    
    updateFormData({
      auctionDetails: {
        ...formData.auctionDetails,
        ...updates
      }
    });
  };
  
  // Calculate royalty breakdown
  const calculateRoyaltyBreakdown = () => {
    let creatorRoyalty = formData.royaltyPercentage;
    let marketplaceFee = 2.5; // Standard marketplace fee
    let sellerReceives = 100 - creatorRoyalty - marketplaceFee;
    
    return {
      creatorRoyalty,
      marketplaceFee,
      sellerReceives
    };
  };
  
  const royaltyBreakdown = calculateRoyaltyBreakdown();
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Pricing & Settings</h2>
        <p className="text-gray-300 mb-4">
          Set your price, royalties, and blockchain details
        </p>
      </div>
      
      {/* Sale Type */}
      <div className="border-b border-white/10 pb-8">
        <h3 className="text-xl font-medium text-white mb-4">Sale Type</h3>
        
        <RadioGroup 
          value={formData.saleType} 
          onValueChange={(value: 'fixed' | 'auction' | 'offers') => handleSaleTypeChange(value)}
          className="space-y-4"
        >
          {/* Fixed Price */}
          <div className={`p-4 border ${formData.saleType === 'fixed' ? 'border-neon-purple' : 'border-white/10'} rounded-lg`}>
            <div className="flex items-start gap-3">
              <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="fixed" className="text-lg font-medium text-white cursor-pointer">Fixed Price</Label>
                <p className="text-sm text-gray-400 mt-1 mb-3">
                  Sell at a fixed price
                </p>
                
                {formData.saleType === 'fixed' && (
                  <div className="mt-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <Label htmlFor="price" className="text-white">
                          Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.00001"
                          min="0"
                          value={formData.price || ''}
                          onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="mt-1.5 bg-dark-card border-white/10"
                        />
                      </div>
                      
                      <div className="w-24">
                        <Label htmlFor="currency" className="text-white">
                          Currency
                        </Label>
                        <select
                          id="currency"
                          value={formData.currency}
                          onChange={(e) => updateFormData({ currency: e.target.value })}
                          className="w-full h-10 mt-1.5 rounded-md border border-white/10 bg-dark-card px-3 py-2 text-sm"
                        >
                          <option value="ETH">ETH</option>
                          <option value="MATIC">MATIC</option>
                          <option value="SOL">SOL</option>
                        </select>
                      </div>
                    </div>
                    
                    {formData.price && formData.price > 0 && (
                      <div className="mt-3 text-sm text-gray-400 flex gap-2 items-center">
                        <Info size={14} />
                        <span>
                          Estimated value: $
                          {(formData.price * 
                            (formData.currency === 'ETH' ? 2000 : 
                             formData.currency === 'MATIC' ? 0.5 : 
                             50)).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Timed Auction */}
          <div className={`p-4 border ${formData.saleType === 'auction' ? 'border-neon-purple' : 'border-white/10'} rounded-lg`}>
            <div className="flex items-start gap-3">
              <RadioGroupItem value="auction" id="auction" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="auction" className="text-lg font-medium text-white cursor-pointer">Timed Auction</Label>
                <p className="text-sm text-gray-400 mt-1 mb-3">
                  Auction to the highest bidder
                </p>
                
                {formData.saleType === 'auction' && formData.auctionDetails && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <Label htmlFor="startingPrice" className="text-white">
                          Starting Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="startingPrice"
                          type="number"
                          step="0.00001"
                          min="0"
                          value={formData.auctionDetails.startingPrice || ''}
                          onChange={(e) => handleAuctionUpdate({ startingPrice: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="mt-1.5 bg-dark-card border-white/10"
                        />
                      </div>
                      
                      <div className="w-24">
                        <Label htmlFor="auctionCurrency" className="text-white">
                          Currency
                        </Label>
                        <select
                          id="auctionCurrency"
                          value={formData.currency}
                          onChange={(e) => updateFormData({ currency: e.target.value })}
                          className="w-full h-10 mt-1.5 rounded-md border border-white/10 bg-dark-card px-3 py-2 text-sm"
                        >
                          <option value="ETH">ETH</option>
                          <option value="MATIC">MATIC</option>
                          <option value="SOL">SOL</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="reservePrice" className="text-white">
                        Reserve Price (optional)
                      </Label>
                      <Input
                        id="reservePrice"
                        type="number"
                        step="0.00001"
                        min="0"
                        value={formData.auctionDetails.reservePrice || ''}
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          handleAuctionUpdate({ reservePrice: value });
                        }}
                        placeholder="0.00"
                        className="mt-1.5 bg-dark-card border-white/10"
                      />
                      <p className="text-xs text-gray-400 mt-1.5">
                        Item will not sell until this price is reached
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-white block mb-1.5">
                        Duration
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {DURATION_OPTIONS.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            size="sm"
                            variant={formData.auctionDetails.duration === option.value ? "default" : "outline"}
                            className={formData.auctionDetails.duration === option.value ? "bg-neon-purple hover:bg-neon-purple/90" : ""}
                            onClick={() => handleAuctionUpdate({ duration: option.value })}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Open for Offers */}
          <div className={`p-4 border ${formData.saleType === 'offers' ? 'border-neon-purple' : 'border-white/10'} rounded-lg`}>
            <div className="flex items-start gap-3">
              <RadioGroupItem value="offers" id="offers" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="offers" className="text-lg font-medium text-white cursor-pointer">Open for Offers</Label>
                <p className="text-sm text-gray-400 mt-1 mb-3">
                  Allow people to make offers
                </p>
                
                {formData.saleType === 'offers' && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <Label htmlFor="minimumOffer" className="text-white">
                          Minimum Offer (optional)
                        </Label>
                        <Input
                          id="minimumOffer"
                          type="number"
                          step="0.00001"
                          min="0"
                          value={formData.minimumOffer || ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : undefined;
                            updateFormData({ minimumOffer: value });
                          }}
                          placeholder="0.00"
                          className="mt-1.5 bg-dark-card border-white/10"
                        />
                      </div>
                      
                      <div className="w-24">
                        <Label htmlFor="offerCurrency" className="text-white">
                          Currency
                        </Label>
                        <select
                          id="offerCurrency"
                          value={formData.currency}
                          onChange={(e) => updateFormData({ currency: e.target.value })}
                          className="w-full h-10 mt-1.5 rounded-md border border-white/10 bg-dark-card px-3 py-2 text-sm"
                        >
                          <option value="ETH">ETH</option>
                          <option value="MATIC">MATIC</option>
                          <option value="SOL">SOL</option>
                        </select>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 italic">
                      You can accept or decline any offers you receive.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      {/* Scheduling */}
      <div className="border-b border-white/10 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-white">Schedule Listing</h3>
          <Switch
            checked={formData.scheduledListing}
            onCheckedChange={(checked) => updateFormData({ scheduledListing: checked })}
          />
        </div>
        
        {formData.scheduledListing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-white mb-1.5 block">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-dark-card border-white/10",
                      !formData.startDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-card border border-white/10">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => updateFormData({ startDate: date })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label className="text-white mb-1.5 block">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-dark-card border-white/10",
                      !formData.endDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-card border border-white/10">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => updateFormData({ endDate: date })}
                    initialFocus
                    disabled={(date) => formData.startDate && date <= formData.startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
        
        {!formData.scheduledListing && (
          <p className="text-sm text-gray-400">
            Your NFT will be listed immediately upon creation
          </p>
        )}
      </div>
      
      {/* Royalties */}
      <div className="border-b border-white/10 pb-8">
        <h3 className="text-xl font-medium text-white mb-4">Royalties</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="royaltySlider" className="text-white">
                Royalty Percentage: {formData.royaltyPercentage}%
              </Label>
              <span className="text-sm text-gray-400">
                Max: 15%
              </span>
            </div>
            <Slider
              id="royaltySlider"
              min={0}
              max={15}
              step={0.5}
              value={[formData.royaltyPercentage]}
              onValueChange={(value) => updateFormData({ royaltyPercentage: value[0] })}
              className="py-4"
            />
            <p className="text-sm text-gray-400 mt-1">
              Royalties are paid to creators when NFTs are sold on secondary markets
            </p>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <h4 className="font-medium text-white mb-3 flex items-center">
              <Clock className="mr-2" size={18} />
              Sales Fee Breakdown
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Creator Royalty</span>
                <span className="text-white font-medium">{royaltyBreakdown.creatorRoyalty}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Marketplace Fee</span>
                <span className="text-white font-medium">{royaltyBreakdown.marketplaceFee}%</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Seller Receives</span>
                  <span className="text-green-400 font-medium">{royaltyBreakdown.sellerReceives}%</span>
                </div>
              </div>
            </div>
            
            {/* Visual representation */}
            <div className="mt-4">
              <div className="w-full h-6 rounded-full overflow-hidden flex">
                <div
                  className="bg-neon-purple h-full"
                  style={{ width: `${royaltyBreakdown.creatorRoyalty}%` }}
                />
                <div
                  className="bg-gray-500 h-full"
                  style={{ width: `${royaltyBreakdown.marketplaceFee}%` }}
                />
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${royaltyBreakdown.sellerReceives}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blockchain */}
      <div>
        <h3 className="text-xl font-medium text-white mb-4">Blockchain</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BLOCKCHAINS.map((blockchain) => (
              <div 
                key={blockchain.value}
                onClick={() => updateFormData({ blockchain: blockchain.value as any })}
                className={`p-4 rounded-lg border ${formData.blockchain === blockchain.value ? 'border-neon-purple bg-neon-purple/10' : 'border-white/10'} cursor-pointer hover:border-white/30 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{blockchain.icon}</span>
                  <div>
                    <p className="font-medium text-white">{blockchain.label}</p>
                    <p className="text-xs text-gray-400">{blockchain.fee}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Advanced Settings */}
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-white">Advanced Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Lazy Minting</p>
                <p className="text-sm text-gray-400">
                  Defer gas costs until the NFT is purchased
                </p>
              </div>
              <Switch
                checked={formData.lazyMint}
                onCheckedChange={(checked) => updateFormData({ lazyMint: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Freeze Metadata</p>
                <p className="text-sm text-gray-400">
                  Lock metadata to prevent future changes
                </p>
              </div>
              <Switch
                checked={formData.freezeMetadata}
                onCheckedChange={(checked) => updateFormData({ freezeMetadata: checked })}
              />
            </div>
            
            <div>
              <Label htmlFor="supply" className="text-white">
                Supply
              </Label>
              <Input
                id="supply"
                type="number"
                min="1"
                step="1"
                value={formData.supply}
                onChange={(e) => updateFormData({ supply: parseInt(e.target.value) || 1 })}
                className="mt-1.5 w-32 bg-dark-card border-white/10"
              />
              <p className="text-sm text-gray-400 mt-1">
                Number of editions to create
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StepPricing;
