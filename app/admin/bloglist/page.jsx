'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';

const STATUS_TABS = ["All", "Pending", "Published", "Rejected"];

const Page = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [blogs, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog', { params: { scope: 'admin' } })
    setBlog(response.data.blogs)
  }

  const deleteBlog = async (mongoId) => {
    const response = await axios.delete('/api/blog', {
      params: { id: mongoId }
    })
    toast.success(response.data.msg);
    fetchBlogs();
  }

  const moderateBlog = async (mongoId, action, rejectionReason) => {
    try {
      const response = await axios.patch('/api/blog', { id: mongoId, action, rejectionReason });
      toast.success(response.data.msg);
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong.");
    }
  }

  useEffect(() => {
    fetchBlogs().finally(() => setLoading(false));
  }, []);

  const visibleBlogs = useMemo(() => {
    if (statusFilter === "All") return blogs;
    return blogs.filter((b) => (b.status || "published") === statusFilter.toLowerCase());
  }, [blogs, statusFilter]);

  return (
    <div className='flex-1 bg-[#fcfcfc] dark:bg-gray-950 min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{isAdmin ? 'All Blogs' : 'My Blogs'}</h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
          {isAdmin ? 'View and manage your published editorial content.' : 'Posts you\'ve written and their review status.'}
        </p>
      </div>

      {isAdmin && (
        <>
          {/* Mobile: dropdown, so four tabs never overflow the screen */}
          <div className='sm:hidden mb-6 relative'>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='w-full appearance-none px-4 py-3 pr-10 rounded-xl text-xs font-bold uppercase tracking-wider border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none focus:border-black dark:focus:border-white'
            >
              {STATUS_TABS.map((tab) => (
                <option key={tab} value={tab}>{tab}</option>
              ))}
            </select>
            <svg viewBox="0 0 20 20" fill="none" width={16} height={16} className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500'>
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Desktop/tablet: tab row */}
          <div className='hidden sm:flex gap-2 mb-6'>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === tab ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-black dark:hover:border-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </>
      )}

      {/* List Container - Card Style */}
      <div className='relative max-w-[1000px] overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'>
        <div className='max-h-[75vh] overflow-y-auto scrollbar-hide'>

          {/* Header row - desktop only, mobile cards are self-describing */}
          <div className='hidden sm:flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 font-bold px-8 py-5'>
            <div className='w-40 shrink-0'>Author</div>
            <div className='flex-1'>Blog Title</div>
            <div className='w-28 shrink-0'>Date</div>
            <div className='w-56 shrink-0 text-center'>Action</div>
          </div>

          <div className='divide-y divide-gray-50 dark:divide-gray-800'>
            {loading ? (
              <p className="text-center py-20 text-gray-400 dark:text-gray-500 italic">Loading blogs...</p>
            ) : visibleBlogs.length > 0 ? (
              visibleBlogs.map((item, index) => (
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
                  status={item.status || 'published'}
                  rejectionReason={item.rejectionReason}
                  isAdmin={isAdmin}
                  deleteBlog={deleteBlog}
                  moderateBlog={moderateBlog}
                />
              ))
            ) : (
              <p className="text-center py-20 text-gray-400 dark:text-gray-500 italic">No blogs found. Start by adding one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
