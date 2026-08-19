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
        <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-950">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
            <p className="text-gray-400 dark:text-gray-500 font-medium">Loading Story...</p>
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
            postId={data._id}
            postOwnerId={data.createdBy}
            allowComments={data.allowComments}
            likeCount={data.likeCount}
            likedByCurrentUser={data.likedByCurrentUser}
          />
          <Footer />
        </>
      ) : (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-950">
          <p className="text-center text-gray-500 dark:text-gray-400">Blog not found.</p>
        </div>
      )}
    </>
  )
}

export default Page