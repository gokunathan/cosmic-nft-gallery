
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type FileType = 'image' | 'video' | 'audio' | '3d';

export interface AssetPreview {
  id: string;
  file: File;
  fileType: FileType;
  previewUrl: string;
  name: string;
  size: number;
}

export interface NFTAttribute {
  traitType: string;
  value: string;
  displayType: 'string' | 'number' | 'date' | 'boost_percentage';
}

export interface CollectionOption {
  id: string;
  name: string;
  image: string;
  floorPrice: number;
  itemCount: number;
  verified: boolean;
}

export interface NewCollection {
  name: string;
  symbol: string;
  description: string;
  logoFile?: File;
  logoPreview?: string;
  bannerFile?: File;
  bannerPreview?: string;
  categories: string[];
}

export interface AuctionDetails {
  startingPrice: number;
  reservePrice?: number;
  duration: number; // in days
}

export interface RoyaltySplit {
  address: string;
  percentage: number;
}

export type NFTCreationStep = 'upload' | 'details' | 'collection' | 'pricing' | 'review';

export interface NFTFormData {
  // Asset Information
  assetFiles: File[];
  assetPreviews: AssetPreview[];
  
  // Basic Details
  name: string;
  description: string;
  externalLink?: string;
  alternativeText?: string;
  
  // Attributes
  attributes: NFTAttribute[];
  
  // Unlockable Content
  hasUnlockableContent: boolean;
  unlockableContent?: string;
  
  // Collection
  collectionType: 'existing' | 'new';
  existingCollectionId?: string;
  newCollection?: NewCollection;
  
  // Sales Information
  saleType: 'fixed' | 'auction' | 'offers';
  price?: number;
  currency: string;
  auctionDetails?: AuctionDetails;
  minimumOffer?: number;
  
  // Schedule
  scheduledListing: boolean;
  startDate?: Date;
  endDate?: Date;
  
  // Royalties
  royaltyPercentage: number;
  splitRoyalties: boolean;
  royaltySplits: RoyaltySplit[];
  
  // Blockchain
  blockchain: 'ethereum' | 'polygon' | 'solana';
  lazyMint: boolean;
  freezeMetadata: boolean;
  supply: number;
}

const defaultFormData: NFTFormData = {
  assetFiles: [],
  assetPreviews: [],
  name: '',
  description: '',
  attributes: [],
  hasUnlockableContent: false,
  collectionType: 'existing',
  saleType: 'fixed',
  currency: 'ETH',
  scheduledListing: false,
  royaltyPercentage: 10,
  splitRoyalties: false,
  royaltySplits: [],
  blockchain: 'ethereum',
  lazyMint: false,
  freezeMetadata: false,
  supply: 1
};

interface CreateNFTContextType {
  formData: NFTFormData;
  currentStep: NFTCreationStep;
  setCurrentStep: (step: NFTCreationStep) => void;
  updateFormData: (updates: Partial<NFTFormData>) => void;
  addAssetFile: (file: File) => void;
  removeAssetFile: (id: string) => void;
  addAttribute: () => void;
  updateAttribute: (index: number, update: Partial<NFTAttribute>) => void;
  removeAttribute: (index: number) => void;
  isStepComplete: (step: NFTCreationStep) => boolean;
  saveDraft: () => void;
  loadDraft: () => boolean;
  resetForm: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const CreateNFTContext = createContext<CreateNFTContextType | undefined>(undefined);

export const CreateNFTProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<NFTFormData>({...defaultFormData});
  const [currentStep, setCurrentStep] = useState<NFTCreationStep>('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<NFTFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addAssetFile = async (file: File) => {
    try {
      let fileType: FileType = 'image';
      if (file.type.startsWith('video/')) fileType = 'video';
      else if (file.type.startsWith('audio/')) fileType = 'audio';
      else if (file.type.includes('gltf') || file.type.includes('glb')) fileType = '3d';
      
      const previewUrl = URL.createObjectURL(file);
      
      const newPreview: AssetPreview = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        fileType,
        previewUrl,
        name: file.name,
        size: file.size
      };
      
      setFormData(prev => ({
        ...prev,
        assetFiles: [...prev.assetFiles, file],
        assetPreviews: [...prev.assetPreviews, newPreview]
      }));
    } catch (error) {
      console.error('Error adding file:', error);
      toast.error('Failed to process file', { 
        description: 'There was an error processing your file. Please try again.' 
      });
    }
  };
  
  const removeAssetFile = (id: string) => {
    setFormData(prev => {
      const previewIndex = prev.assetPreviews.findIndex(p => p.id === id);
      if (previewIndex === -1) return prev;
      
      const newPreviews = [...prev.assetPreviews];
      const removedPreview = newPreviews.splice(previewIndex, 1)[0];
      
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(removedPreview.previewUrl);
      
      const newFiles = prev.assetFiles.filter(f => f !== removedPreview.file);
      
      return {
        ...prev,
        assetFiles: newFiles,
        assetPreviews: newPreviews
      };
    });
  };
  
  const addAttribute = () => {
    const newAttribute: NFTAttribute = {
      traitType: '',
      value: '',
      displayType: 'string'
    };
    
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute]
    }));
  };
  
  const updateAttribute = (index: number, update: Partial<NFTAttribute>) => {
    setFormData(prev => {
      const newAttributes = [...prev.attributes];
      newAttributes[index] = { ...newAttributes[index], ...update };
      return { ...prev, attributes: newAttributes };
    });
  };
  
  const removeAttribute = (index: number) => {
    setFormData(prev => {
      const newAttributes = [...prev.attributes];
      newAttributes.splice(index, 1);
      return { ...prev, attributes: newAttributes };
    });
  };
  
  const isStepComplete = (step: NFTCreationStep): boolean => {
    switch (step) {
      case 'upload':
        return formData.assetPreviews.length > 0;
        
      case 'details':
        return !!formData.name && formData.name.trim().length >= 3;
        
      case 'collection':
        if (formData.collectionType === 'existing') {
          return !!formData.existingCollectionId;
        } else {
          return !!formData.newCollection?.name && 
                 !!formData.newCollection?.symbol;
        }
        
      case 'pricing':
        if (formData.saleType === 'fixed') {
          return !!formData.price && formData.price > 0;
        } else if (formData.saleType === 'auction') {
          return !!formData.auctionDetails?.startingPrice && 
                 formData.auctionDetails.startingPrice > 0 &&
                 !!formData.auctionDetails.duration;
        }
        return true; // For 'offers' type
        
      case 'review':
        return isStepComplete('upload') && 
               isStepComplete('details') && 
               isStepComplete('collection') && 
               isStepComplete('pricing');
               
      default:
        return false;
    }
  };
  
  const saveDraft = () => {
    try {
      // Save everything except the actual file objects which can't be serialized
      const draftData = {
        ...formData,
        assetFiles: [], // Can't serialize File objects
        assetPreviews: formData.assetPreviews.map(preview => ({
          ...preview,
          file: null // Remove File object
        }))
      };
      
      localStorage.setItem('nftDraft', JSON.stringify(draftData));
      localStorage.setItem('nftDraftStep', currentStep);
      localStorage.setItem('nftDraftTimestamp', new Date().toISOString());
      
      toast.success('Draft saved', {
        description: 'Your progress has been saved. You can resume later.'
      });
      
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft', {
        description: 'There was an error saving your progress.'
      });
      return false;
    }
  };
  
  const loadDraft = () => {
    try {
      const draftJson = localStorage.getItem('nftDraft');
      const draftStep = localStorage.getItem('nftDraftStep') as NFTCreationStep;
      
      if (!draftJson) return false;
      
      const draftData = JSON.parse(draftJson);
      
      // Note: This will load the draft without the actual files
      // In a real implementation, you'd need to re-upload or use stored references
      
      setFormData({
        ...defaultFormData,
        ...draftData
      });
      
      if (draftStep) {
        setCurrentStep(draftStep);
      }
      
      toast.info('Draft loaded', {
        description: 'Your saved progress has been restored.'
      });
      
      return true;
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft', {
        description: 'There was an error restoring your progress.'
      });
      return false;
    }
  };
  
  const resetForm = () => {
    // Revoke any object URLs to prevent memory leaks
    formData.assetPreviews.forEach(preview => {
      URL.revokeObjectURL(preview.previewUrl);
    });
    
    setFormData({...defaultFormData});
    setCurrentStep('upload');
    localStorage.removeItem('nftDraft');
    localStorage.removeItem('nftDraftStep');
    localStorage.removeItem('nftDraftTimestamp');
  };
  
  const handleSubmit = async () => {
    // In a real implementation, this would:
    // 1. Upload files to IPFS or storage
    // 2. Create metadata JSON
    // 3. Call smart contract for minting
    // 4. Update database
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('NFT Created Successfully!', {
        description: 'Your NFT has been created and is now listed on the marketplace.'
      });
      
      resetForm();
      // In a real app, you would redirect to the new NFT page here
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT', {
        description: 'There was an error during the creation process. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateNFTContext.Provider value={{
      formData,
      currentStep,
      setCurrentStep,
      updateFormData,
      addAssetFile,
      removeAssetFile,
      addAttribute,
      updateAttribute,
      removeAttribute,
      isStepComplete,
      saveDraft,
      loadDraft,
      resetForm,
      handleSubmit,
      isSubmitting
    }}>
      {children}
    </CreateNFTContext.Provider>
  );
};

export const useCreateNFT = () => {
  const context = useContext(CreateNFTContext);
  if (context === undefined) {
    throw new Error('useCreateNFT must be used within a CreateNFTProvider');
  }
  return context;
};
