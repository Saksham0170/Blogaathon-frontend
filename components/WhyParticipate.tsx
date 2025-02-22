import React from 'react'
import Participate1 from '@/components/assets/Participate1'
import Participate2 from '@/components/assets/Participate2'
import Participate3 from '@/components/assets/Participate3'
import Participate4 from '@/components/assets/Participate4'
import Participate5 from '@/components/assets/Participate5'
import Participate6 from '@/components/assets/Participate6'

interface ParticipateCard {
  Icon: React.ComponentType;
  title: string;
  description: string;
}

const participateData: ParticipateCard[] = [
  {
    Icon: Participate1,
    title: "Elevate Your Expertise",
    description: "Showcase your Azure skills and become a recognized leader in the tech community."
  },
  {
    Icon: Participate2,
    title: "Share Your Knowledge",
    description: "Help others learn from your experiences and insights with Azure technologies."
  },
  {
    Icon: Participate3,
    title: "Win Amazing Prizes",
    description: "Get rewarded for your contributions with exciting prizes and recognition."
  },
  {
    Icon: Participate4,
    title: "Build Your Network",
    description: "Connect with fellow Azure enthusiasts and expand your professional network."
  },
  {
    Icon: Participate5,
    title: "Enhance Your Portfolio",
    description: "Add published blog posts to your professional portfolio and resume."
  },
  {
    Icon: Participate6,
    title: "Learn and Grow",
    description: "Deepen your understanding of Azure through research and writing."
  }
];

interface WhyParticipateProps {
  title?: string;
  cards?: ParticipateCard[];
}

const WhyParticipate = ({ title = "Why Participate?", cards = participateData }: WhyParticipateProps) => {
  return (
    <div className='bg-[url("/why-participate-bg.png")] bg-cover bg-center bg-no-repeat'>
      <div className='relative z-10 text-[#28456F] text-3xl md:text-4xl lg:text-5xl font-bold text-center pt-8 md:pt-12 mb-8 md:mb-16'>{title}</div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-7 pb-8 md:pb-12 mx-4 md:mx-8 lg:mx-12'>
        {cards.map((card, index) => {
          const Icon = card.Icon;
          return (
            <div key={index} className='bg-white/90 backdrop-blur-sm shadow-xl flex flex-col md:flex-row gap-3 md:gap-5 p-4 md:p-6 rounded-lg'>
              <div className='flex justify-center md:justify-start md:h-full md:items-center'>
                <Icon />
              </div>
              <div className='flex flex-col gap-2 md:gap-3 text-[#3C3C41] text-center md:text-left'>
                <div className='text-xl md:text-2xl font-semibold'>{card.title}</div>
                <div className='text-base md:text-lg'>{card.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default WhyParticipate