import React from 'react'
import Image from 'next/image'
import Hero1 from './assets/Hero1'
import Hero2 from './assets/Hero2'
import Link from 'next/link'
import Cookies from 'js-cookie'

const Hero = () => {
  const isLoggedIn = !!(Cookies.get('token') || Cookies.get('AdminToken') || Cookies.get('JudgeToken'))
  console.log('User is logged in:', isLoggedIn)

  return (
    <div className="relative w-full h-[400px] md:h-[600px]">
      <Image
        src="/hero.png"
        alt="Hero background"
        fill
        className="object-cover"
      />
      <Image
        src="/hero-layer.png"
        alt="Hero overlay"
        fill
        className="absolute top-0 left-0 object-cover"
      />
      <div className='absolute top-[10%] md:top-[15%] left-4 md:left-auto md:right-1 w-[90%] md:w-[40vw]'>
        <div className='text-[28px] md:text-[40px] font-bold text-white leading-[1.2]'>
          <div>Power Up</div>
          <div>Discover the Future of</div>
          <div>Cloud with Azure</div>
        </div>
        <div className='text-white my-3 md:my-5 text-lg md:text-xl font-semibold'>#PowerUpWithAzure #AzureBlogathon</div>
        <div className='flex items-center gap-2 scale-75 md:scale-100 origin-left'>
          <Hero1/>
          <Hero2/>
        </div>
        {!isLoggedIn && (
          <Link href={'/login'}>
            <button className='text-white font-bold bg-black px-4 py-2 mt-4 md:mt-8 w-full md:w-auto'>
              REGISTER NOW
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Hero
