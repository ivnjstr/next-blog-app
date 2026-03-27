import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const BlogTableItem = ({ authorImage, title, author, date, deleteBlog, mongoId }) => {
    const BlogDate = new Date(date);
    
    return (
        <tr className='bg-white hover:bg-gray-50/50 transition-colors group'>
            {/* Author Column */}
            <th scope='row' className='hidden sm:flex items-center gap-3 px-8 py-5 font-semibold text-gray-900 whitespace-nowrap'>
                <Image 
                    width={32} 
                    height={32} 
                    src={authorImage ? authorImage : assets.profile_icon} 
                    alt={author} 
                    className='rounded-full border border-gray-100 shadow-sm' 
                />
                <p className='text-sm'>{author || "Anonymous"}</p>
            </th>

            {/* Title Column */}
            <td className='px-8 py-5 font-medium text-gray-800'>
                {title || "Untitled Post"}
            </td>

            {/* Date Column */}
            <td className='px-8 py-5 text-gray-500'>
                {BlogDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>

            {/* Delete Action Column */}
            <td className='px-8 py-5 text-center'>
                <button 
                    onClick={() => deleteBlog(mongoId)} 
                    className='px-3 py-1.5 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white'
                >
                    DELETE
                </button>
            </td>
        </tr>
    )
}

export default BlogTableItem