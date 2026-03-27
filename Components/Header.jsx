import { assets } from '@/Assets/assets'
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Header = () => {
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
    <div className='py-8 px-6 md:px-12 lg:px-28 bg-white'>
      {/* Navbar Section */}
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        <Image src={assets.logo} width={140} alt='Logo' className='w-28 sm:w-36' />
        <Link href='/admin' >
        <button className='flex items-center gap-2 font-semibold py-2 px-5 sm:px-8 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-sm'>
          Get Started <Image src={assets.arrow} alt='' className='invert w-3' />
        </button>
        </Link>
       
      </div>

      {/* Hero Content */}
      <div className='text-center mt-20 max-w-3xl mx-auto'>
        <h1 className='text-4xl sm:text-6xl font-bold tracking-tight text-gray-900'>
          Discover Your Next <br /> 
          <span className="text-gray-400">Great Adventure</span>
        </h1>
        
        <p className='mt-6 text-gray-500 text-sm sm:text-lg leading-relaxed px-4'>
          Curated stories from around the globe, covering everything from startup culture 
          to the world's most hidden travel gems.
        </p>

        {/* Updated Subscription Form */}
        <form 
          onSubmit={onSubmitHandler} 
          className='flex items-center max-w-md mx-auto mt-12 p-1 bg-gray-100 rounded-full border border-gray-200 focus-within:border-black transition-all'
        >
          <input 
            onChange={(e)=>setEmail(e.target.value)} 
            value={email} 
            type="email" 
            placeholder='Enter your email address' 
            className='flex-1 bg-transparent pl-6 py-3 outline-none text-sm' 
            required
          />
          <button 
            type='submit' 
            className='bg-black text-white py-3 px-6 sm:px-10 rounded-full text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all'
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