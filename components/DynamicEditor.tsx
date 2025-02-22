"use client";

import dynamic from "next/dynamic";

// Dynamically import the BlogModalEditor component with SSR disabled
const DynamicBlogModalEditor = dynamic(() => import("./Dashboard/user/Editor"), { ssr: false });

export default DynamicBlogModalEditor; 