import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const BlogTableItem = ({ authorImage, title, author, date, image, category, isFeatured, deleteBlog, mongoId }) => {
    const BlogDate = new Date(date);
    const [confirming, setConfirming] = useState(false);

    return (
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 sm:px-8 sm:py-5 hover:bg-gray-50/50 transition-colors group'>

            {/* Author - desktop only */}
            <div className='hidden sm:flex items-center gap-3 w-40 shrink-0'>
                <Image
                    width={32}
                    height={32}
                    src={authorImage ? authorImage : assets.profile_icon}
                    alt={author}
                    className='rounded-full border border-gray-100 shadow-sm'
                />
                <p className='text-sm font-semibold text-gray-900'>{author || "Anonymous"}</p>
            </div>

            {/* Thumbnail + Title */}
            <div className='flex items-center gap-3 flex-1 min-w-0'>
                {image && (
                    <div className='relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100'>
                        <Image src={image} alt='' fill className='object-cover' />
                    </div>
                )}
                <div className='min-w-0'>
                    <Link
                        href={`/blogs/${mongoId}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-medium text-gray-800 hover:underline'
                    >
                        {title || "Untitled Post"}
                    </Link>
                    <div className='flex items-center gap-2 mt-1 flex-wrap'>
                        {category && (
                            <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold'>{category}</p>
                        )}
                        {isFeatured && (
                            <span className='inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full'>★ Featured</span>
                        )}
                        {/* Author - mobile only, shown as a small tag instead of its own column */}
                        <p className='sm:hidden text-[10px] text-gray-400'>by {author || "Anonymous"}</p>
                    </div>
                </div>
            </div>

            {/* Date + Actions: same row on mobile, separate columns on desktop */}
            <div className='flex items-center justify-between gap-3 sm:contents'>
                <p className='text-gray-500 text-sm sm:w-28 sm:shrink-0'>
                    {BlogDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>

                <div className='flex items-center gap-2 sm:w-40 sm:shrink-0 sm:justify-center'>
                    <Link
                        href={`/admin/editBlog/${mongoId}`}
                        className='flex-1 sm:flex-none text-center px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all'
                    >
                        EDIT
                    </Link>
                    <button
                        onClick={() => setConfirming(true)}
                        className='flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg sm:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white'
                    >
                        DELETE
                    </button>
                </div>
            </div>

            {confirming && (
                <ConfirmDeleteModal
                    title={title}
                    onCancel={() => setConfirming(false)}
                    onConfirm={() => { setConfirming(false); deleteBlog(mongoId); }}
                />
            )}
        </div>
    )
}

export default BlogTableItem
