'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog')
    setBlog(response.data.blogs)
  }

  const deleteBlog = async (mongoId) => {
    const response = await axios.delete('/api/blog', {
      params: { id: mongoId }
    })
    toast.success(response.data.msg);
    fetchBlogs();
  }

  useEffect(() => {
    fetchBlogs().finally(() => setLoading(false));
  }, []);

  return (
    <div className='flex-1 bg-[#fcfcfc] min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>All Blogs</h1>
        <p className='text-gray-500 text-sm mt-1'>View and manage your published editorial content.</p>
      </div>

      {/* List Container - Card Style */}
      <div className='relative max-w-[1000px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
        <div className='max-h-[75vh] overflow-y-auto scrollbar-hide'>

          {/* Header row - desktop only, mobile cards are self-describing */}
          <div className='hidden sm:flex items-center gap-4 text-xs text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100 font-bold px-8 py-5'>
            <div className='w-40 shrink-0'>Author</div>
            <div className='flex-1'>Blog Title</div>
            <div className='w-28 shrink-0'>Date</div>
            <div className='w-40 shrink-0 text-center'>Action</div>
          </div>

          <div className='divide-y divide-gray-50'>
            {loading ? (
              <p className="text-center py-20 text-gray-400 italic">Loading blogs...</p>
            ) : blogs.length > 0 ? (
              blogs.map((item, index) => (
                <BlogTableItem
                  key={index}
                  mongoId={item._id}
                  title={item.title}
                  author={item.author}
                  authorImage={item.authorImage}
                  date={item.date}
                  image={item.image}
                  category={item.category}
                  isFeatured={item.isFeatured}
                  deleteBlog={deleteBlog}
                />
              ))
            ) : (
              <p className="text-center py-20 text-gray-400 italic">No blogs found. Start by adding one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
