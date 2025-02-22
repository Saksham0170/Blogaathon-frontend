import { create } from 'zustand';

// Define the Judge interface
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
  children: any[];
}
interface BlogScore {
  [key: string]: number | string; // Allow both numbers and strings
  
           // Fixed string property
}
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

// Define the Zustand store
interface JudgeStore {
  judge: Judge | null;
  setJudge: (newJudge: Judge) => void;
  resetJudge: () => void;
}

const useJudgeStore = create<JudgeStore>((set) => ({
  judge: null,
  setJudge: (newJudge) => set({ judge: newJudge }),
  resetJudge: () => set({ judge: null }),

  // Function to append a blog to the judge's assignedBlogs array
  appendBlogToJudge: (newBlog: Blog) =>
    set((state) => {
      if (!state.judge) {
        console.warn("No judge available to assign blogs.");
        return state; // Return unchanged state
      }

      // Ensure assignedBlogs exists and append the new blog
      const updatedJudge: Judge = {
        ...state.judge,
        assigndBlogs: [...(state.judge.assigndBlogs || []), newBlog],
      };

      return { judge: updatedJudge };
    }),
}));

// Usage example:
// const { judge, appendBlogToJudge } = useJudgeStore();
// appendBlogToJudge(newBlog);

export default useJudgeStore;
