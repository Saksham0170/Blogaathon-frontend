"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

interface SidebarProps {
  tableOfContents?: TableOfContents[];
  onHeadingClick?: (id: string) => void;
  content?: unknown[];
  onGoBack?: () => Promise<void>;
}

const calculateReadingTime = (blocks: unknown[]): number => {
  const wordsPerMinute = 200;
  let totalWords = 0;

  blocks.forEach((block) => {
    if (typeof block === "object" && block !== null && "content" in block) {
      if (Array.isArray(block.content)) {
        block.content.forEach((content) => {
          if (content.type === "text") {
            const words = content.text.trim().split(/\s+/).length;
            totalWords += words;
          }
        });
      }
    }
  });

  return Math.ceil(totalWords / wordsPerMinute);
};

const Sidebar: React.FC<SidebarProps> = ({
  tableOfContents = [],
  onHeadingClick,
  content = [],
  onGoBack,
}) => {

  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const readingTime = calculateReadingTime(content);

  const handleDashboardClick = async () => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);
      if (onGoBack) {
        await onGoBack();
      }
      router.push("/dashboard/user");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
      setIsNavigating(false);
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 h-screen bg-white border-r transition-all duration-300 flex flex-col overflow-y-auto",
        isCollapsed ? "w-12" : "w-64"
      )}
    >
      <div className="flex-none flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="font-semibold">Table of Contents</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-none p-4 border-b text-sm text-gray-600">
            {readingTime} min read
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => onHeadingClick?.(item.id)}
                className={cn(
                  "block w-full text-left px-2 py-1 rounded hover:bg-gray-100",
                  "transition-colors duration-200",
                  item.level === 1 ? "font-semibold" : "pl-4 text-sm"
                )}
                style={{
                  paddingLeft: `${(item.level - 1) * 1}rem`,
                }}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </>
      )}

      <div className="flex-none p-4 border-t bg-white mt-auto">
        <button
          onClick={handleDashboardClick}
          disabled={isNavigating}
          className={cn(
            "w-full text-blue-500 hover:text-blue-600 font-medium text-left flex items-center",
            isNavigating && "opacity-50 cursor-not-allowed"
          )}
        >
          {isCollapsed ? (
            <ChevronLeft size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span className="ml-2">Dashboard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
