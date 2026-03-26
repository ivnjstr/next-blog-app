import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-black py-12 px-6 md:px-12 lg:px-28'>
      <div className='max-w-7xl mx-auto flex flex-col gap-8 sm:gap-0 sm:flex-row justify-between items-center'>
        
        {/* Logo Section */}
        <div className='flex flex-col items-center sm:items-start gap-4'>
          <Image src={assets.logo_light} alt='Logo' width={120} className='opacity-90 transition-opacity hover:opacity-100' />
          <p className='text-gray-500 text-[13px] tracking-wide'>
            Curating the best stories for the modern explorer.
          </p>
        </div>

        {/* Copyright Section */}
        <p className='text-gray-400 text-sm font-light order-3 sm:order-2'>
          © 2026 Ivan Jester. All rights reserved.
        </p>

        {/* Social Icons Section */}
        <div className='flex gap-6 order-2 sm:order-3'>
          <a href="#" className="transition-transform hover:-translate-y-1">
            <Image src={assets.facebook_icon} alt='Facebook' width={24} className='invert brightness-200' />
          </a>
          <a href="#" className="transition-transform hover:-translate-y-1">
            <Image src={assets.twitter_icon} alt='Twitter' width={24} className='invert brightness-200' />
          </a>
          <a href="#" className="transition-transform hover:-translate-y-1">
            <Image src={assets.googleplus_icon} alt='Google Plus' width={24} className='invert brightness-200' />
          </a>
        </div>
        
      </div>

      {/* Subtle Bottom Border/Line */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-white/10"></div>
    </footer>
  )
}

export default Footer