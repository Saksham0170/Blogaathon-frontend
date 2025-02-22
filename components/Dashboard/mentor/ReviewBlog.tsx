"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import Image from "next/image";

interface BlogScore {
  [key: string]: number | string; // Allow both numbers and strings
}

interface BlogSubmission {
  blogId: number;
  status: string;
  score: BlogScore;
  feedback: string | number;
}

interface BlogModalEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (blogData: BlogSubmission) => void;
  initialTitle?: string | null;
  initialContent?: unknown[];
  isEditable?: boolean;
  blogId: number;
  blogFeedback?: string | null;
  blogScore?: BlogScore;
  blogStatus?: string;

  initialBanner?: string | null;
}

const ReviewBlog: React.FC<BlogModalEditorProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTitle,
  initialContent,
  isEditable,
  blogId,
  blogStatus,
  blogFeedback,
  blogScore = {},
  initialBanner,
}) => {
  const [title, setTitle] = useState(initialTitle || "");
  console.log("bannerUrl", initialBanner);
  // Dynamically create initial parameter form based on blogScore keys
  const [parameterForm, setParameterForm] = useState<BlogScore>(() => {
    const initialForm: BlogScore = {};

    // Populate form with existing score values or default to 0
    Object.keys(blogScore).forEach((key) => {
      // Skip 'feedback' to handle it separately
      if (key.toLowerCase() !== "feedback") {
        initialForm[key] = blogScore[key] || 0;
      }
    });
    console.log("blogscore", blogScore);

    // Always include feedback
    initialForm["feedback"] = blogFeedback || "";

    return initialForm;
  });

  // Create the editor
  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  const handleParameterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setParameterForm((prev) => ({
      ...prev,
      [name]: name === "feedback" ? value : Number(value),
    }));
  };

  const handleSubmit = (status: "Accepted" | "Rejected") => {
    // Prepare score object with original keys
    const scoreData: BlogScore = { ...parameterForm };

    // Remove feedback from score object if needed
    const { feedback, ...scoreWithoutFeedback } = scoreData;

    const newData: BlogSubmission = {
      status,
      blogId,
      score: {
        ...scoreWithoutFeedback,
      },
      feedback,
    };

    console.log("Submitted Blog Data:", newData);
    onSubmit?.(newData);
    onClose();
  };

  return (
    <div className="z-!100">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="
                    w-full 
                    max-w-[90vw] 
                    h-[95vh] 
                    max-h-[95vh] 
                    flex 
                    overflow-hidden 
                    p-0 
                    rounded-lg
                "
        >
          {/* Left Side - Parameter Form */}
          <div className="w-1/3 bg-[#f0f4f8] p-6 border-r border-gray-200 overflow-y-auto">
            <h2 className="text-[#2a76bc] text-xl font-bold mb-6">
              Parameter Review
            </h2>
            <div className="space-y-4">
              {/* Dynamically render input fields for all non-feedback keys */}
              {Object.keys(parameterForm).map((key) => {
                if (key.toLowerCase() === "feedback") return null;
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </label>
                    <input
                      type="number"
                      name={key}
                      disabled={
                        blogStatus === "Accepted" || blogStatus === "Rejected"
                      }
                      value={parameterForm[key] === 0 ? "" : parameterForm[key]}
                      onChange={handleParameterChange}
                      className="w-full p-2 border rounded-md focus:ring-[#2a76bc] focus:border-[#2a76bc]"
                    />
                  </div>
                );
              })}

              {/* Feedback textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  name="feedback"
                  value={parameterForm.feedback}
                  onChange={handleParameterChange}
                  disabled={
                    blogStatus === "Accepted" || blogStatus === "Rejected"
                  }
                  rows={4}
                  className="w-full p-2 border rounded-md focus:ring-[#2a76bc] focus:border-[#2a76bc]"
                />
              </div>

              {blogStatus == "Pending" && (
                <div className={`flex space-x-4 `}>
                  <Button
                    variant="default"
                    onClick={() => handleSubmit("Accepted")}
                    className="flex-1 bg-[#2a76bc] hover:bg-blue-700"
                  >
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleSubmit("Rejected")}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Blog Editor */}
          <div className="w-2/3 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <DialogTitle className="text-[#2a76bc] text-xl font-bold">
                {initialContent
                  ? isEditable
                    ? "Edit Blog"
                    : "Submitted"
                  : "Create New Blog"}
              </DialogTitle>
            </div>

            {/* Content Container - Make it scrollable */}
            <div className="flex-grow overflow-y-auto">
              {/* Banner Image */}
              {initialBanner && (
                <div className="relative h-80">
                  <Image
                    src={initialBanner}
                    alt="Banner"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Title Input */}
              <div className="px-6 pt-4">
                <input
                  type="text"
                  placeholder="Enter blog title"
                  value={title}
                  disabled={!isEditable}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border-b text-2xl font-semibold focus:outline-none"
                />
              </div>

              {/* Editor */}
              <div className="px-6 py-4">
                <BlockNoteView
                  editor={editor}
                  editable={isEditable}
                  theme={lightDefaultTheme}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewBlog;
