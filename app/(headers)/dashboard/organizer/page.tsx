"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import EmailUsersDialog from "@/components/Dashboard/organizer/EmailUsersDialog";
import { Eye, Mail, X, Download } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import PreviewBlog from "@/components/Dashboard/user/PreviewBlog";
import { Dialog } from "@radix-ui/react-dialog";
import axiosInstance from "@/lib/axios";
// import { JudgeResponse } from './types'; // Assuming you have a types file for interfaces

// Add this interface for the API response
interface JudgeResponse {
  judgeName: string;
  judgeEmail: string;
  assignedBlogs: {
    blogId: number;
    title: string;
    banner_url: string;
    status: string;
  }[];
}

// Update the Blog interface to include scores
interface Blog {
  blogId: number;
  title: string;
  blog_author_email: string;
  blog_author_name: string | null;
  status: string;
  isSubmitted: boolean;
  markedAs: string;
  judged_by__judge_name: string | null;
  judged_by__judge_email: string | null;
  banner_url: string;
  score?: {
    Style: number;
    Structure: number;
    "Content length": number;
  };
}

interface BlogContent {
  id: string;
  type: string;
  props: {
    textColor: string;
    textAlignment: string;
    backgroundColor: string;
  };
  content: Array<{
    text: string;
    type: string;
    styles: Record<string, unknown>;
  }>;
  children: unknown[];
}

interface BlogDetails {
  banner_url: string;
  title: string;
  content: BlogContent[]; // Keep the content structure as is
}

// Define an interface for the organizer details
interface Organizer {
  fullName: string;
  email: string;
  created_at: string;
  blogs: Blog[]; // Assuming this is an array of Blog
  judges: JudgeResponse[]; // Assuming this is an array of JudgeResponse
}

// Add this interface
interface User {
  id: number;
  fullName: string;
  email: string;
  currentRole: string;
  photoUrl: string | null;
  markedAs: string | null;
}

const downloadCSV = (data: unknown[], filename: string) => {
  // Convert object array to CSV string
  const csvRows = [];

  // Get headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]?.toString() || "";
      // Escape quotes and wrap in quotes if contains comma
      return `"${value.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  // Create and download file
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Add this function to calculate total score
const calculateTotalScore = (score?: Blog["score"]) => {
  if (!score) return 0;
  return score.Style + score.Structure + score["Content length"];
};

// Add this type for blog status
type BlogStatus = "submitted" | "draft" | "not started";

export default function OrganizerDashboard() {
  const [organizer, setOrganizer] = useState<Organizer | null>(null); // Use the Organizer type
  const [selectedBlog, setSelectedBlog] = useState<BlogDetails | null>(null); // Use BlogDetails type
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [judges, setJudges] = useState<JudgeResponse[]>([]); // Use JudgeResponse type
  const [blogs, setBlogs] = useState<Blog[]>([]); // Use Blog type
  const [isLoading, setIsLoading] = useState(true);
  const [sortByScore, setSortByScore] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [users, setUsers] = useState<User[]>([]);

  // Add sorted blogs computation
  const sortedBlogs = React.useMemo(() => {
    if (!sortByScore) return blogs;

    return [...blogs].sort((a, b) => {
      const scoreA = calculateTotalScore(a.score);
      const scoreB = calculateTotalScore(b.score);
      return scoreB - scoreA;
    });
  }, [blogs, sortByScore]);

  // Fetch user details
  const fetchUserDetails = async (): Promise<Organizer | null> => {
    try {
      const { data } = await axiosInstance.get("/api/getUser/");
      return data.userDetails;
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
      return null;
    }
  };

  // Fetch judges
  const fetchJudges = async () => {
    try {
      const { data } = await axiosInstance.get("/api/getJudges/");
      return data.judges;
    } catch (error) {
      console.error("Error fetching judges:", error);
      toast.error("Error fetching judges data");
      return [];
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/api/getBlogs/");
      return data.blogs;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Error fetching blogs data");
      return [];
    }
  };

  // Fetch blog by ID
  const fetchBlogById = async (blogId: number): Promise<BlogDetails | null> => {
    try {
      const { data } = await axiosInstance.get(`/api/getBlogById/${blogId}`);
      return {
        title: data.title,
        content: data.content,
        banner_url: data.banner_url,
      };
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Error fetching blog details");
      return null;
    }
  };

  // Modify the assignBlogToJudge function to handle unassignment
  const assignBlogToJudge = async (
    blogId: number,
    judgeEmail: string | null
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/assignBlog/", {
        judge_email: judgeEmail || "",
        blog_id: blogId,
      });

      toast.success(data.message);
      // Refresh blogs list after successful assignment/unassignment
      const blogsData = await fetchBlogs();
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error updating blog assignment:", error);
      toast.error("Error updating blog assignment");
    }
  };

  const handleAutoAssignJudges = async () => {
    try {
      const { data } = await axiosInstance.post("/api/autoAssign/");
      toast.success(data.message);
    } catch (error) {
      console.error("Error auto assigning judges:", error);
      toast.error("Error auto assigning judges");
    }
  };

  useEffect(() => {
    const loadOrganizerDetails = async () => {
      const userDetails = await fetchUserDetails();
      if (userDetails) {
        setOrganizer({
          fullName: userDetails.fullName,
          email: userDetails.email,
          created_at: userDetails.created_at,
          blogs: [],
          judges: [],
        });
      }
    };
    loadOrganizerDetails();
  }, []);

  useEffect(() => {
    const loadJudges = async () => {
      setIsLoading(true);
      const judgesData = await fetchJudges();
      setJudges(judgesData);
      setIsLoading(false);
    };

    loadJudges();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      const blogsData = await fetchBlogs();
      setBlogs(blogsData);
    };

    loadBlogs();
  }, []);

  const handleAssignJudge = (blogId: number, judgeEmail: string) => {
    assignBlogToJudge(blogId, judgeEmail);
  };

  const handlePreviewBlog = async (blog: Blog) => {
    const blogDetails = await fetchBlogById(blog.blogId);
    if (blogDetails) {
      setSelectedBlog(blogDetails);
      setIsPreviewOpen(true);
    }
  };

  // Close the preview panel when clicking outside
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedBlog(null);
  };

  const handleDownloadBlogs = () => {
    const blogsData = blogs.map((blog) => ({
      "Blog ID": blog.blogId,
      Title: blog.title,
      Author: blog.blog_author_name,
      "Author Email": blog.blog_author_email,
      Status: blog.status,
      Judge: blog.judged_by__judge_name || "Not Assigned",
      "Total Score": blog.score
        ? calculateTotalScore(blog.score)
        : "Not scored",
      "Style Score": blog.score?.Style || "N/A",
      "Structure Score": blog.score?.Structure || "N/A",
      "Content Length Score": blog.score?.["Content length"] || "N/A",
    }));

    downloadCSV(blogsData, "blogs_report.csv");
  };

  const handleDownloadJudges = () => {
    const judgesData = judges.map((judge) => ({
      Name: judge.judgeName,
      Email: judge.judgeEmail,
      "Assigned Blogs Count": judge.assignedBlogs.length,
      "Assigned Blogs": judge.assignedBlogs
        .map((blog) => blog.title)
        .join("; "),
    }));

    downloadCSV(judgesData, "judges_report.csv");
  };

  // Add this function to get blog status
  const getBlogStatus = (markedAs: string | null): BlogStatus => {
    if (markedAs === "submitted") return "submitted";
    if (markedAs === "draft") return "draft";
    return "not started";
  };

  // Add this fetch function
  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/api/getUsers/");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users data");
    }
  };

  // Call it in useEffect
  useEffect(() => {
    fetchUsers();
  }, []);

  // Add this function near other download functions
  const handleDownloadUsers = () => {
    const usersData = users.map((user) => ({
      "User ID": user.id,
      Name: user.fullName,
      Email: user.email,
      "Current Role": user.currentRole,

      "Blog Status": getBlogStatus(user.markedAs),
    }));

    downloadCSV(usersData, "users_report.csv");
  };

  if (!organizer) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:py-8 md:px-36">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Image
                width={400}
                height={400}
                src="/test.png"
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-[#2a76bc]">
                  {organizer.fullName}
                </h2>
                <p className="text-sm text-gray-500">{organizer.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleAutoAssignJudges}
            className="bg-[#2a76bc] text-white hover:bg-[#2a76bc]/90 mr-2"
          >
            Auto Assign Judges
          </Button>
          <Button
            onClick={() => setIsEmailDialogOpen(true)}
            className="bg-[#2a76bc] text-white hover:bg-[#2a76bc]/90"
          >
            <Mail className="mr-2 h-4 w-4" /> Email Users
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{blogs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Judges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  judges.length
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Blogs Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#2a76bc] font-bold text-xl">
                All Blogs
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSortByScore(!sortByScore)}
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    sortByScore ? "bg-[#2a76bc] text-white" : ""
                  }`}
                >
                  {sortByScore ? "Clear Sort" : "Sort by Score"}
                </Button>
                <Button
                  onClick={handleDownloadBlogs}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Author Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Style</TableHead>
                  <TableHead className="text-center">Structure</TableHead>
                  <TableHead className="text-center">Content</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead>Assign Judge</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBlogs.map((blog) => (
                  <TableRow key={blog.blogId}>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>{blog.blog_author_name}</TableCell>
                    <TableCell>{blog.blog_author_email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          blog.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : blog.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {blog.score?.Style || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {blog.score?.Structure || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {blog.score?.["Content length"] || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-[#2a76bc]">
                        {blog.score ? calculateTotalScore(blog.score) : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          handleAssignJudge(
                            blog.blogId,
                            value === "unassign" ? null : value
                          )
                        }
                        defaultValue={blog.judged_by__judge_email || ""}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Assign Judge" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassign">
                            Unassign judge
                          </SelectItem>
                          {judges.map((judge) => (
                            <SelectItem
                              key={judge.judgeEmail}
                              value={judge.judgeEmail}
                            >
                              {judge.judgeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

        {/* Judges Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#2a76bc] font-bold text-xl">
                Judges Overview
              </CardTitle>
              <Button
                onClick={handleDownloadJudges}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading judges data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>No. of Blogs</TableHead>
                    <TableHead>Reviewed Blogs</TableHead>
                    <TableHead>Assigned Blogs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {judges.map((judge, index) => (
                    <TableRow key={index}>
                      <TableCell>{judge.judgeName}</TableCell>
                      <TableCell>{judge.judgeEmail}</TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {judge.assignedBlogs.length}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {
                            judge.assignedBlogs.filter(
                              (blog) =>
                                blog.status === "Accepted" ||
                                blog.status === "Rejected"
                            ).length
                          }
                        </span>
                        {" / "}
                        {judge.assignedBlogs.length}
                      </TableCell>
                      <TableCell>
                        {judge.assignedBlogs.length > 0 ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                View Blogs
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 p-2">
                              <div className="max-h-48 overflow-auto">
                                {judge.assignedBlogs.map((blog, blogIndex) => (
                                  <div
                                    key={blogIndex}
                                    className="p-2 hover:bg-gray-100 rounded-md"
                                  >
                                    <p className="text-sm font-medium">
                                      {blog.title}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <p className="text-xs text-gray-500">
                                        ID: {blog.blogId}
                                      </p>
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          blog.status === "Accepted"
                                            ? "bg-green-100 text-green-800"
                                            : blog.status === "Rejected"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {blog.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No blogs assigned
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Users Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#2a76bc] font-bold text-xl">
                Users Overview
              </CardTitle>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as BlogStatus | "all")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="not started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleDownloadUsers}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Blog Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter(
                    (user) =>
                      statusFilter === "all" ||
                      getBlogStatus(user.markedAs) === statusFilter
                  )
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="relative w-10 h-10">
                          <Image
                            src={user.photoUrl || "/test.png"}
                            alt={user.fullName}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.currentRole}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            getBlogStatus(user.markedAs) === "submitted"
                              ? "bg-green-100 text-green-800"
                              : getBlogStatus(user.markedAs) === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getBlogStatus(user.markedAs)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Blog Preview Side Panel */}
      {selectedBlog && isPreviewOpen && (
        <Dialog open={isPreviewOpen} onOpenChange={handleClosePreview}>
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50"
            onClick={handleClosePreview}
          >
            <div
              className="fixed right-0 top-0 h-full w-4/5 bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
                  <Button
                    onClick={handleClosePreview}
                    variant="ghost"
                    className="hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <PreviewBlog
                    // initialTitle={selectedBlog.title}
                    initialContent={selectedBlog.content}
                    bannerUrl={selectedBlog.banner_url}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <EmailUsersDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
      />
    </div>
  );
}
