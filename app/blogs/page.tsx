"use client";
import Sidebar from "@/components/blogs/sidebar";
import React, { useEffect, useState, useCallback } from "react";
// import BlogModalEditor from '@/components/Dashboard/user/Editor'
import useUserStore from "@/store/user.store";
import { toast, Toaster } from "react-hot-toast";

import { useRouter } from "next/navigation";
import SubmitPopup from "@/components/Dashboard/user/SubmitPopup";
import DynamicBlogModalEditor from "@/components/DynamicEditor"; // Adjust the path as necessary
// import { init } from 'next/dist/compiled/webpack/webpack'
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import Image from "next/image"; // Import the Image component
import axiosInstance from "@/lib/axios";

// interface submitBlog {
//   title: string;
//   status: 'draft' | 'submit';
//   content: unknown[];
// }

interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

// const clearTokens = () => {
//   if (Cookies.get('token')) Cookies.remove('token');
//   if (Cookies.get('UserToken')) Cookies.remove('UserToken');
//   if (Cookies.get('JudgeToken')) Cookies.remove('JudgeToken');
// };

const WriteBlog = () => {
  const router = useRouter();

  // const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateBlogDetails = useUserStore((state) => state.updateBlogDetails);
  const currentBlogContent = useUserStore((state) => state.currentBlogContent);
  const currentBlogTitle = useUserStore((state) => state.currentBlogTitle);
  const setCurrentBlogTitle = useUserStore(
    (state) => state.setCurrentBlogTitle
  );
  const currentBlogBannerUrl = useUserStore(
    (state) => state.currentBlogBannerUrl
  );
  const setCurrentBlogBannerUrl = useUserStore(
    (state) => state.setCurrentBlogBannerUrl
  );

  const [title, setTitle] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState<unknown[]>([]);
  const [contentKey, setContentKey] = useState(0); // Add a key state
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContents[]>([]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  // const [uploadingCover, setUploadingCover] = useState(false);
  const [isSubmitted] = useState(false);
  console.log("coverImage", coverImage);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/getUser");
      console.log("Fetched blog details:", data.blogDetails);

      setUser(data.userDetails);

      if (data.blogDetails !== null) {
        updateBlogDetails(data.blogDetails);
        const newBannerUrl = data.blogDetails.banner_url || null;
        console.log("Setting banner URL from fetch:", newBannerUrl);
        setBannerUrl(newBannerUrl);
        setCurrentBlogBannerUrl(newBannerUrl);
        setContentKey((prevKey) => prevKey + 1);
        setInitialContent(data.blogDetails.content || []);
        setTitle(data.blogDetails.title || null);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
      toast.error("Error Fetching user details");
    }
  }, [setUser, updateBlogDetails, setCurrentBlogBannerUrl]);

  useEffect(() => {
    if (currentBlogContent.length > 0) {
      setInitialContent(currentBlogContent);
      setTitle(currentBlogTitle);
      console.log("Setting banner URL from store:", currentBlogBannerUrl);
      setBannerUrl(currentBlogBannerUrl);
    } else {
      fetchUserDetails();
    }
  }, [
    currentBlogContent,
    currentBlogTitle,
    currentBlogBannerUrl,
    fetchUserDetails,
  ]);

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await axiosInstance.post("/api/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newBannerUrl = data.file_url;
        setBannerUrl(newBannerUrl);
        setCurrentBlogBannerUrl(newBannerUrl);
      } catch (error) {
        console.error("Image upload error:", error);
        if (error.response?.status === 413) {
          toast.error("Image size is too large. Please upload a smaller image");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to upload cover image");
        }
      }
    }
  };

  const handleCoverImageDelete = () => {
    setCoverImage(null);
    setBannerUrl(null);
    setCurrentBlogBannerUrl(null);
  };

  const saveAsDraft = async (
    title: string,
    content: unknown[]
  ): Promise<void> => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      console.log("Saving draft with banner URL:", bannerUrl);
      const response = await axiosInstance.put("/api/draft/", {
        title,
        content,
        banner_url: bannerUrl,
      });
      console.log("Draft save response:", response.data);

      // Update the store after successful save
      updateBlogDetails({
        ...response.data,
        bannerUrl: bannerUrl,
      });
      setCurrentBlogBannerUrl(bannerUrl);

      toast.success("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const submitBlog = async (): Promise<void> => {
    try {
      console.log("Submitting blog with banner URL:", bannerUrl);
      const response = await axiosInstance.post("/api/submitBlog/", {
        title,
        content: initialContent,
        banner_url: bannerUrl,
      });
      console.log("Submit response:", response.data);

      // Update the store after successful submission
      updateBlogDetails({
        ...response.data,
        bannerUrl: bannerUrl,
      });
      setCurrentBlogBannerUrl(bannerUrl);

      toast.success("Blog submitted successfully");
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Failed to submit blog");
      throw error;
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirmation(true);
  };

  const handleConfirmSubmit = async (status: "draft" | "submit") => {
    try {
      if (status === "draft") {
        await saveAsDraft(title || "", initialContent);
      } else if (status === "submit") {
        await submitBlog();
      } else {
        toast.error("Invalid blog status");
      }
    } catch (error) {
      console.error("Blog submission failed", error);
    }

    setShowSubmitConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  const handlePreviewClick = async () => {
    console.log("previewing blog");
    await saveAsDraft(title || "", initialContent); // Save draft before preview

    // Fetch user details to get the blog ID
    await fetchUserDetails(); // Ensure we have the latest user details

    // Check if user state is updated correctly
    const updatedUser = useUserStore.getState().user; // Get the latest user state
    if (updatedUser.blog && updatedUser.blog.blogId) {
      router.push(`/blogs/preview/${updatedUser.blog.blogId}`); // Navigate to preview
      console.log("navigated to preview");
    } else {
      toast.error("Blog ID not found. Please save your draft first.");
    }
  };

  return (
    <div className="bg-white">
      <Toaster />
      <div className="flex relative">
        <div className={`w-64 flex-shrink-0`}>
          <Sidebar
            tableOfContents={tableOfContents}
            content={
              currentBlogContent.length > 0
                ? currentBlogContent
                : initialContent
            }
            onGoBack={async () => {
              if (
                !isSubmitted &&
                !isSaving &&
                (title || initialContent.length > 0)
              ) {
                await saveAsDraft(title || "", initialContent);
              }
            }}
          />
        </div>
        <div className="flex-grow min-h-screen px-8">
          <div className="w-full bg-white rounded-lg m-8">
            <div className="header flex justify-end gap-5 p-4">
              <Button
                onClick={handlePreviewClick}
                className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition duration-200"
              >
                Preview
              </Button>
              <Button
                onClick={handleSubmitClick}
                className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition duration-200"
              >
                Submit
              </Button>
              <Button
                onClick={async () =>
                  await saveAsDraft(title || "", initialContent)
                }
                className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition duration-200"
              >
                Save as Draft
              </Button>
            </div>
            <div className="editor p-8 h-full">
              {bannerUrl ? (
                <div className="relative h-80">
                  <Image
                    src={bannerUrl}
                    alt="Banner"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={handleCoverImageDelete}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="cover-image"
                    onChange={handleCoverImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-image"
                    className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400"
                  >
                    <div className="space-y-2">
                      <div className="text-gray-600">Add a cover image</div>
                      <div className="text-sm text-gray-500">
                        Recommended: 1600 x 420px
                      </div>
                    </div>
                  </label>
                </>
              )}
              <DynamicBlogModalEditor
                key={contentKey}
                initialTitle={currentBlogTitle || title}
                initialContent={
                  currentBlogContent.length > 0
                    ? currentBlogContent
                    : initialContent
                }
                setTitle={(newTitle: string) => {
                  setTitle(newTitle);
                  setCurrentBlogTitle(newTitle);
                }}
                setContent={setInitialContent}
                onChange={(newTitle, newContent) => {
                  setTitle(newTitle);
                  setCurrentBlogTitle(newTitle);
                  setInitialContent(newContent);
                }}
                onSubmit={handleConfirmSubmit}
                onTableOfContentsChange={setTableOfContents}
              />
            </div>
          </div>
        </div>
      </div>
      {showSubmitConfirmation && (
        <SubmitPopup
          onCancel={handleCancelSubmit}
          onConfirm={() => handleConfirmSubmit("submit")}
        />
      )}
    </div>
  );
};

export default WriteBlog;
