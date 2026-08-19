import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'
import { FacebookIcon, InstagramIcon, XIcon } from '@/Components/SocialIcons'

const Footer = () => {
  return (
    <footer className='bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 px-6 md:px-12 lg:px-28'>
      <div className='max-w-7xl mx-auto flex flex-col gap-8 sm:gap-0 sm:flex-row justify-between items-center'>

        {/* Logo Section */}
        <div className='flex flex-col items-center sm:items-start gap-4'>
          <Image src={assets.logo} alt='Logo' width={120} className='dark:hidden opacity-90 transition-opacity hover:opacity-100' />
          <Image src={assets.logo_light} alt='Logo' width={120} className='hidden dark:block opacity-90 transition-opacity hover:opacity-100' />
          <p className='text-gray-500 dark:text-gray-400 text-[13px] tracking-wide'>
            Curating the best stories for the modern explorer.
          </p>
        </div>

        {/* Copyright Section */}
        <p className='text-gray-400 dark:text-gray-500 text-sm font-light order-3 sm:order-2'>
          © 2026 Ivan Jester. All rights reserved.
        </p>

        {/* Social Icons Section */}
        <div className='flex gap-5 order-2 sm:order-3 text-gray-500 dark:text-gray-400'>
          <a href="#" aria-label="Facebook" className="hover:text-black dark:hover:text-white transition-colors hover:-translate-y-1">
            <FacebookIcon className="w-7 h-7" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-black dark:hover:text-white transition-colors hover:-translate-y-1">
            <InstagramIcon className="w-7 h-7" />
          </a>
          <a href="#" aria-label="X" className="hover:text-black dark:hover:text-white transition-colors hover:-translate-y-1">
            <XIcon className="w-7 h-7" />
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer