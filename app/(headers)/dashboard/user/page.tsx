"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PenTool, Pencil, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UpdateProfileModal from "@/components/Dashboard/user/UpdateProfile";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import BlogModalEditor from '@/components/Dashboard/user/Editor';
// import {user1} from '@/lib/sampleUser';
// import PreviewBlog from '@/components/Dashboard/user/PreviewBlog';
import useUserStore from "@/store/user.store";
import LoadingSpinner from "@/components/Loading";
import { toast, Toaster } from "react-hot-toast";
// import { set } from 'zod';
import axiosInstance from '@/lib/axios';

interface BlogContent {
  id: string;
  type: string;
  props: {
    textColor: string;
    backgroundColor: string;
    textAlignment: string;
    level?: number;
  };
  content: {
    type: string;
    text: string;
    styles: {
      italic?: boolean;
      bold?: boolean;
      textColor?: string;
    };
  }[];
  children: unknown[] | undefined;
}

// interface submitBlog {
//   title: string;
//   status: "draft" | "submit";
//   content: unknown[];
// }

const BlogDashboard = () => {
  // const router = useRouter();
  // console.log(user);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateBlogDetails = useUserStore((state) => state.updateBlogDetails);
  // const updateBasicDetails = useUserStore((state) => state.updateBasicDetails);

  // const [isPreviewBlogOpen, setIsPreviewBlogOpen] = useState(false);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  // const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [initalContent, setInitialContent] = useState<BlogContent[] | null>(
    null
  );
  const [initialTitle, setInitialTitle] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  console.log("initalContent", initalContent);
  console.log("initialTitle", initialTitle);
  // const clearTokens = () => {
  //   if (Cookies.get("token")) Cookies.remove("token");
  //   if (Cookies.get("UserToken")) Cookies.remove("UserToken");
  //   if (Cookies.get("JudgeToken")) Cookies.remove("JudgeToken");
  // };

  const fetchUserDetails = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data } = await axiosInstance.get('/api/getUser');
      
      setUser(data.userDetails);

      if (data.blogDetails) {
        updateBlogDetails(data.blogDetails);
        setIsSubmitted(data.blogDetails.isSubmitted || false);
        setInitialContent(data.blogDetails.content);
        setInitialTitle(data.blogDetails.title);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
      toast.error("Error Fetching user details");
      // clearTokens();
      // router.push("/");
    } finally {
      setIsFetching(false);
    }
  }, [setUser, updateBlogDetails]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleUpdateProfile = () => {
    console.log("Profile updated");
  };

  
  if (isFetching) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return <div>user not found</div>;
  }

  const renderSubmissions = () => {
    // Check if blog exists and is submitted
    if (user.blog && user.blog.isSubmitted) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#2a76bc] font-bold text-xl">
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col p-4 border-b last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{user.blog.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center">
                      <Eye className="mr-1 h-4 w-4" /> {user.blog.status}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    router.push(`/blogs/preview/${user.blog.blogId}`)
                  }
                  variant="ghost"
                  size="sm"
                >
                  View
                </Button>
              </div>

              {/* Show feedback only if status is rejected */}
              {user.blog.status !== "Pending" && user.blog.feedback && (
                <div className="mt-2 text-sm ">
                  <strong>Feedback:</strong> {user.blog.feedback}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="bg-[url('/why-participate-bg.png')] min-h-screen bg-gray-50 p-4 md:py-8 md:px-36">
      <Toaster />
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Overview with Sidebar Information */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                width={400}
                height={400}
                src={user.photoUrl || "/test.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-[#2a76bc]">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-500">{user.currentRole}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpdateProfileOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-semibold">{user.organizationName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined On</p>
              <p className="font-semibold">{user.created_at}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{user.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry</p>
              <p className="font-semibold">{user.industry}</p>
            </div>
           
          </CardContent>
        </Card>

        {(!user.blog || (!user.blog.isSubmitted)) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2a76bc] font-bold text-xl">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push("/blogs/")}>
                <PenTool className="mr-2 h-4 w-4" />
                {!user.blog ? "Create Blog" : "Edit Blog"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Conditionally render Submissions */}
        {isSubmitted && renderSubmissions()}
      </div>
      {/* <BlogModalEditor
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}

        onSubmit={handleBlogSubmit}
      /> */}
      {/* <PreviewBslog
        isEditable={user.blog ? user.blog.isSubmitted === false : false}
        isOpen={isPreviewBlogOpen}
        initialContent={initalContent}

        initialTitle={initialTitle}
        onClose={() => setIsPreviewBlogOpen(false)}
        onSubmit={handleBlogSubmit}
      /> */}
      {/* Update Profile Modal */}
      <UpdateProfileModal
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
        initialProfile={user}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};

export default BlogDashboard;
