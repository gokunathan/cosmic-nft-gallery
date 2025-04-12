
import React from 'react';
import { useCreateNFT } from '@/context/CreateNFTContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DISPLAY_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boost_percentage', label: 'Boost %' }
];

const COMMON_TRAITS = [
  'Background', 'Skin', 'Eyes', 'Hair', 'Mouth', 'Clothing', 
  'Accessory', 'Headwear', 'Eyewear', 'Type', 'Level', 'Rarity'
];

const StepDetails = () => {
  const { formData, updateFormData, addAttribute, updateAttribute, removeAttribute } = useCreateNFT();
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">NFT Details</h2>
        <p className="text-gray-300 mb-4">
          Add details to your NFT to help collectors discover and understand your creation.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-white">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter a name for your NFT"
            className="mt-1.5 bg-dark-card border-white/10"
            maxLength={100}
          />
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-gray-400">
              Choose a memorable name
            </p>
            <p className="text-xs text-gray-400">
              {formData.name.length}/100
            </p>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <div className="flex justify-between">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <p className="text-xs text-gray-400">
              {formData.description.length}/5000
            </p>
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Tell the story of your NFT. What makes it special? What inspired you?"
            className="mt-1.5 h-32 bg-dark-card border-white/10 resize-y"
            maxLength={5000}
          />
        </div>
        
        {/* External Link */}
        <div>
          <Label htmlFor="externalLink" className="text-white">
            External Link
          </Label>
          <Input
            id="externalLink"
            value={formData.externalLink || ''}
            onChange={(e) => updateFormData({ externalLink: e.target.value })}
            placeholder="https://yourwebsite.com/item/123"
            className="mt-1.5 bg-dark-card border-white/10"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Link to a website with more details about this item
          </p>
        </div>
        
        {/* Alternative Text */}
        <div>
          <div className="flex items-center gap-1.5">
            <Label htmlFor="alternativeText" className="text-white">
              Alternative Text
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={16} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[240px] text-sm">
                    Alternative text (alt text) helps make your NFT accessible to people using screen readers.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="alternativeText"
            value={formData.alternativeText || ''}
            onChange={(e) => updateFormData({ alternativeText: e.target.value })}
            placeholder="Describe your item for people using screen readers"
            className="mt-1.5 h-20 bg-dark-card border-white/10"
            maxLength={1000}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            This helps make your NFT accessible to more collectors
          </p>
        </div>
      </div>
      
      {/* Attributes/Properties */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-medium text-white">Properties</h3>
            <p className="text-sm text-gray-400">
              Add traits that show up as rectangles
            </p>
          </div>
          <Button
            onClick={addAttribute}
            size="sm"
            className="bg-neon-purple hover:bg-neon-purple/90"
          >
            <Plus size={16} className="mr-1" /> Add Property
          </Button>
        </div>
        
        {formData.attributes.length === 0 && (
          <div className="text-center py-8 bg-dark-card/50 border border-dashed border-white/10 rounded-lg">
            <p className="text-gray-400">
              No properties added yet. Properties show up underneath your item and are clickable filters.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {COMMON_TRAITS.slice(0, 6).map((trait) => (
                <Button
                  key={trait}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addAttribute();
                    const index = formData.attributes.length;
                    updateAttribute(index, { traitType: trait, value: '', displayType: 'string' });
                  }}
                  className="text-xs"
                >
                  {trait}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {formData.attributes.map((attribute, index) => (
          <div 
            key={index} 
            className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4 p-4 bg-black/30 rounded-lg border border-white/10"
          >
            <div className="md:col-span-3">
              <Label htmlFor={`attributeType${index}`} className="text-gray-300 text-sm">
                Type
              </Label>
              <Input
                id={`attributeType${index}`}
                value={attribute.traitType}
                onChange={(e) => updateAttribute(index, { traitType: e.target.value })}
                placeholder="E.g. Color, Size"
                className="mt-1 bg-dark-card border-white/10"
                list={`commonTraits${index}`}
              />
              <datalist id={`commonTraits${index}`}>
                {COMMON_TRAITS.map((trait) => (
                  <option key={trait} value={trait} />
                ))}
              </datalist>
            </div>
            
            <div className="md:col-span-3">
              <Label htmlFor={`attributeValue${index}`} className="text-gray-300 text-sm">
                Value
              </Label>
              <Input
                id={`attributeValue${index}`}
                value={attribute.value}
                onChange={(e) => updateAttribute(index, { value: e.target.value })}
                placeholder="E.g. Blue, Large"
                className="mt-1 bg-dark-card border-white/10"
              />
            </div>
            
            <div className="md:col-span-1">
              <Label htmlFor={`attributeType${index}`} className="text-gray-300 text-sm">
                Display Type
              </Label>
              <select
                value={attribute.displayType}
                onChange={(e) => updateAttribute(index, { displayType: e.target.value as any })}
                className="w-full h-10 mt-1 rounded-md border border-white/10 bg-dark-card px-3 py-2 text-sm"
              >
                {DISPLAY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end justify-end md:col-span-1">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeAttribute(index)}
                className="h-10 w-10"
              >
                <Minus size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Unlockable Content */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-medium text-white">Unlockable Content</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle size={16} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[240px] text-sm">
                    Unlockable content is only visible to the owner of this NFT.
                    It could be a high-res file, secret link, or special message.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            checked={formData.hasUnlockableContent}
            onCheckedChange={(checked) => updateFormData({ hasUnlockableContent: checked })}
          />
        </div>
        
        {formData.hasUnlockableContent && (
          <div className="mt-4">
            <Textarea
              value={formData.unlockableContent || ''}
              onChange={(e) => updateFormData({ unlockableContent: e.target.value })}
              placeholder="Include unlockable content only the owner can view. URLs, download links, passcodes, contact info, etc."
              className="h-32 bg-dark-card border-white/10"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              This content will be encrypted and only revealed to the owner of the NFT
            </p>
          </div>
        )}
        
        {!formData.hasUnlockableContent && (
          <div className="text-center py-6 bg-dark-card/50 border border-dashed border-white/10 rounded-lg">
            <p className="text-gray-400">
              Add unlockable content that only reveals to the owner. 
              This could include high-resolution files, secret links, or special messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepDetails;
