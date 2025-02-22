"use client";
import React, { useState, useEffect, useCallback } from "react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axiosInstance from '@/lib/axios';

import useUserStore from "../../../store/user.store";

interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

// Define a Block type
interface Block {
  id: string;
  type: string;
  props?: {
    level?: number;
  };
  content?: Array<{ type: string; text: string }>;
}

interface BlogModalEditorProps {
  initialTitle: string | null;
  initialContent: unknown[];
  setTitle: (newTitle: string) => void;
  setContent: React.Dispatch<React.SetStateAction<unknown[]>>;
  onChange: (newTitle: string, newContent: unknown[]) => void;
  onSubmit: (status: "draft" | "submit") => Promise<void>;
  onTableOfContentsChange: React.Dispatch<React.SetStateAction<unknown[]>>;
}

const BlogModalEditor: React.FC<BlogModalEditorProps> = ({
  initialTitle,
  initialContent,
  setTitle,
  setContent,
  onChange,

  onTableOfContentsChange,
}) => {
  const [localTitle, setLocalTitle] = useState(initialTitle || "");

  const setCurrentBlogContent = useUserStore(
    (state) => state.setCurrentBlogContent
  );

  // Create the editor with initial content and image upload handler
  const editor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? initialContent : undefined,
    uploadFile: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await axiosInstance.post('/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return data.file_url;
      } catch (error) {
        console.error("Image upload error:", error);
        return URL.createObjectURL(file);
      }
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (setTitle) {
      setTitle(newTitle);
    }
    if (onChange) {
      onChange(newTitle, editor.document);
    }
  };

  const handleContentChange = () => {
    if (setContent) {
      setContent(editor.document);
    }
    if (onChange) {
      onChange(localTitle, editor.document);
    }
    setCurrentBlogContent(editor.document);
  };

  const updateTableOfContents = useCallback(() => {
    if (!editor || !onTableOfContentsChange) return;

    const headings: TableOfContents[] = [];
    const blocks = editor.document as Block[]; // Cast to Block[]

    blocks.forEach((block) => {
      // Check if block is of type Block
      if (block.type === "heading" || block.props?.level) {
        let text = "";

        if (Array.isArray(block.content)) {
          text = block.content
            .filter((item) => typeof item === "object" && item.type === "text")
            .map((item) => item.text)
            .join("");
        }

        if (text.trim()) {
          headings.push({
            id: block.id,
            text: text.trim(),
            level: block.props?.level || 1,
          });
        }
      }
    });

    onTableOfContentsChange(headings);
  }, [editor, onTableOfContentsChange]);

  useEffect(() => {
    if (editor) {
      const unsubscribe = editor.onEditorContentChange(() => {
        updateTableOfContents();
      });

      updateTableOfContents();
      return unsubscribe;
    }
  }, [editor, updateTableOfContents]);

  return (
    <div className="h-full bg-white">
      {/* Title Input Below Cover Image */}
      <div className="px-6 pt-4 space-y-2">
        <input
          type="text"
          placeholder="Article Title"
          value={localTitle}
          onChange={handleTitleChange}
          className="w-full text-3xl font-bold focus:outline-none"
        />
      </div>

      {/* Editor Area */}
      <div className="px-6 py-4 h-[calc(100%-4rem)] overflow-auto">
        <BlockNoteView
          theme={{
            ...lightDefaultTheme,
            colors: {
              editor: {
                text: "inherit",
                background: "transparent",
              },
            },
          }}
          editor={editor}
          onChange={() => {
            handleContentChange();
            updateTableOfContents();
          }}
        />
      </div>
    </div>
  );
};

export default BlogModalEditor;
