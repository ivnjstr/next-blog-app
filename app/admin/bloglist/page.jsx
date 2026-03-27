'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
  const [blogs, setBlog] = useState([]);

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
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 bg-[#fcfcfc] min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>All Blogs</h1>
        <p className='text-gray-500 text-sm mt-1'>View and manage your published editorial content.</p>
      </div>

      {/* Table Container - Card Style */}
      <div className='relative max-w-[1000px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
        <div className='overflow-x-auto h-[75vh] scrollbar-hide'>
          <table className='w-full text-sm text-left text-gray-600'>
            <thead className='text-xs text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100 font-bold'>
              <tr>
                <th scope="col" className='hidden sm:table-cell px-8 py-5'>Author</th>
                <th scope="col" className='px-8 py-5'>Blog Title</th>
                <th scope="col" className='px-8 py-5'>Date</th>
                <th scope="col" className='px-8 py-5 text-center'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {blogs.length > 0 ? (
                blogs.map((item, index) => (
                  <BlogTableItem 
                    key={index} 
                    mongoId={item._id} 
                    title={item.title} 
                    author={item.author} 
                    authorImage={item.authorImage} 
                    date={item.date} 
                    deleteBlog={deleteBlog}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-20 text-gray-400 italic">No blogs found. Start by adding one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page