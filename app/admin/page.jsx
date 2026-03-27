'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { assets } from '@/Assets/assets'
import Link from 'next/link'

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    subs: 0
  });

  // Fetching data to show real numbers on the dashboard
  const fetchStats = async () => {
    try {
      const blogRes = await axios.get('/api/blog');
      const emailRes = await axios.get('/api/email');
      setStats({
        blogs: blogRes.data.blogs.length,
        subs: emailRes.data.emails.length
      });
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className='flex-1 bg-[#fcfcfc] min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-gray-900'>Welcome back, Editor</h1>
        <p className='text-gray-500 mt-2'>Here is what's happening with your publication today.</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
        
        {/* Blog Count Card */}
        <div className='bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center gap-4 mb-4'>
             <div className='p-3 bg-blue-50 rounded-2xl'>
                <Image src={assets.blog_icon} width={24} alt='' />
             </div>
             <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Total Stories</p>
          </div>
          <h2 className='text-4xl font-bold text-gray-900'>{stats.blogs}</h2>
        </div>

        {/* Subscriber Count Card */}
        <div className='bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center gap-4 mb-4'>
             <div className='p-3 bg-green-50 rounded-2xl'>
                <Image src={assets.email_icon} width={24} alt='' />
             </div>
             <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Subscribers</p>
          </div>
          <h2 className='text-4xl font-bold text-gray-900'>{stats.subs}</h2>
        </div>

        {/* Quick Action Card */}
        <Link href='/admin/addProduct' className='group bg-black p-8 rounded-3xl border border-black shadow-lg shadow-black/10 flex flex-col justify-center items-center text-center hover:bg-gray-800 transition-all'>
           <div className='p-3 bg-white/10 rounded-2xl mb-2 group-hover:scale-110 transition-transform'>
              <Image src={assets.add_icon} width={24} alt='' className='invert' />
           </div>
           <p className='text-white font-bold'>Create New Post</p>
           <p className='text-gray-400 text-xs mt-1'>Share a new story with the world</p>
        </Link>

      </div>

      {/* Decorative Editorial Quote or Tip */}
      <div className='max-w-4xl bg-gray-50 p-10 rounded-3xl border border-gray-100 italic text-gray-600 leading-relaxed'>
        <p className='text-lg'>
          "Design is not just what it looks like and feels like. Design is how it works."
        </p>
        <p className='mt-4 text-sm font-bold not-italic text-gray-400 uppercase tracking-widest'>— Editorial Tip of the Day</p>
      </div>
    </div>
  )
}

export default Dashboard