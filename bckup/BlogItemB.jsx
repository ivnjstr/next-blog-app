import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title, description, category, image, id}) => {
  return (
    <div className='max-w-82.5 bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] cursor-pointer m-auto mb-10'>
      <Link href={`/blogs/${id}`}>
        <Image src={image} alt='' width={400} height={400} className='border-b border-black'/>
      </Link>
      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
        <p className='text-gray-700 mb-3 text-sm tracking-tight' dangerouslySetInnerHTML={{__html:description.slice(0,120)}}></p> 
        {/* limit the char for desc */}
        <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center'>
          Read more <Image src={assets.arrow} alt='' width={12} className='ml-2' />
        </Link>
  
      </div>
    </div>
  )
}

export default BlogItem


// istead of using this {blog_data[0].description}, {blog_data[0].title} and {blog_data[0].category} we use props and pass the data from the parent component which is BlogList.jsx. we will use map function in BlogList.jsx to render multiple BlogItem components and pass the data as