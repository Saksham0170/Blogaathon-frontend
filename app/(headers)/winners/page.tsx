import React from 'react';
import Image from 'next/image';
import winner1 from '@/public/winners/winner1.svg';
import winner2 from '@/public/winners/winner2.svg';
import winner3 from '@/public/winners/winner3.svg';
import Footer from '@/components/Footer';

const winners = [
  {
    id: 1,
    name: "Lalit Rawat",
    topic: "Setting up User and Infra Insights - Azure Application Insights",
    image: winner1,
    rank: "1st",
  },
  {
    id: 2,
    name: "Lalit Rawat",
    topic: "Setting up User and Infra Insights - Azure Application Insights",
    image: winner2,
    rank: "2nd",
  },
  {
    id: 3,
    name: "Lalit Rawat",
    topic: "Setting up User and Infra Insights - Azure Application Insights",
    image: winner3,
    rank: "3rd",
  },
];

const WinnersPage: React.FC = () => {
  return (
    <>    <div className="bg-faqbg flex flex-col items-center bg-white min-h-screen  pt-14 pb-14">
      {/* Title */}
      <h1 className="text-[#28456F] text-left font-['Segoe_UI'] text-3xl md:text-4xl lg:text-5xl font-bold leading-[122.502%]">
        Phase 1 Winner&apos;s
      </h1>
      <p className="text-[#28456F] md:w-[23rem] font-['Segoe_UI'] text-xl md:text-[26px] text-left font-bold leading-[122.502%] md:mt-2" style={{ wordSpacing: '0.1em' }}>
  Theme: Data & AI and Apps
</p>

      {/* Subtitle */}
      <div className="mt-8 md:mt-24 mb-4 text-center">
  <h2 className="text-4xl font-bold gradient-text">TOP 3 WINNERS</h2>
  <p className="text-2xl font-semibold gradient-text">Congratulations!</p>
</div>


      {/* Winners Cards */}
      {/* Winners Cards */}
{/* Winners Cards */}
<div className="flex flex-col items-center mt-6 px-1 pt-1 lg:h-[50rem] ">
  {/* Top Winner */}
  <div className="flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md pb-6 pt-3 px-3 w-[280px] md:w-[320px] lg:w-[330px] text-center mb-4 md:mb-0">
    <div className="relative w-full h-72 mx-auto mb-4">
      <Image src={winners[0].image} alt={winners[0].name} className="w-full h-full" />
    </div>
    <h3 className="text-lg font-semibold">{winners[0].name}</h3>
    <p className="text-gray-500 text-sm">Topic:</p>
    <p className="text-gray-700 text-sm mb-4">{winners[0].topic}</p>
    <button className="mt-auto px-9 py-1 text-black rounded-md text-sm border border-blue-400">
      View
    </button>
  </div>

  {/* Bottom Row Winners */}
  <div className="flex flex-col gap-y-4  md:flex-row items-center  w-full md:gap-x-14 lg:gap-x-[30rem] lg:relative lg:bottom-48">
    {winners.slice(1).map((winner) => (
      <div
        key={winner.id}
        className="flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md pb-6 pt-3 px-3 w-[280px] md:w-[320px] lg:w-[320px] text-center"
      >
        <div className="relative w-full h-72 mx-auto mb-4">
          <Image src={winner.image} alt={winner.name} className="w-full h-full" />
        </div>
        <h3 className="text-lg font-semibold">{winner.name}</h3>
        <p className="text-gray-500 text-sm">Topic:</p>
        <p className="text-gray-700 text-sm mb-4">{winner.topic}</p>
        <button className="mt-auto px-9 py-1 text-black rounded-md text-sm border border-blue-400">
          View
        </button>
      </div>
    ))}
  </div>
</div>


    </div>

    <Footer/>
    </>

  );
};

export default WinnersPage;
