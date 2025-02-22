import React from 'react';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const checkAndRedirect = async () => {  
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
  
      if (!token) {
        router.push('/login');
        return;
      }
   
      const { data } = await axiosInstance.post('/api/getRole/', { token });
      
      if (data.role === 'user') {
        setCookie('UserToken', token, 1);
        if (data.isFormFilled) {
          router.push('/dashboard/user');
        } else {
          router.push('/login');
        }
      } else if (data.role === 'judge') {
        setCookie('JudgeToken', token, 1);
        router.push('/dashboard/judge');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Error in checkAndRedirect:", error);
      router.push('/login');
    }
  };
  

  const handleExplore =async () => {
     await checkAndRedirect();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-[80%] max-w-[27rem] md:w-full p-8 text-center relative 
        animate-popup transform transition-all duration-300 ease-out origin-center" 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#28456f] mb-4">
            Registration Successful!
          </h2>
          
          <p className="text-gray-600 leading-relaxed ">
            Your profile is created, and you&apos;re all set for the Azure Blogathon. Stay tuned for updates via email and don&apos;t forget to follow us on social media for the latest news and tips.
          </p>
        </div>
        
        <button 
          onClick={handleExplore}
          className="w-full bg-[#28456f] text-white font-semibold py-3 rounded-lg hover:bg-[#4672af] transition-colors duration-300 text-lg flex items-center justify-center space-x-2"
        >
          <Home size={20} />
          <span>Go To Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal;