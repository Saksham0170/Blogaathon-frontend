"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import Cookies from "js-cookie";
import Image from "next/image";
import ReviewBlog from "@/components/Dashboard/mentor/ReviewBlog";
import useJudgeStore from "@/store/judge.store";
import LoadingSpinner from "@/components/Loading";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from '@/lib/axios';
// import { judge1 } from '../../../sampleJudge';
// import UpdateProfileModal from "@/components/Dashboard/mentor/UpdateProfile";
// import { set } from 'zod';
interface Blog {
  blogId: number;
  blog_author_name: string;
  lastUpdates: string;
  score?: BlogScore;
  title: string;
  content: BlogContent[];
  markedAs: string;
  isSubmitted: boolean;
  status?: string;
  feedback?: string | null;
}

interface Judge {
  fullName: string;
  email: string;
  created_at: string;
  phoneNumber: string;
  currentRole: string;
  organizationName: string;
  industry: string;
  city: string;
  otherRole: string;
  joinedOn: string;
  assigndBlogs?: Blog[];
}
interface BlogScore {
  [key: string]: number | string; // Allow both numbers and strings
}

interface BlogSubmission {
  blogId: number;
  status: string;
  score: BlogScore;
  feedback: string | number;
}
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

interface AssignedBlog {
  blogId: number;
  blog_author_name: string;
  lastUpdates: string;
  isSubmitted: boolean;
  markedAs: string;
  status: string;
  score?: BlogScore;
  feedback: string | null;
  title: string;
  banner_url: string;
  content: BlogContent[];
}
// const clearTokens = () => {
//   if (Cookies.get("token")) Cookies.remove("token");
//   if (Cookies.get("UserToken")) Cookies.remove("UserToken");
//   if (Cookies.get("JudgeToken")) Cookies.remove("JudgeToken");
//   if (Cookies.get("AdminToken")) Cookies.remove("AdminToken");
// };

const JudgeDashboard = () => {
  const judge = useJudgeStore((state) => state.judge);
  const setJudge = useJudgeStore((state) => state.setJudge);

  const [isPreviewBlogOpen, setIsPreviewBlogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [initalContent, setInitialContent] = useState<BlogContent[] | null>(
    null
  );
  const [initialTitle, setInitialTitle] = useState<string | null>(null);
  const [initialBanner, setInitialBanner] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [selectedBlogScore, setSelectedBlogScore] = useState<BlogScore | null>({
    feedback: "",
    Content: 0,
    Style: 0,
    Structure: 0,
  });
  const [selectedBlogFeedback, setSelectedBlogFeedback] = useState<
    string | null
  >(null);
  const [selectedBlogStatus, setSelectedBlogStatus] = useState<string | null>(
    null
  );


  const fetchJudgeDetails = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data } = await axiosInstance.get('/api/getJudgeDetails');
      
      const recievedBlogs = data.blogs_to_judge;
      const actualBlogs: AssignedBlog[] = recievedBlogs.map(
        (blog: AssignedBlog) => ({
          blogId: blog.blogId,
          blog_author_name: blog.blog_author_name,
          lastUpdates: blog.lastUpdates,
          isSubmitted: blog.isSubmitted,
          banner_url: blog.banner_url,
          markedAs: blog.markedAs,
          status: blog.status,
          score: blog.score
            ? blog.score
            : { "Content length": 0, Style: 0, Structure: 0 },
          feedback: blog.feedback,
          title: blog.title,
          content: blog.content,
        })
      );

      const newJudge: Judge = {
        fullName: data.judge_details.name,
        email: data.judge_details.email,
        currentRole: data.judge_details.current_role,
        organizationName: data.judge_details.organization_name,
        industry: data.judge_details.industry,
        city: data.judge_details.city,
        otherRole: data.judge_details.otherRole,
        created_at: "",
        phoneNumber: "",
        joinedOn: "",
        assigndBlogs: actualBlogs,
      };

      setJudge(newJudge);
    } catch (error) {
      console.error("Error fetching Judge details", error);
      toast.error("Error fetching user details");
      // clearTokens();
      // router.push("/");
    } finally {
      setIsFetching(false);
    }
  }, [setJudge]);

  useEffect(() => {
    fetchJudgeDetails();
  }, [fetchJudgeDetails]);

  // const handleUpdateProfile = () => {
  //   console.log("Profile updated");
  // };

  const handlePreviewBlog = async (blog: AssignedBlog) => {
    console.log("blog", blog);
    setInitialContent(blog.content);
    setInitialBanner(blog.banner_url);
    setInitialTitle(blog.title);
    setSelectedBlogId(blog.blogId);
    setSelectedBlogScore(blog.score);
    setSelectedBlogStatus(blog.status);
    setSelectedBlogFeedback(blog.feedback);
    setIsPreviewBlogOpen(true);
  };

  const handleBlogSubmit = async (data: BlogSubmission) => {
    try {
      await axiosInstance.post('/api/reviewBlog/', data);
      toast.success("Blog submitted successfully");
      fetchJudgeDetails();
      setIsPreviewBlogOpen(false);
    } catch (error) {
      console.error("Error submitting blog", error);
      toast.error("Error submitting blog");
    }
  };

  if (isFetching) {
    return <LoadingSpinner />;
  }

  if (!judge) {
    return <div>No judge data available. Please try again.</div>;
  }
  return (
    <div className="bg-[url('/why-participate-bg.png')] min-h-screen bg-gray-50 p-4 md:py-8 md:px-36">
      <Toaster />
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                width={400}
                height={400}
                src="/test.png"
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-[#2a76bc]">
                  {judge.fullName}
                </h2>
                <p className="text-sm text-gray-500">{judge.currentRole}</p>
              </div>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpdateProfileOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button> */}
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{judge.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-semibold">{judge.organizationName}</p>
            </div>
         
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{judge.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry</p>
              <p className="font-semibold">{judge.industry}</p>
            </div>
            
          </CardContent>
        </Card>

        {/* Assigned Blogs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#2a76bc] font-bold text-xl">
              Assigned Blogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog Title</TableHead>

                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {judge.assigndBlogs?.map((blog: AssignedBlog, index) => (
                  <TableRow key={index}>
                    <TableCell>{blog.title}</TableCell>

                    <TableCell>{blog.lastUpdates}</TableCell>
                    <TableCell>
                      <span
                        className={`
                          px-2 py-1 rounded-full text-xs font-semibold 
                          ${
                            blog.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : blog.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewBlog(blog)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Blog Preview Modal */}
      {initalContent && (
        <ReviewBlog
          isEditable={false}
          isOpen={isPreviewBlogOpen}
          blogId={selectedBlogId}
          initialContent={initalContent}
          blogStatus={selectedBlogStatus}
          initialBanner={initialBanner || ""}
          initialTitle={initialTitle ? initialTitle : ""}
          blogScore={selectedBlogScore}
          blogFeedback={selectedBlogFeedback}
          onClose={() => {
            setIsPreviewBlogOpen(false);
            setInitialContent(null);
            setInitialTitle(null);
          }}
          onSubmit={handleBlogSubmit}
        />
      )}
      {/* <UpdateProfileModal
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
        initialProfile={judge}
        onUpdateProfile={handleUpdateProfile}
      /> */}
    </div>
  );
};

export default JudgeDashboard;
