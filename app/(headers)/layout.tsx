import type { Metadata } from "next";
// import localFont from "next/font/local";

import Header from "../../components/Header"; 
import { AuthProvider } from "@/components/providers/auth-provider";
// import { usePathname } from "next/navigation";

// const SegoeUI = localFont({
//   src: "./fonts/SegoeUI.ttf",
//   variable: "--font-segoe-ui"
// });


export const metadata: Metadata = {
  title: "Azure Blogathon ",
  description: "Azure Blogathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();
  // const showHeader = pathname !== '/login';

  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/svg+xml" href="/msLogo.svg " />
      </head>
      <body
      
      >
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
