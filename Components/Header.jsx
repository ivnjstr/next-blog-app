'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import ThemeToggle from '@/Components/ThemeToggle';

const Header = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    const response = await axios.post('/api/email', formData);
    if (response.data.success){
      toast.success(response.data.msg);
      setEmail("");
    } else {
      toast.error("Error subscribing");
    }
  }

  return (
    <div className='py-8 px-6 md:px-12 lg:px-28 bg-white dark:bg-gray-950'>
      {/* Navbar Section */}
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        <Image src={assets.logo} width={140} alt='Logo' className='w-28 sm:w-36 dark:hidden' />
        <Image src={assets.logo_light} width={140} alt='Logo' className='w-28 sm:w-36 hidden dark:block' />
        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <Link href={session ? '/admin' : '/signup'}>
          <button className='flex items-center gap-2 font-semibold py-2 px-5 sm:px-8 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-sm'>
            {session ? 'Dashboard' : 'Get Started'} <Image src={assets.arrow} alt='' className='invert dark:invert-0 w-3' />
          </button>
          </Link>
        </div>
      </div>

      {/* Hero Content */}
      <div className='text-center mt-20 max-w-3xl mx-auto'>
        <h1 className='text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Discover Your Next <br />
          <span className="text-gray-400 dark:text-gray-500">Great Adventure</span>
        </h1>

        <p className='mt-6 text-gray-500 dark:text-gray-400 text-sm sm:text-lg leading-relaxed px-4'>
          Curated stories from around the globe, covering everything from startup culture
          to the world's most hidden travel gems.
        </p>

        {/* Updated Subscription Form */}
        <form
          onSubmit={onSubmitHandler}
          className='flex items-center max-w-md mx-auto mt-12 p-1 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 focus-within:border-black dark:focus-within:border-white transition-all'
        >
          <input
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder='Enter your email address'
            className='flex-1 bg-transparent pl-6 py-3 outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
            required
          />
          <button
            type='submit'
            className='bg-black dark:bg-white text-white dark:text-black py-3 px-6 sm:px-10 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all'
          >
            Subscribe
          </button>
        </form>

        {/* Subtle separator */}
        {/* <div className="mt-16 w-20 h-1 bg-black mx-auto rounded-full opacity-10"></div> */}
      </div>
    </div>
  )
}

export default Header