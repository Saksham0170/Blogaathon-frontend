import React from 'react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import forumBg from '@/public/forumBg.png';

const Page: React.FC = () => {
    return (
        <>
            <Image
                src={forumBg}
                alt="forums"
                width={500}
                height={500}
                className="w-full h-[200px] md:h-full absolute top-56 md:top-44 left-0 z-[-50]"
            />
            <div className="min-h-[70vh] lg:min-h-screen flex flex-col px-4 pt-10 md:pt-9 md:pl-24 md:pr-8 font-segoe gap-y-8 md:gap-y-14">
                <div className="max-w-4xl">
                    <h1 className="text-3xl md:text-[47px] font-bold text-[#28456F] mb-4">
                        Your Questions, Our Answers
                    </h1>
                    <div className="flex flex-col text-lg md:text-3xl font-bold text-[#2A76BC] mt-4 md:mt-10">
                        <p>Have a question about Azure?</p>
                        <p>Need help with your blog post?</p>
                        <p>Join the conversation!</p>
                    </div>
                </div>
                <div className="max-w-4xl flex flex-col">
                    <p className="text-base md:text-4xl text-black font-semibold">
                        Our Community of Azure Enthusiasts is Here to Help!
                    </p>
                    <p className="text-xs md:text-base text-gray-600 mt-2">
                        Ask your questions, share insights, and learn from fellow users. Whether you&apos;re an experienced developer or just starting out, you&apos;ll find friendly support and guidance here. Together, let&apos;s collaborate, share knowledge, and build amazing projects!
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Page;
