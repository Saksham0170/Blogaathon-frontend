"use client";
import Sidebar from "@/components/blogs/sidebar";
import React, { useEffect, useState, useCallback } from "react";
// import BlogModalEditor from '@/components/Dashboard/user/Editor'
import useUserStore from "@/store/user.store";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SubmitPopup from "@/components/Dashboard/user/SubmitPopup";
// import { init } from 'next/dist/compiled/webpack/webpack'
import PreviewBlog from "@/components/Dashboard/user/PreviewBlog";
import { Pencil, ArrowLeft } from "lucide-react";
import Image from "next/image"; // Import the Image component
import axiosInstance from '@/lib/axios';

interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

// interface submitBlog {
//   title: string;
//   status: 'draft' | 'submit';
//   content: unknown[];
// }

// const clearTokens = () => {
//   if (Cookies.get("token")) Cookies.remove("token");
//   if (Cookies.get("UserToken")) Cookies.remove("UserToken");
//   if (Cookies.get("JudgeToken")) Cookies.remove("JudgeToken");
// };

const WriteBlog = () => {
  const router = useRouter();

  // const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateBlogDetails = useUserStore((state) => state.updateBlogDetails);
  const currentBlogContent = useUserStore((state) => state.currentBlogContent);
  // const currentBlogTitle = useUserStore((state) => state.currentBlogTitle);

  const [title, setTitle] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState<unknown[]>([]);
  const [contentKey, setContentKey] = useState(0); // Add a key state
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContents[]>([]);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null); // State for banner URL
  console.log(contentKey);

  const fetchUserDetails = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/getUser');
      
      setUser(data.userDetails);
      setIsSubmitted(data.blogDetails?.isSubmitted || false);
      
      if (data.blogDetails) {
        updateBlogDetails(data.blogDetails);
        setContentKey((prevKey) => prevKey + 1);
        setInitialContent(data.blogDetails.content || []);
        setTitle(data.blogDetails.title || null);
        setSubtitle(data.blogDetails.subtitle || null);
        setBannerUrl(data.blogDetails.banner_url || null);
      }
    } catch (error) {
      console.error('Error fetching user details', error);
      toast.error('Error Fetching user details');
      // clearTokens();
      // router.push('/');
    }
  }, [setUser, updateBlogDetails]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const submitBlog = async (): Promise<void> => {
    if (!title) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await axiosInstance.post('/api/submitBlog/', {
        title,
        content: initialContent,
      });

      setIsSubmitted(true);
      toast.success("Blog submitted successfully");
      setShowSubmitConfirmation(false);
    } catch (error) {
      toast.error("Failed to submit blog");
      throw error;
    }
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Toaster />
      <div className="h-14 border-b bg-white flex items-center justify-between px-6 gap-4">
        <button
          onClick={() => router.push("/dashboard/user")}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2 hover:bg-gray-50 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#0F6CBD]" />{" "}
          <span className="text-[#0F6CBD]">Back to Dashboard</span>
        </button>
        <div className="flex ml-auto gap-4">
          {!isSubmitted && (
            <button
              onClick={() => {
                router.push("/blogs");
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {/* {!isSubmitted && (
            <button
              onClick={() => {
                if (!title) {
                  toast.error("Title cannot be empty");
                  return;
                }
                setShowSubmitConfirmation(true);
              }}
              className="px-4 py-2 bg-[#0F6CBD] text-white font-medium rounded-md hover:bg-[#0F6CBD]/90 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          )} */}
        </div>
      </div>

      <section className="flex flex-1 overflow-hidden">
        <Sidebar
          tableOfContents={tableOfContents}
          content={initialContent}
          onHeadingClick={handleHeadingClick}
        />
        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          <div>
            {bannerUrl && (
              <div className="relative h-80">
                <Image
                  src={bannerUrl}
                  alt="Banner"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              </div>
            )}
            <PreviewBlog
              initialTitle={title}
              initialSubtitle={subtitle}
              initialContent={
                currentBlogContent.length > 0
                  ? currentBlogContent
                  : initialContent
              }
              onTableOfContentsChange={setTableOfContents}
            />
          </div>
        </div>
      </section>

      {showSubmitConfirmation && (
        <SubmitPopup onConfirm={submitBlog} onCancel={handleCancelSubmit} />
      )}
    </div>
  );
};

export default WriteBlog;
