import { create } from "zustand";

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

interface Blog {
  blogId: number;
  lastUpdates: string;
  title: string;
  content: BlogContent[];
  markedAs: string;
  isSubmitted: boolean;
  status?: string;
  feedback?: string | null;
  bannerUrl?: string;
}

interface UserDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  currentRole: string;
  organizationName: string;
  industry: string;
  city: string;
  otherRole: string;
  created_at: string;
  photoUrl?: string;
  blog?: Blog;
}

interface UserStore {
  user: UserDetails | null;
  setUser: (userDetails: UserDetails) => void;
  updateBlogDetails: (blogDetails: Blog | null) => void;
  updateBasicDetails: (basicDetails: Partial<UserDetails>) => void;
  resetUser: () => void;
  currentBlogContent: unknown[];
  currentBlogTitle: string | null;
  currentBlogBannerUrl: string | null;
  setCurrentBlogContent: (content: unknown[]) => void;
  setCurrentBlogTitle: (title: string | null) => void;
  setCurrentBlogBannerUrl: (bannerUrl: string | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userDetails) =>
    set(() => ({
      user: userDetails,
    })),
  updateBlogDetails: (blog) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            blog: blog ? { ...blog } : state.user.blog,
          }
        : null,
    })),
  updateBasicDetails: (basicDetails) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...basicDetails,
          }
        : null,
    })),
  resetUser: () =>
    set(() => {
      console.log("resetting user");
      return { user: null };
    }),
  currentBlogContent: [],
  currentBlogTitle: null,
  currentBlogBannerUrl: null,
  setCurrentBlogContent: (content) => set({ currentBlogContent: content }),
  setCurrentBlogTitle: (title) => set({ currentBlogTitle: title }),
  setCurrentBlogBannerUrl: (bannerUrl) =>
    set({ currentBlogBannerUrl: bannerUrl }),
}));

export default useUserStore;
