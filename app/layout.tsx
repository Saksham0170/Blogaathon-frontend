import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";
// import { usePathname } from "next/navigation";

const SegoeUI = localFont({
  src: "./fonts/SegoeUI.ttf",
  variable: "--font-segoe-ui",
});

export const metadata: Metadata = {
  title: "Azure Blogathon ",
  description: "Azure Blogathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/msLogo.svg " />
      </head>
      <body className={`${SegoeUI.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontSize: "0.875rem",
                maxWidth: "500px",
                padding: "8px 12px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
