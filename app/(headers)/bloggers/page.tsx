import React from 'react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import blogsBg from '@/public/FAQ/faqBg.png';
interface BlogItem {
  title: string;
  descriptions: string[];
}

const blogs: BlogItem[] = [
  {
    title: "A Blogger's Journey while writing a blog must contain:",
    descriptions: [
      'Problem Statement',
      'Solution/ Architecture',
      'Technical Details and Implementation of solution',
      'Challenges in implementing the solution',
      'Business Benefit',
    ],
  },
  {
    title: 'Participation Guidelines:',
    descriptions: [
      'Write a technical blog on one of the theme topics while covering examples, scenarios or relevant use of Microsoft Azure platform.',
      'Submit your experiences with your blog details on or before 20th Sept 2023.',
      'The jury panel will review the content and rate the submissions; the top 3 winners and other winners will be announced on 30th Sept 2023.',
    ],
  },
  {
    title: 'What Makes Your Blog Qualified?',
    descriptions: [
      'Your blog must be in-depth technical content containing examples, technical details, and useful & working source code; your blog must contain relevant scenarios and use cases on the Microsoft Azure platform.',
      'Your blog must be original (not plagiarised) and new material (not a republication)',
      'The length of your blog must be between 1000-1200 words.',
      'Your experience must be in a blog form that has been submitted on this website and publicly available via the internet.',
      'Best blogs will contain not just in-depth technical content but focus on knowledge sharing and best practices.',
      'Your blog must be on a topic that fits under the theme (do not submit more than one blog per category).',
      'Your blog must be written in English.',
      'The contest is open for Indian nationals only.',
      'You must be the sole author of the story.',
      'You must not be a Microsoft Employee.',
      'You give Microsoft permission to publish and share the content on the Microsoft online resources, newsletters, social media and other platforms (you will still own all the rights to your submission).',
    ],
  },
];

const BloggerCard: React.FC<{ blog: BlogItem }> = ({ blog }) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md pr-3 pl-10 py-7">
    
      <h2 className="w-[60%] text-[#2A76BC] font-bold text-3xl leading-[49.001px] font-['Segoe UI'] mb-4">
        {blog.title}
      </h2>
      <ul className="text-black text-base py-1 pl-1 md:pr-[84px] leading-[29.001px] font-['Segoe UI'] font-normal">
        {blog.descriptions.map((description, i) => (
          <li key={i} className="mb-2 list-disc ml-5">
            {description}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Page: React.FC = () => {
    return (
      <>
        <Image
        src={blogsBg}
        className="w-full absolute top-[25rem]  z-[-50] rotate-6"
        alt="blogsBg"
      />
        <div className=" max-w-4xl mx-auto px-6 pt-12 relative">
          <h1 className="text-center text-[#28456F] font-semibold text-[50px] leading-[80.851px] font-['Segoe UI'] mb-10">
            Blogger&apos;s Guide
          </h1>
          {blogs.map((blog, index) => (
            <BloggerCard key={index} blog={blog} />
          ))}
        </div>
        <Footer />
      </>
    );
  };

export default Page;