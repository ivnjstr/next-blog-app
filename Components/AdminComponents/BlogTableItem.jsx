import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const BlogTableItem = ({ authorImage, title, author, date, image, category, deleteBlog, mongoId }) => {
    const BlogDate = new Date(date);
    const [confirming, setConfirming] = useState(false);

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
                <div className='flex items-center gap-3'>
                    {image && (
                        <div className='relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100'>
                            <Image src={image} alt='' fill className='object-cover' />
                        </div>
                    )}
                    <div>
                        <Link
                            href={`/blogs/${mongoId}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:underline'
                        >
                            {title || "Untitled Post"}
                        </Link>
                        {category && (
                            <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-0.5'>{category}</p>
                        )}
                    </div>
                </div>
            </td>

            {/* Date Column */}
            <td className='px-8 py-5 text-gray-500'>
                {BlogDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>

            {/* Actions Column */}
            <td className='px-8 py-5 text-center'>
                <div className='flex items-center justify-center gap-2'>
                    <Link
                        href={`/admin/editBlog/${mongoId}`}
                        className='px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all'
                    >
                        EDIT
                    </Link>
                    <button
                        onClick={() => setConfirming(true)}
                        className='px-3 py-1.5 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white'
                    >
                        DELETE
                    </button>
                </div>

                {confirming && (
                    <ConfirmDeleteModal
                        title={title}
                        onCancel={() => setConfirming(false)}
                        onConfirm={() => { setConfirming(false); deleteBlog(mongoId); }}
                    />
                )}
            </td>
        </tr>
    )
}

export default BlogTableItem
