'use client'
import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'

const page =  ({params}) => {
  const { id } = use(params) // ✅ FIX

  const [data, setData] = useState(null)
  
  const fetchBlogData = () => {
        for(let i=0; i<blog_data.length; i++)
        {
            if(Number(id) === blog_data[i].id){
                setData(blog_data[i]);
                console.log(blog_data[i]);
                break;
            }
        }
  }

  useEffect(() => {
    fetchBlogData();
  },[id])

  return ( data === null ? <div>Loading...</div> :
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28 '>
      {/* {`This is the blog page with id: ${id}`} */}
        <div className='flex justify-between items-center'>
            <Image src={assets.logo} alt='' width={180} className='w-32.5! sm:w-auto' />
            <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>Get started <Image src={assets.arrow} alt='Arrow' /></button>
        </div>

        <div className='text-center my-24'>
            <h1 className='text-2xl sm:text-5xl font-semibold max-w-175 mx-auto'>{data?.title}</h1>
            <Image src={data?.author_img} alt='' width={60} height={60} className='rounded-full mx-auto mt-6 border border-white' />
            <p className='mt-1 pb-2 text-lg max-w-185 mx-auto'>{data?.author}</p>
        </div>
    </div>
  )
}

export default page


// import React from 'react'

// const Page = async ({ params }) => {
//   const { id } = await params

//   return <div>{id}</div>
// }

// export default Page

