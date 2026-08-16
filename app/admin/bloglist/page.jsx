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
    <div className='flex-1 bg-[#fcfcfc] min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>{isAdmin ? 'All Blogs' : 'My Blogs'}</h1>
        <p className='text-gray-500 text-sm mt-1'>
          {isAdmin ? 'View and manage your published editorial content.' : 'Posts you\'ve written and their review status.'}
        </p>
      </div>

      {isAdmin && (
        <div className='flex gap-2 mb-6'>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === tab ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* List Container - Card Style */}
      <div className='relative max-w-[1000px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
        <div className='max-h-[75vh] overflow-y-auto scrollbar-hide'>

          {/* Header row - desktop only, mobile cards are self-describing */}
          <div className='hidden sm:flex items-center gap-4 text-xs text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100 font-bold px-8 py-5'>
            <div className='w-40 shrink-0'>Author</div>
            <div className='flex-1'>Blog Title</div>
            <div className='w-28 shrink-0'>Date</div>
            <div className='w-56 shrink-0 text-center'>Action</div>
          </div>

          <div className='divide-y divide-gray-50'>
            {loading ? (
              <p className="text-center py-20 text-gray-400 italic">Loading blogs...</p>
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
              <p className="text-center py-20 text-gray-400 italic">No blogs found. Start by adding one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
