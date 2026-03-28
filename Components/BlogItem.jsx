import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title, category, image, id, isFeatured, hasVideo, authorImage}) => {
  return (
    <Link 
      href={`/blogs/${id}`} 
      className="relative group block w-full h-[350px] md:h-[400px] overflow-hidden rounded-2xl bg-gray-200"
    >
      {/* Background Image */}
      <Image 
        src={image} 
        alt={title} 
        fill 
        className='object-cover transition-transform duration-700 group-hover:scale-105'
      />
      
      {/* Gradient Overlay (Heavier at bottom for text readability) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

      {/* Video Play Icon (Top Left like your image) */}
      {hasVideo && (
        <div className="absolute top-6 left-6 w-10 h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
        </div>
      )}

      {/* Featured Tag (Top Right) */}
      {isFeatured && (
        <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] font-bold text-white uppercase tracking-widest">
            Featured
        </div>
      )}

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <p className='text-[11px] uppercase tracking-[0.2em] text-gray-300 font-bold mb-3'>
          {category}
        </p>
        <h5 className='text-white text-2xl md:text-3xl font-bold leading-tight drop-shadow-md'>
          {title}
        </h5>
        
        {/* Author Avatars */}
        <div className="flex items-center mt-5 -space-x-3">
            {/* {[1, 2].map((i) => ( */}
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-400 overflow-hidden shadow-lg">
                    {/* Placeholder for author image */}
                    {/* <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500" /> */}
                    <Image src={authorImage} alt='Profile image' width={32} height={32} />
                </div>
            {/* ))} */}
        </div>
      </div>
    </Link>
  )
}

export default BlogItem