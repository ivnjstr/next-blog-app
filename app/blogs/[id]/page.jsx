'use client'
import Footer from '@/Components/Footer'
import BlogArticle from '@/Components/BlogArticle'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'

const Page = ({ params }) => {
  const { id } = use(params)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null)

  const fetchBlogData = async () => {
    try {
      const response = await axios.get('/api/blog', { params: { id } })
      setData(response.data);
    } catch (error) {
      setData(null);
    }
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
        <>
          <BlogArticle
            title={data.title}
            category={data.category}
            author={data.author}
            authorImage={data.authorImage}
            image={data.image}
            description={data.description}
          />
          <Footer />
        </>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p className="text-center text-gray-500">Blog not found.</p>
        </div>
      )}
    </>
  )
}

export default Page