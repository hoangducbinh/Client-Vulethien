import React from 'react';
import { createPortal } from 'react-dom';
import LottieAnimation from './LottieAnimation';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import successAnimation from '@/lottie/success.json';
import errorAnimation from '@/lottie/error.json';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, message, type }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <LottieAnimation 
            animationData={type === 'success' ? successAnimation : errorAnimation} 
            loop={false} 
            autoplay={true} 
            width={100} 
            height={100} 
          />
        </div>
        <Label className="text-gray-800 font-medium mb-6 text-center block">
          {message}
        </Label>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlertModal;