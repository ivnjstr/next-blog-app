'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {
  const [blogs, setBlog] = useState([]);

  //endpoint
  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog')

    //store blog data in this blog state
    setBlog(response.data.blogs) //all the blogs data comming in this blog property and store that in this blog state
    console.log(response.data.blogs)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])




  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All blogs</h1>
      <div className='relative h-[80vh] max-w-212.5 overflow-y-auto mt-4 border border-gray-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-sm text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope="col" className='hidden sm:block px-6 py-3'>
                Author name
              </th>
              <th scope="col" className='px-6 py-3'>
                Blog title
              </th>
              <th scope="col" className='px-6 py-3'>
                Date
              </th>
              <th scope="col" className='px-6 py-3'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item, index) => {
              return <BlogTableItem key={index} mongoId={item._id} title={item.title} author={item.author} authorImage={item.authorImage} date={item.date}/>
            })}

          </tbody>
        </table>
      </div>
    </div>

  )
}

export default page
