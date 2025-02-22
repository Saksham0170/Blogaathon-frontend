"use client";

import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import RegistrationSuccessModal from '@/components/SuccessRegister';
import axios from 'axios';
import { z } from 'zod';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/Loading';
import Cookies from 'js-cookie';
// Validation Schema
const RegisterSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().regex(
    /^\+[1-9]\d{1,3}\d{10}$/,
    { message: "Phone number must include country code and 10-digit number" }
  ),
  currentRole: z.string(),
  otherRole: z.string().optional(),
  organizationName: z.string().min(1, { message: "Organization/Institution Name is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  city: z.string().min(1, { message: "City/State is required" })
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

const industryOptions = [
  'Higher Education',
  'Civilian Government',
  'Health Provider',
  'Media & Telco',
  'Nonprofit',
  'Professional Services',
  'Retailers',
  'Forestry & Fishing',
  'Local Regional Government',
  'Travel & Transportation',
  'Chemicals & Agrochemicals',
  'Discrete Manufacturing',
  'Insurance',
  'Banking & Capital Markets',
  'Power & Utilities',
  'Consumer Goods',
  'Defense & Intelligence',
  'Health Payor',
  'Mining, Oil & Gas',
  'Partner Professional Services',
  'Pharmaceuticals',
  'Primary & Secondary Edu/K-12',
  'Other - Unsegmented',
  'Other Services'
];

export default function Page() {
  const { user, loading } = useAuth();
 const [photoUrl, setPhotoUrl] = useState('');  
  // console.log(user)
  const [name] = useState('');
  const [email] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: name?name : 'NA',
    email: email?email : 'NA',
    phoneNumber: '',
    currentRole: 'Student',
    organizationName: '',
    industry: '',
    city: '',
    otherRole: ''
  });
const token = Cookies.get('token');
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isOtherRole, setIsOtherRole] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: undefined }));
    if (name === 'currentRole') {
      setIsOtherRole(value === 'Other');
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Inside your component
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  

    try {
      // Validate form data
      RegisterSchema.parse(formData);

      // Disable submit button during submission
      setIsSubmitting(true);
      console.log(formData);
      const newFormData = {...formData, photoUrl: photoUrl};
      console.log(newFormData);

      // API call to submit registration
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, 
        newFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

      // If API call is successful
      if (response.status===201) {
        // Open success modal

        //set the global user state
        setIsSuccessModalOpen(true);

        // Show success toast
        toast.success(response.data.message || 'Registration Successful!', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#4caf50',
            color: 'white',
            fontWeight: 'bold',
          },
        });

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          currentRole: 'Student',
          organizationName: '',
          industry: '',
          city: '',
          otherRole: '',
        });
        setErrors({});
        setIsOtherRole(false);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        const status = error.response?.status;

        if (status === 400) {
          toast.error('Email Already Exists', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#e74c3c',
              color: 'white',
              fontWeight: 'bold',
            },
          });
        } else {
          toast.error('Registration failed', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#e74c3c',
              color: 'white',
              fontWeight: 'bold',
            },
          });
        }
      }
      else if (error instanceof z.ZodError) {
        const errorMap = error.flatten().fieldErrors;
        const formattedErrors: Partial<RegisterFormData>  = {};

        Object.keys(errorMap).forEach((key) => {
          formattedErrors[key as keyof RegisterFormData] = errorMap[key]?.[0];
        });

        setErrors(formattedErrors);

        toast.error('Please check the form for errors', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#ff4d4f',
            color: 'white',
            fontWeight: 'bold',
          },
        });
      } else if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#ff4d4f',
            color: 'white',
            fontWeight: 'bold',
          },
        });
      } else {
        toast.error('An unexpected error occurred', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#ff4d4f',
            color: 'white',
            fontWeight: 'bold',
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  }



  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || ''
      }));
      setPhotoUrl(user.photoURL || '');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />
  }
  else {

    return (
      <>    <div className='bg-[url("/why-participate-bg.png")] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center p-4 py-8'>
        {/* Toast Notifications */}
        <Toaster />
        <RegistrationSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
        />
        <div className='bg-white/90 rounded-xl shadow-lg w-full max-w-2xl p-10'>
          <h2 className='text-3xl font-bold text-center mb-8 text-[#28456f]'>
            Additional Details
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Full Name */}
            <div>
              <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-2'>
                Full Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50  transition duration-300'

              />
              {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                disabled={true}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50  transition duration-300'

              />
              {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-2'>
                Phone Number <span className='text-red-500'>*</span>
              </label>
              <input
                type='tel'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50 transition duration-300'
                placeholder='+91XXXXXXXXXX'
                required
              />
              {errors.phoneNumber && <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>}
            </div>

            {/* Current Role */}
            <div>
              <label htmlFor='currentRole' className='block text-sm font-medium text-gray-700 mb-2'>
                Current Role <span className='text-red-500'>*</span>
              </label>
              <select
                id='currentRole'
                name='currentRole'
                value={formData.currentRole}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50 transition duration-300'
                required
              >
                <option value='Student'>Student</option>
                <option value='Working Professional'>Working Professional</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Other Role Input (Conditional) */}
            {isOtherRole && (
              <div>
                <label htmlFor='otherRole' className='block text-sm font-medium text-gray-700 mb-2'>
                  Specify Your Role
                </label>
                <input
                  type='text'
                  id='otherRole'
                  name='otherRole'
                  value={formData.otherRole || ''}
                  onChange={handleChange}
                  required={true}
                  className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50 transition duration-300'
                />
              </div>
            )}

            {/* Organization/Institution Name */}
            <div>
              <label htmlFor='organizationName' className='block text-sm font-medium text-gray-700 mb-2'>
                Organization/Institution Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='organizationName'
                name='organizationName'
                value={formData.organizationName}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50 transition duration-300'
                required
              />
              {errors.organizationName && <p className='text-red-500 text-xs mt-1'>{errors.organizationName}</p>}
            </div>

            {/* Industry */}
            <div>
              <label htmlFor='industry' className='block text-sm font-medium text-gray-700 mb-2'>
                Industry <span className='text-red-500'>*</span>
              </label>
              <select
                id='industry'
                name='industry'
                value={formData.industry}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50 transition duration-300'
                required
              >
                <option value=''>Select Industry</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && <p className='text-red-500 text-xs mt-1'>{errors.industry}</p>}
            </div>

            {/* City/State */}
            <div>
              <label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-2'>
                City / State <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='city'
                name='city'
                value={formData.city}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-[#28456f]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28456f]/50 transition duration-300'
                required
              />
              {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
            </div>
            <div className='flex gap-3 items-start justify-center'>
              <input
                type="checkbox"
                className='w-3 h-3 mt-2 rounded-2xl'
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <p>I would like information, tips, and offers about Microsoft products and services. <a href="https://go.microsoft.com/fwlink/?LinkId=521839" className='text-[#28456f] font-semibold'>Privacy Statement</a></p>
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <button
                type='submit'
                disabled={isSubmitting || !isChecked}
                className={`w-full bg-[#28456f] text-white font-semibold py-3 rounded-lg transition-colors duration-300 text-lg
        ${(isSubmitting || !isChecked) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4672af]'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
        <Footer />
      </>

    );
  }
}