'use client'
import { assets, blog_data } from '@/Assets/assets'
import Footer from '@/Components/Footer'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'

const page = ({ params }) => {
  const { id } = use(params)

  const [data, setData] = useState(null)

  const fetchBlogData = async () => {
    // comes from blog_data
    // for(let i=0; i<blog_data.length; i++)
    // {
    //     if(Number(id) === blog_data[i].id){
    //         setData(blog_data[i]);
    //         console.log(blog_data[i]);
    //         break;
    //     }
    // }

    //if i provide the id to the backend it will display/find the blogs related to the id
    const response = await axios.get('/api/blog', {
      params: { id }
    })
    setData(response.data);

  }

  useEffect(() => {
    fetchBlogData();
  }, [id])

  // id
  // title
  // description
  // image
  // date
  // category
  // author
  // author_img

  return (data ? <>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28 '>
      {/* {`This is the blog page with id: ${id}`} */}
      <div className='flex justify-between items-center'>
        <Link href={'/'}>
          <Image src={assets.logo} alt='' width={180} className='w-32.5! sm:w-auto' />
        </Link>
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>Get started <Image src={assets.arrow} alt='Arrow' /></button>
      </div>

      <div className='text-center my-24'>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-175 mx-auto'>{data?.title}</h1>
        <Image src={data?.authorImage} alt='' width={60} height={60} className='rounded-full mx-auto mt-6 border border-white' />
        <p className='mt-1 pb-2 text-lg max-w-185 mx-auto'>{data?.author}</p>
      </div>
    </div>

    <div className='mx-5 max-w-200 md:mx-auto -mt-25 mb-10'>
      <Image className='border-4 border-white' src={data?.image} width={1280} height={720} alt='' />
      {/* <h1 className='my-8 text-[26px] font-semibold'>Introduction:</h1> */}

      <div className='blog-content' dangerouslySetInnerHTML={{ __html: data.description }}>
      </div>

      {/* <p className='text-lg'>{data?.description}</p> */}
      {/* <h3 className='my-5 text-[18px] font-semibold'>Step 1: Self-Reflection and Goal Setting</h3>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p>
      <h3 className='my-5 text-[18px] font-semibold'>Step 2: Self-Reflection and Goal Setting</h3>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p>
      <h3 className='my-5 text-[18px] font-semibold'>Step 3: Self-Reflection and Goal Setting</h3>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p>
      <h3 className='my-5 text-[18px] font-semibold'>Conclusion:</h3>
      <p className='my-3'>In conclusion, managing your lifestyle effectively requires a combination of self-reflection, goal setting, and consistent action. By following these steps, you can create a more balanced and fulfilling life.</p>
      <p className='my-3'>Before you can effectively manage your lifestyle, it's important to take some time for self-reflection and set clear, achievable goals. This process will help you understand your current situation, identify areas for improvement, and create a roadmap for success. </p> */}
      <div className='my-24'>
        <p className='text-black font font-semibold my-4'>Share this article on social media</p>
        <div className='flex'>
          <Image src={assets.facebook_icon} alt='' width={50} className='cursor-pointer' />
          <Image src={assets.twitter_icon} alt='' width={50} className='cursor-pointer' />
          <Image src={assets.googleplus_icon} alt='' width={50} className='cursor-pointer' />
        </div>
      </div>
    </div>
    <Footer />
  </> : <> </>
  )
}

export default page


// import React from 'react'

// const Page = async ({ params }) => {
//   const { id } = await params

//   return <div>{id}</div>
// }

// export default Page

