'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import instagram from '@/public/instagram.png';
import facebook from '@/public/facebook.png';
import twitter from '@/public/twitter.png';
import linkedin from '@/public/linkedin.png';
import mail from '@/public/mail.png';
import doubleUp from '@/public/doubleUp.png';

const Footer = () => {
    const quickLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'About Blogathon', href: '/#about' },
        { name: 'Register Now', href: '/register' },
        { name: `Faq's`, href: '/#forum' },
        { name: 'Privacy Policy', href: 'https://www.microsoft.com/en-us/privacy/privacystatement' },
    ];

    return (
        <footer className="bg-black text-white py-8 md:py-16 font-segoe">
            <section className="flex flex-col gap-y-5 px-6 sm:px-12 lg:px-24">
                <div className="flex flex-col gap-y-8 md:flex-row md:justify-between md:h-48">
                    {/* Brand and Socials */}
                    <div className="space-y-4 md:space-y-10 pr-0 md:pr-10 pb-2 md:border-b-[1px] border-gray-600 ">
                        <div className="flex flex-col items-start md:items-end">
                            <Link href='/#home'>
                            <h1 className="font-semibold text-2xl sm:text-3xl">
                                <span className="text-blue-500">Azure</span> Blogathon
                            </h1>
                            <p className="text-[10px] md:text-[13px] text-end">Powered by ID8NXT LLP</p>
                            </Link>
                        </div>
                        <div className="flex gap-4 md:gap-0 md:justify-between">
                          <Link href ='https://www.instagram.com/azureblogathon/'  target='_blank'>  <Image src={instagram} alt="Instagram" width={24} height={24} /> </Link>
                          <Link href ='https://x.com/ABlogathon/' target='_blank'>  <Image src={twitter} alt="Twitter" width={24} height={24} /></Link>
                          <Link href ='https://www.facebook.com/azureblogathon' target='_blank'><Image src={facebook} alt="Facebook" width={24} height={24} /></Link>
                          <Link href ='https://www.linkedin.com/company/azure-blogathon/' target='_blank'> <Image src={linkedin} alt="LinkedIn" width={34} height={24} /></Link>
                        </div>
                    </div>

                    {/* Archive */}
                    <div className="space-y-4 md:space-y-16 pr-0 md:pr-10 pb-2 md:border-b-[1px] border-gray-600 e">
                        <h2 className="font-semibold text-2xl sm:text-3xl">ARCHIVE</h2>
                        <p className="text-base">2022 Edition: Unleash The Blogger in You</p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4 md:space-y-12 pr-0 md:pr-10 pb-2 md:border-b-[1px] border-gray-600  w-full md:w-[350px]">
                        <h2 className="font-semibold text-2xl sm:text-3xl">Quick Links</h2>
                        <div className="flex flex-wrap gap-4 py-2 md:py-4">
                            {quickLinks.map((link, index) => (
                                <Link href={link.href}  target={index === 4 ? "_blank" : "_self"}  key={index} className="hover:underline text-base">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                </div>
                <div className="flex flex-col md:self-end gap-y-4 pr-0 md:pr-10 lg:pt-6 w-full md:w-auto lg:w-[350px]">
                    <h2 className="font-semibold text-2xl sm:text-3xl">Get In Touch</h2>
                    <div className="flex gap-2 items-center">
                        <Image src={mail} alt="Email" width={20} height={20} />
                        <a  className="hover:underline text-sm">
                            info@azureblogathon.com
                        </a>
                    </div>
                </div>

                {/* Bottom Branding */}
              

                {/* Back to Top Button */}
                <div onClick={() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }} className="circle w-10 h-10 sm:w-11 sm:h-11 rounded-full fixed right-3 bottom-6 md:right-10 md:bottom-11 bg-blue-600 p-2 flex items-center justify-center">
                    <Image src={doubleUp} alt="Back to Top" />
                </div>
            </section>
            <div className="min-w-full border-t border-gray-700 pt-6 md:pt-8 text-center text-xs md:text-sm mt-6 md:mt-8">
                    <Link href={'https://id8nxt.com/wp-content/uploads/2023/11/Privacy_Policy_ID8NXT.pdf'} target='_blank' className=" text-2xl md:text-lg font-semibold">Powered by ID8NXT</Link>
                </div>
        </footer>
    );
};

export default Footer;