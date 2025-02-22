"use client";
import React, { useState, useEffect } from "react";
import AzureLogo from "./assets/Azure-Logo";
import Image from "next/image";
import Link from "next/link";
// import resetUserdetails from "@/user.store";
import { usePathname } from "next/navigation";
// import { useAuth } from "@/components/providers/auth-provider";
// import { routeModule } from 'next/dist/build/templates/pages'
// import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {  Toaster } from "react-hot-toast";
import useUserStore from "@/store/user.store";
// import { signOut } from 'firebase/auth'
import Cookies from "js-cookie";

const Header = () => {
  const resetUser = useUserStore((state) => state.resetUser);
  const { user, signOut } = useAuth();
  const currentPath = usePathname();
  // const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Cleanup function for router events
    return () => {
      // Clear any pending navigation or state updates
    };
  }, []);

  const getDashboardPath = () => {
    if (Cookies.get("AdminToken")) return "/dashboard/organizer";
    if (Cookies.get("JudgeToken")) return "/dashboard/judge";
    if (Cookies.get("UserToken")) return "/dashboard/user";
    return "/login";
  };

  const handleLogout = async () => {
    try {
      // Clear all cookies first
      Cookies.remove("token");
      Cookies.remove("UserToken");
      Cookies.remove("JudgeToken");
      Cookies.remove("AdminToken");
      Cookies.remove("role");

      // Reset user state
      resetUser();

      // Sign out from Firebase
      await signOut();

      // Use window.location for a full page refresh
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <Toaster />
      {/* Top Header Section */}
      <div
        id="home"
        className="flex justify-between items-center px-4 md:px-24 py-4"
      >
        <Link href="/">
          <div>
            <AzureLogo width={246} />
            <div className="hidden md:block text-[#737373] text-sm -mt-1 w-full text-right">
              Powered by ID8NXT
            </div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <div className="text-sm text-[#737373]">Sponsored by</div>
          <div>
            <Image
              src="/microsoft-logo.png"
              alt="Microsoft Logo"
              width={246}
              height={40}
            />
          </div>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="xl:hidden text-black z-50 relative"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      <div className="h-[1px] bg-[#E2E2E2] w-full"></div>

      {/* Mobile Slide-in Menu */}
      <div
        className={`
        fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        xl:hidden
      `}
      >
        <div className="flex flex-col gap-4 p-6 pt-24">
          <Link
            href="/"
            onClick={toggleMenu}
            className={`text-black px-2 py-1 ${
              currentPath === "/" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/#theme"
            onClick={toggleMenu}
            className={`text-black px-2 py-1 ${
              currentPath === "/themes-terms" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Themes & Terms
          </Link>
          <Link
            href="/#plans"
            onClick={toggleMenu}
            className={`text-black px-2 py-1 ${
              currentPath === "/#plans" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Plans
          </Link>
          <Link
            href="/winners"
            onClick={toggleMenu}
            className={`text-black px-2 py-1 ${
              currentPath === "/winners" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Winners
          </Link>
          <Link
            href="/#timeline"
            onClick={toggleMenu}
            className={`text-black px-2 py-1 ${
              currentPath === "/timeline" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/forums"
            onClick={toggleMenu}
            className={`text-black px-2 py-1 ${
              currentPath === "/forums" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Forum
          </Link>
          <Link
            href="/bloggers"
            onClick={toggleMenu}
            className={`text-black px-4 py-1 border border-black ${
              currentPath === "/bloggers-guide" ? "bg-[#BDE7FF]" : ""
            }`}
          >
            Blogger&apos;s Guide
          </Link>

          {/* Login/Logout Button */}
          <div className="mt-4">
            {!user ? (
              <Link href="/login" onClick={toggleMenu}>
                <button className="bg-black text-white px-2 py-1 w-full">
                  LOGIN / REGISTER NOW
                </button>
              </Link>
            ) : (
              <>
                <Link href={getDashboardPath()}>
                  <button className="bg-black text-white px-2 py-1 mr-2">
                    DASHBOARD
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-black text-white px-2 py-1"
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="relative bg-white hidden xl:block">
        <div className="flex justify-between font-bold items-center px-4 md:px-24 py-2 bg-white">
          <div className="flex gap-4">
            <Link
              href="/"
              className={`text-black px-2 py-1 my-1 ${
                currentPath === "/" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/#theme"
              className={`text-black px-2 py-1 my-1 ${
                currentPath === "/themes-terms" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Themes & Terms
            </Link>
            <Link
              href="/#plans"
              className={`text-black px-2 py-1 my-1 ${
                currentPath === "/#plans" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Plans
            </Link>
            <Link
              href="/winners"
              className={`text-black px-2 py-1 my-1 ${
                currentPath === "/winners" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Winners
            </Link>
            <Link
              href="/#timeline"
              className={`text-black px-2 py-1 my-1 ${
                currentPath === "/timeline" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Timeline
            </Link>
            <Link
              href="/forums"
              className={`text-black px-2 py-1 my-1 ${
                currentPath === "/forums" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Forum
            </Link>
            <Link
              href="/bloggers"
              className={`text-black px-4 py-1 my-1 border border-black ${
                currentPath === "/bloggers-guide" ? "bg-[#BDE7FF]" : ""
              }`}
            >
              Blogger&apos;s Guide
            </Link>
          </div>
          <div>
            {!user ? (
              <Link href="/login">
                <button className="bg-black text-white px-2 py-1">
                  LOGIN / REGISTER NOW
                </button>
              </Link>
            ) : (
              <>
                <Link href={getDashboardPath()}>
                  <button className="bg-black text-white px-2 py-1 mr-2">
                    DASHBOARD
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-black text-white px-2 py-1"
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
