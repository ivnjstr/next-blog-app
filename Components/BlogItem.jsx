import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Avatar from './Avatar'

const HeartIcon = () => (
  <svg viewBox="0 0 20 20" width={14} height={14} fill="currentColor">
    <path d="M10 17.5s-6.5-4.03-6.5-8.66C3.5 6 5.5 4 8 4c1.1 0 2.2.5 2.9 1.4A4.02 4.02 0 0113.9 4c2.5 0 4.5 2 4.5 4.5-.01 4.64-8.4 9-8.4 9z" />
  </svg>
)

const CommentIcon = () => (
  <svg viewBox="0 0 20 20" width={14} height={14} fill="currentColor">
    <path d="M10 3C5.58 3 2 5.91 2 9.5c0 2.02 1.14 3.82 2.93 5.01-.1.98-.5 2.14-1.43 3.2 1.5-.15 2.83-.73 3.87-1.47.83.24 1.72.36 2.63.36 4.42 0 8-2.91 8-6.5S14.42 3 10 3z" />
  </svg>
)

const BlogItem = ({title, category, image, id, isFeatured, hasVideo, author, authorImage, likeCount = 0, commentCount = 0}) => {
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

        <div className='flex items-center justify-between mt-5'>
          {/* Author Avatar */}
          <Avatar src={authorImage} name={author} size={36} className='border-2 border-white shadow-lg' />

          {/* Like / Comment indicators */}
          <div className='flex items-center gap-4 text-white/90'>
            <span className='flex items-center gap-1.5 text-xs font-semibold'>
              <HeartIcon /> {likeCount}
            </span>
            <span className='flex items-center gap-1.5 text-xs font-semibold'>
              <CommentIcon /> {commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogItem
