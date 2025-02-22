"use client";
import React, { useEffect, useCallback } from "react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import Image from 'next/image';

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
  initialTitle?: string | null;
  initialSubtitle?: string | null;
  initialContent?: unknown[];
  bannerUrl?: string | null;
  onTableOfContentsChange?: (toc: TableOfContents[]) => void;
}

const PreviewBlog: React.FC<BlogModalEditorProps> = ({
  initialTitle = "",
  initialSubtitle = "",
  initialContent = [],
  bannerUrl = null,
  onTableOfContentsChange,
}) => {
  const defaultBlock = {
    id: "default-block",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: " ",
        styles: {},
      },
    ],
    children: [],
  };

  const editor = useCreateBlockNote({
    initialContent:
      Array.isArray(initialContent) && initialContent.length > 0
        ? initialContent
        : [defaultBlock],
  });

  useEffect(() => {
    if (editor && Array.isArray(initialContent) && initialContent.length > 0) {
      try {
        editor.replaceBlocks(editor.document, initialContent);
      } catch (error) {
        console.error("Failed to update content:", error);
      }
    }
  }, [editor, initialContent]);

  const updateTableOfContents = useCallback(() => {
    if (!editor || !onTableOfContentsChange) return;

    const headings: TableOfContents[] = [];
    const blocks = editor.document as Block[];

    blocks.forEach((block) => {
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
    <div className="h-full">
      <div className="bg-white h-full">
        <div className="px-6 pt-4 space-y-2">
          <h1 className="text-3xl font-bold">{initialTitle}</h1>
          {initialSubtitle && (
            <p className="text-xl text-gray-600">{initialSubtitle}</p>
          )}
        </div>

        {bannerUrl && (
          <div className="relative h-80">
            <Image
              src={bannerUrl}
              alt="Blog Banner"
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
          </div>
        )}

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
            editable={false}
            onChange={updateTableOfContents}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewBlog;
