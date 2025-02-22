'use client'
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import timeline from '@/public/FAQ/timeline.svg';
import arrowUp from '@/public/FAQ/arrowUp.svg'

interface Question {
  id: number;
  question: string;
  answer: string;
}

// Move questions array outside the component
const questions: Question[] = [
  {
    id: 1,
    question: "What is the Azure Blogathon?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 2,
    question: "Who can participate in the Azure Blogathon?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 3,
    question: "How do I participate in the Azure Blogathon?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 4,
    question: "Are there any specific themes or topics for the blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 5,
    question: "What are the submission guidelines for blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 6,
    question: "Is there a deadline for submitting blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 7,
    question: "How are blog posts judged?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 8,
    question: "Are there any specific themes or topics for the blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 9,
    question: "What are the submission guidelines for blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 10,
    question: "Is there a deadline for submitting blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 11,
    question: "How are blog posts judged?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 12,
    question: "What prizes are offered for the best blog posts?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 13,
    question: "Where can I find resources to help with my blog post?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },
  {
    id: 14,
    question: "Will the blog posts be published on the Azure Blogathon website?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },  {
    id: 15,
    question: "How can I stay updated on the Azure Blogathon?",
    answer: "The Azure Blogathon is a community-driven event focused on sharing knowledge, experiences, and insights related to Microsoft Azure."
  },
]

const Faq: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const answerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const updateHeights = React.useCallback(() => {
    const newHeights: { [key: number]: number } = {};
    questions.forEach(q => {
      if (answerRefs.current[q.id]) {
        newHeights[q.id] = answerRefs.current[q.id]?.scrollHeight || 0;
      }
    });
    setHeights(newHeights);
  }, []); // No dependencies needed since questions is now static

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateHeights();
      window.addEventListener('resize', updateHeights);

      return () => window.removeEventListener('resize', updateHeights);
    }
  }, [updateHeights]);

  const toggleQuestion = (id: number) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  const setRef = (id: number) => (el: HTMLDivElement | null) => {
    answerRefs.current[id] = el;
  };

  return (
     
     <>
        
     <div id='timeline' className="w-full md:pt-9">
      {/* Timeline Section */}
      <section id="timeline" className="px-4 md:px-8">
        <div className="content flex flex-col justify-center items-center pt-10 pb-7 gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-[#28456F] text-center font-segoe font-bold mb-6">
            Timeline For Phase 2
          </h1>
          <Image src={timeline} alt="timeline" className="w-full max-w-[800px] h-auto" />
        </div>
      </section>

      {/* FAQ Section */}
      <div  id='forum'  className="bg-faqbg flex justify-center py-8 sm:py-14 px-4">
        <section className="flex flex-col max-w-3xl md:max-w-5xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-[#28456F] font-segoe font-bold">
              FAQs - Blogathon
            </h1>
          </div>
        
          <div className="space-y-3 sm:space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-3 sm:p-4 rounded-lg cursor-pointer border border-transparent hover:border-[#09EDE0]/20 transition-colors duration-200 mx-auto w-full"
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3
                    className={`text-sm sm:text-base font-segoe font-semibold transition-colors duration-200 ${activeQuestion === q.id ? 'text-black' : 'text-black'}`}
                  >
                    <span className="mr-2">•</span>
                    {q.question}
                  </h3>
                  <div
                    className={`transform transition-transform duration-200 flex-shrink-0 ${activeQuestion === q.id ? '' : 'rotate-180'}`}
                  >
                    <Image alt="arrow" src={arrowUp} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <div
                  ref={setRef(q.id)}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    height: activeQuestion === q.id ? `${heights[q.id]}px` : '0',
                  }}
                >
                  <p className="text-black font-normal mt-2 text-sm sm:text-base">
                    {q.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

      
    </>

  );
};

export default Faq;