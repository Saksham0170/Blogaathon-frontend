import React from 'react';
import { XIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubmitPopupProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const SubmitPopup: React.FC<SubmitPopupProps> = ({ onConfirm, onCancel }) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="w-[80%] max-w-[27rem] rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle size={48} className="text-yellow-500" />
        </div>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-[#28456f]  text-center mb-4">
            Confirm Submission
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed text-center">
            Are you sure you want to submit your blog? Once submitted, you won&apos;t be able to edit the content.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-3 mt-6">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onCancel}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          
          <Button 
            className="w-full bg-[#28456f] hover:bg-[#4672af]" 
            onClick={onConfirm}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Blog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitPopup;