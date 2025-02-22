'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import { createUserWithEmailAndPassword ,sendEmailVerification} from "firebase/auth";
import { auth } from "@/app/firebase";
import { FirebaseError } from 'firebase/app';
import axiosInstance from '@/lib/axios';

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

// Zod validation schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
});

// Combine schema with password match validation
const validationSchema = signUpSchema.refine(
  (data) => data.password === data.confirmPassword, 
  { 
    message: "Passwords do not match", 
    path: ["confirmPassword"] 
}
);

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { signInWithGithub, signInWithMicrosoft } = useAuth();


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
        if (data.isFormFilled) {
          router.push('/dashboard');
        } else {
          router.push('/additionalDetails');
        }
      } else if (data.role === 'judge') {
        setCookie('JudgeToken', token, 1);
        router.push('/judgeDashboard');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Error in checkAndRedirect:", error);
      router.push('/login');
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = validationSchema.parse({
        email,
        password,
        confirmPassword
      });

      setErrors({});

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        validatedData.email, 
        validatedData.password
      );

      await sendEmailVerification(userCredential.user);
      toast.success('Verification email sent. Please check your inbox.');

      const interval = setInterval(async () => {
        await userCredential.user.reload();
        if (userCredential.user.emailVerified) {
          clearInterval(interval);
          
          const token = await userCredential.user.getIdToken();
          sessionStorage.setItem("token", token);
          setCookie("token", token);

          try {
            const { data } = await axiosInstance.post('/api/getRole/', { token });
            
            if (data.role === 'user') {
              if (data.isAdmin) {
                setCookie('AdminToken', token);
                setCookie('role', 'admin');
                router.push('/dashboard/organizer');
              } else if (data.isFormFilled) {
                setCookie('UserToken', token);
                setCookie('role', 'user');
                router.push('/dashboard/user');
              } else {
                router.push('/additionalDetails');
              }
            } else if (data.role === 'judge') {
              setCookie('JudgeToken', token);
              setCookie('role', 'judge');
              router.push('/dashboard/judge');
            } else {
              router.push('/login');
              toast.error('Unexpected user role');
            }
          } catch (error) {
            console.error('Error checking user role:', error);
            router.push('/login');
            toast.error('Error processing your account');
          }

          toast.success('Email verified successfully! Redirecting...');
        }
      }, 2000);
    } catch (error:unknown) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errorDetails: {
          email?: string;
          password?: string;
          confirmPassword?: string;
        } = {};

        error.errors.forEach((err) => {
          if (err.path.includes('email')) errorDetails.email = err.message;
          if (err.path.includes('password')) errorDetails.password = err.message;
          if (err.path.includes('confirmPassword')) errorDetails.confirmPassword = err.message;
        });

        setErrors(errorDetails);
        toast.error('Please correct the form errors');
      } 
      // Handle Firebase authentication errors
      else if (error instanceof Error) {
        console.error("Firebase Sign Up Error:", error);

        // Common Firebase error handling
        switch ((error as FirebaseError).code) {
          case 'auth/email-already-in-use':
            toast.error('Email is already registered. Try logging in instead.');
            break;
          case 'auth/invalid-email':
            toast.error('Invalid email address.');
            break;
          case 'auth/weak-password':
            toast.error('Password is too weak.');
            break;
          default:
            toast.error('Sign up failed. Please try again.');
        }
      }
    }
  };


  // Rest of the component remains the same as in the previous implementation
  const handleSignInWithGithub = async () => {
    try {
      const result = await signInWithGithub();
      console.log(result);
      const token = sessionStorage.getItem("token");
      if (token) {
        setCookie("token", token);
      }
      checkAndRedirect();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleSignInWithMicrosoft = async () => {
    try {
      const result = await signInWithMicrosoft();
      console.log(result);
      const token = sessionStorage.getItem("token");
      if (token) {
        setCookie("token", token);
      }
      checkAndRedirect();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Toaster />
      <div className="flex gap-10 w-full max-w-6xl justify-center items-center bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="hidden md:block w-1/2 h-[400px]">
          <Image
            src="/login.png"
            alt="AI and City"
            width={500}
            height={500}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-6 md:w-1/2">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-[#28456f]">
              Register Now
            </h1>
          </div>
          
          <form onSubmit={handleEmailSignUp} className="space-y-4 w-full max-w-sm">
            <div>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full bg-[#28456f] hover:bg-[#28456f] text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              Sign Up
            </Button>
          </form>

          <div className="w-full max-w-sm">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 w-full max-w-sm">
            <Button
              onClick={handleSignInWithGithub}
              className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Sign Up with GitHub</span>
            </Button>

            <Button
              onClick={handleSignInWithMicrosoft}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-lg transition-all duration-200 border border-gray-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>Sign Up with Microsoft</span>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an Account? {' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>

          <Link 
            href="https://id8devhub.com"
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={491 / 4}
              height={94 / 4}
              viewBox="0 0 491 94"
              fill="none"
            >
              <g clipPath="url(#devhub-logo)">
                <path
                  d="M13.404 74.746q.002 1.5-1.5 1.499H1.5q-1.5.001-1.5-1.5V18.223q-.002-1.501 1.5-1.5h10.405q1.5-.001 1.499 1.5zm10.435 1.499q-1.501.001-1.5-1.5V18.223q-.001-1.501 1.5-1.5h20.477c13.322 0 23.557 5.997 23.557 23.224V53.18c0 17.315-10.242 23.06-23.557 23.06H23.839zm11.904-12.572h8.743c6.412 0 9.656-2.998 9.656-9.908V39.278c0-6.91-3.244-10.071-9.656-10.071h-8.743zm60.074 13.655c-13.737 0-22.473-6.991-22.473-18.978 0-5.996 2.828-11.236 7.993-13.819-3.994-2.998-6.33-7.243-6.33-12.238 0-9.492 8.156-16.647 20.81-16.647s20.811 7.073 20.811 16.647c0 4.995-2.248 9.24-6.242 12.238 5.159 2.665 7.911 7.823 7.911 13.82 0 11.986-8.66 18.977-22.473 18.977zm0-11.57c5.827 0 9.322-2.998 9.322-7.578 0-4.579-3.495-7.161-9.322-7.161s-9.322 2.664-9.322 7.161c0 4.498 3.578 7.578 9.322 7.578m0-25.56c5.247 0 8.409-2.583 8.409-6.91 0-3.993-3.162-6.412-8.409-6.412-5.246 0-8.326 2.412-8.326 6.412 0 4.327 3.08 6.91 8.326 6.91"
                  fill="#D91F3D"
                />
                 <path
                  d="M194.297 16.698c1.959 0 3.162 1.543 3.584 4.623.416.869 1.329 1.499 2.702 1.87 2.293.334 3.414 1.418 3.414 3.25v40.211c0 1.96-1.543 3.162-4.579 3.622-.876.416-1.499 1.335-1.871 2.702-.378 2.293-1.455 3.414-3.25 3.414h-29.724c-2.04-.29-3.042-1.329-3.042-3.124V19.733c.29-2.04 1.291-3.08 3.042-3.08l29.724.038zm-23.771 45.041c0 3.414.831 5.115 2.538 5.115 0 .252 1.039.415 3.08.504h13.24c3.414 0 5.121-.876 5.121-2.583.252 0 .415-.995.497-3.036V31.35c0-3.415-.831-5.122-2.538-5.122 0-.245-1.039-.415-3.08-.497h-13.24c-3.414 0-5.121.875-5.121 2.576-.252 0-.415 1.002-.497 3.042zm78.884-45.212c2.041.29 3.08 1.336 3.08 3.124v2.879c-.29 2.04-1.329 3.08-3.118 3.08H224.6c-3.414 0-5.121.875-5.121 2.582-.252 0-.416.996-.498 3.036v4.957c0 3.408.832 5.115 2.538 5.115 0 .29 1.04.46 3.081.504h24.772c2.041.29 3.08 1.329 3.08 3.118v3.08c-.29 2.04-1.329 3.08-3.124 3.08h-24.773c-3.413 0-5.12.831-5.12 2.538-.252 0-.416 1.04-.504 3.08v4.951c0 3.414.831 5.12 2.538 5.12 0 .253 1.039.416 3.08.498h24.773c2.041.29 3.08 1.336 3.08 3.124v2.873c-.29 2.04-1.329 3.08-3.118 3.08h-29.686c-1.958 0-3.168-1.543-3.584-4.617-.415-.876-1.329-1.5-2.702-1.87-2.292-.335-3.414-1.418-3.414-3.251V26.391c0-1.952 1.544-3.162 4.58-3.622.875-.415 1.499-1.329 1.87-2.702.378-2.293 1.455-3.414 3.25-3.414l29.806-.126zm18.272.089c2.041.29 3.042 1.329 3.042 3.124v34.97c0 3.622 1.247 5.455 3.748 5.455 1.209 0 2.205 1.039 2.998 3.08 0 2.626 1.833 3.911 5.455 3.911s5.454-1.291 5.454-3.911c.668-1.827 1.455-2.747 2.375-2.747 2.702-.541 4.082-1.625 4.082-3.25.207 0 .333-.831.333-2.538V19.733c.29-2.04 1.292-3.08 3.043-3.08h2.916c2.041.29 3.042 1.336 3.042 3.125v39.876c0 1.96-1.625 3.206-4.913 3.792-.623.12-1.373 1.745-2.204 4.87-.624.667-2.205 1.372-4.787 2.078-.416.29-1.04 1.87-1.833 4.742-.876.794-1.751 1.21-2.583 1.21h-9.826c-1.958 0-3.161-1.581-3.577-4.787 0-.668-1.084-1.33-3.25-2.04-1.789 0-2.917-1.582-3.37-4.788-.416-.875-1.329-1.499-2.702-1.87-2.293-.334-3.414-1.418-3.414-3.25V19.732c.29-2.04 1.291-3.08 3.042-3.08l2.954-.037z"
                  fill="currentColor"
                />
                <path
                  d="M317.757 16.653c2.041.29 3.036 1.336 3.036 3.125v16.527c0 3.414.832 5.121 2.539 5.121 0 .29 1.039.46 3.08.498h13.24c3.369 0 5.076-.832 5.076-2.539.29 0 .46-1.039.542-3.08V19.778c.29-2.041 1.291-3.08 3.036-3.08h2.872c2.041.29 3.08 1.335 3.08 3.124V73.36c-.29 2.041-1.329 3.08-3.118 3.08h-2.872c-2.041-.29-3.042-1.335-3.042-3.124V56.79c0-3.414-.876-5.121-2.583-5.121 0-.29-1.001-.454-3.042-.498h-13.24c-3.413 0-5.12.838-5.12 2.538-.252 0-.416 1.04-.498 3.08v16.528c-.29 2.041-1.291 3.08-3.042 3.08h-2.917c-2.04-.29-3.042-1.329-3.042-3.124v-53.54c.29-2.04 1.291-3.08 3.042-3.08zm50.035-.082c2.041.29 3.036 1.33 3.036 3.118v41.962c0 3.414.838 5.12 2.545 5.12 0 .253 1.039.416 3.08.498h13.24c3.407 0 5.114-.869 5.114-2.576.252 0 .416-1.001.504-3.042V19.689c.29-2.04 1.291-3.08 3.036-3.08h2.916c2.041.29 3.036 1.33 3.036 3.124v46.875c0 1.953-1.543 3.162-4.579 3.622-.875.415-1.499 1.329-1.871 2.702-.378 2.293-1.461 3.414-3.25 3.414H371.54c-1.959 0-3.162-1.544-3.584-4.617-.416-.876-1.329-1.5-2.702-1.871-2.293-.334-3.414-1.417-3.414-3.25V19.733c.29-2.04 1.291-3.08 3.036-3.08l2.954-.037z"
                  fill="#D91F3D"
                />
                <path
                  d="m489.998 44.128-5.48-5.48V12.956c0-1.48-.882-2.752-2.104-3.527-1.581-1.014-3.81-.737-5.102-2.242-1.253-1.462-1.058-3.584-1.977-5.21-.712-1.265-1.947-1.914-3.383-1.914h-20.011v9.454h14.727c7.961.095 7.224-.491 7.275 7.496v24.086l3.779 3.779a2.36 2.36 0 0 1 0 3.344l-3.779 3.78v24.514c-.051 7.987.686 7.4-7.275 7.495h-14.727v9.026h20.011c1.436 0 2.671-.648 3.383-1.914.913-1.632.724-3.754 1.977-5.21 1.292-1.505 3.515-1.228 5.102-2.242 1.222-.78 2.104-2.047 2.104-3.527V54.458l5.48-5.48a3.43 3.43 0 0 0 0-4.843z"
                  fill="currentColor"
                />
                <path
                  d="M165.852 9.026V0h-20.011c-1.436 0-2.671.649-3.382 1.915-.914 1.63-.725 3.754-1.978 5.209-1.291 1.505-3.515 1.228-5.102 2.242-1.222.78-2.104 2.047-2.104 3.527v25.988l-5.184 5.184a3.43 3.43 0 0 0 0 4.844l5.184 5.184V80.08c0 1.48.882 2.746 2.104 3.527 1.581 1.014 3.811.737 5.102 2.243 1.253 1.46 1.058 3.584 1.978 5.209.711 1.266 1.946 1.914 3.382 1.914h20.011V83.52h-14.726c-7.962-.094-7.225.491-7.275-7.495V51.636l-3.477-3.477a2.36 2.36 0 0 1 0-3.344l3.477-3.477V16.52c.05-7.987-.687-7.4 7.275-7.495z"
                  fill="#D91F3D"
                />
              </g>
              <defs>
                <clipPath id="devhub-logo">
                  <path fill="#fff" d="M0 0h491v93.031H0z" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}