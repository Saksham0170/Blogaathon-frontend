import { create } from 'zustand';
import { toast } from 'react-hot-toast';

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
  children: unknown[];
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
  assignedJudge?: string;
}

interface BlogScore {
  [key: string]: number | string;
}

interface Judge {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  organizationName: string;
  industry: string;
  city: string;
  assignedBlogs: number;
  expertise: string[];
  availability: 'available' | 'busy';
}

export interface EmailTemplate {
  subject: string;
  body: string;
  category: 'Pending' | 'Accepted' | 'Rejected' | 'all';
}

interface UserDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  currentRole: string;
  organizationName: string;
  industry: string;
  city: string;
  photoUrl: string;
  created_at: string;
}

interface BlogDetails {
  blogId: number;
  title: string;
  blog_author_email: string;
  blog_author_name: string | null;
  status: string;
  isSubmitted: boolean;
  markedAs: string;
}

export interface Organizer {
  fullName: string;
  email: string;
  created_at: string;
  blogs: Blog[];
  judges: Judge[];
  userDetails: UserDetails | null;
  blogDetails: BlogDetails[] | null;
}

interface OrganizerStore {
  organizer: Organizer | null;
  setOrganizer: (newOrganizer: Organizer) => void;
  resetOrganizer: () => void;
  assignJudgeToBlog: (blogId: number, judgeId: string) => void;
  sendEmailToUsers: (template: EmailTemplate) => void;
}

const useOrganizerStore = create<OrganizerStore>((set) => ({
  organizer: null,
  setOrganizer: (newOrganizer) => set({ organizer: newOrganizer }),
  resetOrganizer: () => set({ organizer: null }),
  assignJudgeToBlog: (blogId, judgeId) =>
    set((state) => {
      if (!state.organizer) return state;

      const updatedBlogs = state.organizer.blogs.map(blog =>
        blog.blogId === blogId ? { ...blog, assignedJudge: judgeId } : blog
      );

      return {
        organizer: {
          ...state.organizer,
          blogs: updatedBlogs
        }
      };
    }),
  sendEmailToUsers: async (template) => {
    console.log('Sending email:', template);
    toast.success('Email sent successfully');
  },
}));

export default useOrganizerStore; 