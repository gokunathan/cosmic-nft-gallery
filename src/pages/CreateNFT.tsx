
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateNFTProvider, useCreateNFT, NFTCreationStep } from '@/context/CreateNFTContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepUpload from '@/components/create-nft/StepUpload';
import StepDetails from '@/components/create-nft/StepDetails';
import StepCollection from '@/components/create-nft/StepCollection';
import StepPricing from '@/components/create-nft/StepPricing';
import StepReview from '@/components/create-nft/StepReview';
import NFTPreview from '@/components/create-nft/NFTPreview';
import { Check, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const steps: { id: NFTCreationStep; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'details', label: 'Details' },
  { id: 'collection', label: 'Collection' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'review', label: 'Review' }
];

const CreateNFTContent = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    isStepComplete,
    saveDraft,
    handleSubmit,
    isSubmitting
  } = useCreateNFT();
  
  const navigate = useNavigate();

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    } else {
      // If on first step, confirm before navigating away
      if (window.confirm('Are you sure you want to leave? Any unsaved progress will be lost.')) {
        navigate(-1);
      }
    }
  };

  const handleNext = () => {
    if (!isStepComplete(currentStep)) {
      toast.error('Please complete this step', {
        description: 'Some required fields are missing or invalid.'
      });
      return;
    }

    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    toast.success('Draft saved', {
      description: 'Your NFT creation progress has been saved.'
    });
  };

  // Function to integrate newly created NFTs with the platform
  const handleSuccessfulCreation = (newNftData) => {
    // Add to global NFT registry for Explore page visibility
    console.log('Integrating new NFT into platform:', newNftData);
    
    // Ensure the NFT appears in the collections view if it belongs to a collection
    if (newNftData.collectionId) {
      // In a real application, this would update a database or call an API
      console.log(`Adding NFT to collection: ${newNftData.collectionId}`);
    }
    
    // Add to user's created NFTs
    console.log(`Adding NFT to user's created items`);
    
    // Redirect to the NFT detail page after successful creation
    navigate(`/nft/${newNftData.id}`);
    
    // Show success message with helpful next steps
    toast.success('NFT Created Successfully', {
      description: 'Your new NFT is now live and visible in the marketplace!'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-dark-card to-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1 mt-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Create New NFT</h1>
          <p className="text-gray-300">Express your creativity and mint your digital asset</p>
        </div>
        
        {/* Progress steps */}
        <div className="mb-8">
          <div className="hidden md:flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex flex-col items-center ${currentStep === step.id ? 'text-neon-purple' : isStepComplete(step.id) ? 'text-green-500' : 'text-gray-400'}`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2
                    ${currentStep === step.id ? 'border-neon-purple bg-dark text-white' : 
                      isStepComplete(step.id) ? 'border-green-500 bg-green-500/20 text-white' : 'border-gray-600 text-gray-400'}`}
                  >
                    {isStepComplete(step.id) ? (
                      <Check size={18} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${isStepComplete(step.id) ? 'bg-green-500' : 'bg-gray-600'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Mobile tabs */}
          <div className="md:hidden">
            <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as NFTCreationStep)}>
              <TabsList className="grid grid-cols-5 w-full">
                {steps.map((step) => (
                  <TabsTrigger 
                    key={step.id} 
                    value={step.id}
                    disabled={!isStepComplete(steps[steps.findIndex(s => s.id === step.id) - 1]?.id) && step.id !== 'upload'}
                    className="text-xs"
                  >
                    {isStepComplete(step.id) ? <Check size={16} /> : step.label.charAt(0)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form content */}
          <div className="lg:w-2/3 space-y-6">
            {currentStep === 'upload' && <StepUpload />}
            {currentStep === 'details' && <StepDetails />}
            {currentStep === 'collection' && <StepCollection />}
            {currentStep === 'pricing' && <StepPricing />}
            {currentStep === 'review' && <StepReview />}
            
            <div className="flex justify-between pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                {steps.findIndex(step => step.id === currentStep) === 0 ? 'Cancel' : 'Back'}
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Draft
                </Button>
                
                {currentStep === 'review' ? (
                  <Button 
                    onClick={() => {
                      handleSubmit().then(newNftData => {
                        if (newNftData) {
                          handleSuccessfulCreation(newNftData);
                        }
                      });
                    }}
                    disabled={!isStepComplete('review') || isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-neon-purple to-neon-blue"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create NFT
                        <Check size={16} />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    disabled={!isStepComplete(currentStep)}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Preview panel */}
          <div className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-white/10 p-4 bg-black/30 backdrop-blur-sm">
              <h2 className="font-medium text-white mb-4">Preview</h2>
              <NFTPreview />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const CreateNFT = () => {
  return (
    <CreateNFTProvider>
      <CreateNFTContent />
    </CreateNFTProvider>
  );
};

export default CreateNFT;
