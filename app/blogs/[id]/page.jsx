'use client'
import { assets } from '@/Assets/assets'
import Footer from '@/Components/Footer'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'

const Page = ({ params }) => {
  const { id } = use(params)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null)

  const fetchBlogData = async () => {
    const response = await axios.get('/api/blog', { params: { id } })
    setData(response.data);
  }

  useEffect(() => {
    setLoading(true);
    fetchBlogData().finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
            <p className="text-gray-400 font-medium">Loading Story...</p>
          </div>
        </div>
      ) : data ? (
        <div className="bg-white min-h-screen">
          {/* Transparent Header Over soft background */}
          <div className='bg-[#f9f9f9] py-8 px-6 md:px-12 lg:px-28'>
            <div className='flex justify-between items-center max-w-7xl mx-auto'>
              <Link href={'/'}>
                <Image src={assets.logo} alt='Logo' width={140} className='w-28 sm:w-36' />
              </Link>
              <Link href={'/admin'}>
                <button className='flex items-center gap-2 font-semibold py-2 px-5 sm:px-8 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-sm'>
                  Get Started <Image src={assets.arrow} alt='' className='invert w-3' />
                </button>
              </Link>
              
            </div>

            {/* Hero Title Section */}
            <div className='text-center mt-16 mb-24 max-w-4xl mx-auto'>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-4">{data?.category}</p>
              <h1 className='text-3xl sm:text-6xl font-bold leading-tight text-gray-900 mb-8'>
                {data?.title}
              </h1>

              <div className="flex flex-col items-center">
                <Image src={data?.authorImage} alt={data?.author} width={50} height={50} className='rounded-full border-2 border-white shadow-md' />
                <p className='mt-3 text-gray-600 font-medium italic'>by {data?.author}</p>
              </div>
            </div>
          </div>

          {/* Featured Image - Overlapping look */}
          <div className='max-w-5xl mx-auto px-5 -mt-16 mb-16'>
            <Image
              className='rounded-3xl shadow-2xl object-cover aspect-video border-[8px] border-white'
              src={data?.image}
              width={1280}
              height={720}
              alt='Featured'
            />
          </div>

          {/* Article Content */}
          <article className='max-w-5xl mx-auto px-6 mb-20'>
            <div
              className='blog-content prose prose-lg max-w-none first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left text-gray-700 leading-relaxed'
              dangerouslySetInnerHTML={{ __html: data.description }}
            >
            </div>

            {/* Social Sharing Section */}
            <div className='mt-20 py-10 border-t border-gray-100'>
              <p className='text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-6'>Share this story</p>
              <div className='flex gap-4'>
                <Image src={assets.facebook_icon} alt='FB' width={32} className='cursor-pointer hover:opacity-70 transition-opacity' />
                <Image src={assets.twitter_icon} alt='TW' width={32} className='cursor-pointer hover:opacity-70 transition-opacity' />
                <Image src={assets.googleplus_icon} alt='GP' width={32} className='cursor-pointer hover:opacity-70 transition-opacity' />
              </div>
            </div>
          </article>

          <Footer />
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p className="text-center text-gray-500">Blog not found.</p>
        </div>
      )}
    </>
  )
}

export default Page