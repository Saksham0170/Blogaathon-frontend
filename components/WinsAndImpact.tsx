import React from 'react'
import Image from 'next/image'
import Circle1 from './assets/Circle1'
import Circle2 from './assets/Circle2'
import Circle3 from './assets/Circle3'

const WinsAndImpact = () => {
  return (
    <div className='relative overflow-x-hidden'>
      <div className='absolute inset-0'>
        <Image 
          src="/third-bg.png" 
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className='relative z-20 pt-4 pb-24'>
        <div className='text-2xl xl:text-3xl font-bold text-center mt-3'>Big Wins, Big Impact</div>
        <div className='flex flex-col xl:flex-row justify-center items-center  xl:mt-0'>
            <div className='relative xl:-mb-48 xl:-mr-24 z-10 scale-75 xl:scale-100'>
                <Circle2 width={500} />
                <button className='absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black px-2 py-1 text-xs xl:text-sm hover:bg-black hover:text-white transition-colors'>Read More</button>
            </div>
            <div className='relative'>
                <Circle1 width={500} />
                <button className='absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black px-2 py-1 text-xs xl:text-sm hover:bg-black hover:text-white transition-colors'>Read More</button>
            </div>
            <div className='relative xl:-mb-48 xl:-ml-24 z-10 scale-75 xl:scale-100'>
                <Circle3 width={500} />
                <button className='absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black px-2 py-1 text-xs xl:text-sm hover:bg-black hover:text-white transition-colors'>Read More</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default WinsAndImpact
