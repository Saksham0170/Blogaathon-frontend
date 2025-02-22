"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { X, Trash2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface EmailUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailUsersDialog({
  isOpen,
  onClose,
}: EmailUsersDialogProps) {
  const [activeTab, setActiveTab] = useState<"bulk" | "custom">("bulk");
  const [category, setCategory] = useState<string>("all");
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkContent, setBulkContent] = useState("");
  const [customEmails, setCustomEmails] = useState<string>("");
  const [customSubject, setCustomSubject] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSendBulk = async () => {
    const template = {
      class: category,
      subject: bulkSubject,
      content: bulkContent,
    };
    try {
      const response = await axiosInstance.post("/api/bulkEmail/", template);
      console.log("Bulk email response:", response.data);
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        resetFields();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending bulk email:", error);
      toast.error("Failed to send bulk email");
    }
  };

  const handleSendCustom = async () => {
    const emails = customEmails.split(",").map((email) => email.trim());
    try {
      for (const email of emails) {
        const template = {
          email: email,
          subject: customSubject,
          content: customContent,
        };
        await axiosInstance.post("/api/customEmail/", template);
      }
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        resetFields();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sending custom email:", error);
      toast.error("Failed to send custom email");
    }
  };

  const resetFields = () => {
    setBulkSubject("");
    setBulkContent("");
    setCustomEmails("");
    setCustomSubject("");
    setCustomContent("");
    setCategory("all");
  };

  const getDefaultContent = (category: string) => {
    switch (category) {
      case "all":
        return "<p>Dear Participants,</p><p>We have an important update for you.</p><p>Best regards,<br>The Team</p>";
      case "submitted":
        return "<p>Dear User,</p><p>Thank you for your submission. We are reviewing it.</p><p>Best regards,<br>The Team</p>";
      case "draft":
        return "<p>Dear User,</p><p>Don't forget to finalize your draft.</p><p>Best regards,<br>The Team</p>";
      case "accepted":
        return "<p>Dear User,</p><p>We are pleased to inform you that your submission has been accepted.</p><p>Best regards,<br>The Team</p>";
      case "rejected":
        return "<p>Dear User,</p><p>We regret to inform you that your submission has been rejected.</p><p>Best regards,<br>The Team</p>";
      case "usersWithoutBlogs":
        return "<p>Dear User,</p><p>We noticed you do not have any blogs. Please consider creating one.</p><p>Best regards,<br>The Team</p>";
      default:
        return "";
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setBulkSubject(getDefaultSubject(value));
    setBulkContent(getDefaultContent(value));
  };

  const getDefaultSubject = (category: string) => {
    switch (category) {
      case "all":
        return "Update for All Participants";
      case "submitted":
        return "Submission Confirmation";
      case "draft":
        return "Draft Reminder";
      case "accepted":
        return "Congratulations! Your Submission is Accepted";
      case "rejected":
        return "Submission Rejected";
      case "usersWithoutBlogs":
        return "Important Notice for Users Without Blogs";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="bg-gray-100 px-4 py-2 rounded-t-lg">
          <DialogTitle className="text-sm font-medium flex items-center justify-between">
            <span>{activeTab === "bulk" ? "Bulk Email" : "New Message"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              className={`py-2 px-4 rounded-lg ${
                activeTab === "bulk"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("bulk")}
            >
              Bulk Email
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${
                activeTab === "custom"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("custom")}
            >
              Custom Email
            </button>
          </div>

          {activeTab === "bulk" ? (
            <div className="space-y-4">
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Participants</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="usersWithoutBlogs">
                    Users Without Blogs
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Subject"
                value={bulkSubject}
                onChange={(e) => setBulkSubject(e.target.value)}
                className="w-full"
              />

              <Textarea
                placeholder="Enter HTML content for email body"
                value={bulkContent}
                onChange={(e) => setBulkContent(e.target.value)}
                className="min-h-[200px] font-mono"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                  placeholder="Recipients (comma separated)"
                  className="w-full"
                />

                <Input
                  placeholder="Subject"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full"
                />

                <Textarea
                  placeholder="Enter HTML content for email body"
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-2 flex items-center justify-between">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6"
            onClick={activeTab === "bulk" ? handleSendBulk : handleSendCustom}
          >
            Send
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-gray-900"
            onClick={resetFields}
            title="Discard draft"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <Dialog
          open={showSuccessDialog}
          onOpenChange={() => setShowSuccessDialog(false)}
        >
          <DialogContent className="w-[80%] max-w-[27rem] rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-3xl font-bold text-green-600 text-center mb-4">
                Email Sent Successfully!
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
