import React from 'react'
import Image from 'next/image'

const Blogathon = () => {
  return (
    <div id='about' className="relative pt-12 xl:pt-24 xl:pb-36 pb-48">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/second-section-bg.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className='w-[90%] md:w-[50vw] mx-auto text-center font-semibold'>
        <div className='text-[#28456F] text-3xl md:text-5xl font-bold mb-8'>The Azure Blogathon</div>
        <div className='text-xs md:text-sm text-[#3C3C41]'>
            <div className='mb-3'>The Azure Blogathon is back and this is your chance to showcase your skills, learn from experts, and connect with a global community of developers. Whether you&apos;re a seasoned pro or just starting out, there&apos;s something for everyone.</div>
            <div className='mb-5'>This isn&apos;t just a challenge; it&apos;s a celebration of innovation and a chance to build for the next generation The top 3 blogs will be awarded a Microsoft Surface Pro X, and exclusive goodies, your expertise in Data, AI, Apps, Infra-Core, or Security will turn your vision into impact with Microsoft Azure.</div>
            <div className='mb-12 md:mb-24'><span className='text-base md:text-lg font-bold'>Ready to level up your Azure skills? </span><br />It&apos;s time to unleash your inner tech wizard. Check out the Blogger&apos;s Guide and start your blogging adventure today!</div>
        </div>
      </div>
      <div className='flex flex-col xl:flex-row justify-center items-center px-4 xl:px-0'>
          <div className="relative z-20 p-[10px] w-[90%] xl:w-[35vw] -mb-12 xl:-mb-48" style={{backgroundImage: "url('/second-third.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}>
            <div className='bg-white py-5 px-4 xl:px-8'>
                <div className='text-[#28456F] text-3xl xl:text-[44px] leading-tight md:leading-[50px] font-bold text-center mb-5'>Themes & Topics</div>
                <div className='text-[#3C3C41] text-center text-sm xl:text-[16px] flex flex-col gap-3'>
                    <div>The Azure Blogathon challenge invites you to select a topic that aligns with your professional interest. Your blogs must be rigorous technical explorations, filled with detailed analysis, concrete examples, and functional source code. Delve into real-world scenarios and use cases on the Microsoft Azure platform, displaying a mastery that reflects your competence and creativity.</div>
                    <div>This is your opportunity to leverage the Microsoft Cloud as the best foundational investment for others to learn and adapt in Data, AI, Apps, Infra-Core, or Security, and win rewards. Don&apos;t just follow the trends; set them.</div>
                    <div>Join us in the Azure Blogathon challenge. Together, we&apos;ll innovate, inspire, and lead the way.</div>
                </div>
            </div>
          </div>
          <div className="relative z-10 md:-ml-16 p-[12px] w-[90%] xl:w-[45vw] mt-4 md:mt-0" style={{backgroundImage: "url('/second-one.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}}>
            <Image src="/second-two.png" alt="Inner image" width={1000} height={1000} className="w-full h-auto"/>
          </div>
      </div>
    </div>
  )
}

export default Blogathon
