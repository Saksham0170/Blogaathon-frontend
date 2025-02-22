'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';

interface PrizeCard {
  image: string;
  alt: string;
  description: string;
  highlightedText?: string;
}

const PrizesAndRewards = ({ title = "Prizes and Rewards", subtitle = "Winnings are big at the Microsoft Azure Blogathon. Here are all the things that you can win during each of the four quarters:" }) => {
  const cards: PrizeCard[] = [
    {
      image: "/prize1.png",
      alt: "Prizes and Rewards",
      description: "Top 3 winners stand a chance to win",
      highlightedText: "a Croma Gift Card worth 40,000 INR."
    },
    {
      image: "/prize2.png",
      alt: "Surface Device", 
      description: "The top 20 winners will receive an",
      highlightedText: "a Flipkart online voucher worth 1000 INR."
    },
    {
      image: "/prize3.png",
      alt: "Microsoft Swag",
      description: "The next 50 outstanding submissions will get a special",
      highlightedText: "Microsoft-branded swag bag."
    },
    {
      image: "/prize4.png",
      alt: "Microsoft Swag",
      description: "Selected blog entries will be rewarded with an",
      highlightedText: "Azure Certification Exam Voucher. T&C."
    }
  ];

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <div className='text-[#28456F] text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-5'>{title}</div>
      <div className='text-[#3C3C41] text-sm md:text-base text-center mb-8 md:mb-12'>{subtitle}</div>
      
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {cards.map((card, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-[350px] md:h-[400px] lg:h-[450px]">
                  <CardContent className="flex flex-col items-center p-4 md:p-6 h-full">
                    <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden flex items-center justify-center">
                      <Image
                        width={300}
                        height={300}
                        src={card.image}
                        alt={card.alt}
                        className="w-full h-full object-contain rounded-t-lg"
                      />
                    </div>
                    <div className='bg-[#EDEDED] w-full h-[1px]'></div>
                    <div className="mt-4 md:mt-6 flex-grow flex items-center">
                      <p className="text-base md:text-lg text-center font-semibold">
                        <span className="text-[#212529]">{card.description}</span>{' '}
                        <span className="text-[#0178D4]">{card.highlightedText}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default PrizesAndRewards
