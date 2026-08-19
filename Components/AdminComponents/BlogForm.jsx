'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import RichTextEditor from '@/Components/AdminComponents/RichTextEditor'
import BlogArticle from '@/Components/BlogArticle'

export const EMPTY_DESCRIPTION = '<p></p>'

const CATEGORY_OPTIONS = ["Startup", "Technology", "Lifestyle", "Travel"];

// Custom dropdown instead of a native <select> — native select popups are
// rendered by the OS and ignore CSS entirely (that's the blue highlight
// bar you can't restyle), so we can't match the app's look with one.
const CategoryDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className='relative'>
            <button
                type='button'
                onClick={() => setOpen(o => !o)}
                className='w-full flex items-center justify-between pl-4 pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 cursor-pointer'
            >
                <span>{value}</span>
                <svg viewBox="0 0 20 20" fill="none" width={16} height={16} className={`text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {open && (
                <div className='absolute z-10 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden py-1'>
                    {CATEGORY_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type='button'
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-all ${opt === value ? 'bg-gray-100 dark:bg-gray-800 font-bold text-black dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// Shared two-column "editor + live preview" UI used by both the
// "Add Blog" and "Edit Blog" admin pages, so they stay visually identical.
const BlogForm = ({
    data,
    setData,
    image,
    setImage,
    existingImageUrl,
    onSubmit,
    submitLabel,
    submitting,
    heading,
    subheading
}) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin';
    const [view, setView] = useState('edit'); // mobile-only: 'edit' | 'preview'

    const previewImage = useMemo(
        () => (image ? URL.createObjectURL(image) : existingImageUrl || undefined),
        [image, existingImageUrl]
    )

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    return (
        <div className='bg-[#fcfcfc] dark:bg-gray-950 min-h-screen pb-20'>
            <div className='pt-8 px-6 sm:pt-12 sm:pl-16 sm:pr-8'>

                <div className='mb-8 flex items-center justify-between flex-wrap gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{heading}</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>{subheading}</p>
                    </div>

                    {/* Mobile-only Edit/Preview toggle */}
                    <div className='flex lg:hidden bg-gray-100 dark:bg-gray-800 rounded-xl p-1'>
                        <button type='button' onClick={() => setView('edit')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'edit' ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Edit</button>
                        <button type='button' onClick={() => setView('preview')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'preview' ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Preview</button>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-8 items-start'>

                    {/* Left: Form */}
                    <form onSubmit={onSubmit} className={`w-full lg:w-1/2 ${view === 'preview' ? 'hidden lg:block' : ''}`}>

                        {/* Image Upload Area */}
                        <div className='flex flex-col gap-3 mb-8'>
                            <p className='text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>Upload Thumbnail</p>
                            <label htmlFor="image" className='cursor-pointer group block'>
                                <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden group-hover:border-black dark:group-hover:border-white transition-all">
                                    {!previewImage ? (
                                        <div className='flex flex-col items-center gap-2'>
                                            <Image src={assets.upload_area} width={40} alt='' className='opacity-40 dark:invert' />
                                            <span className='text-xs font-bold text-gray-400 dark:text-gray-500'>CLICK TO UPLOAD</span>
                                        </div>
                                    ) : (
                                        <Image src={previewImage} fill className='object-cover' alt='' unoptimized />
                                    )}
                                </div>
                            </label>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required={!existingImageUrl} />
                        </div>

                        {/* Input Fields Container */}
                        <div className='flex flex-col gap-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>

                            <div>
                                <p className='text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Blog Title</p>
                                <input
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 outline-none focus:border-black dark:focus:border-white transition-all'
                                    type="text"
                                    placeholder='e.g. The Future of Web Design'
                                    name="title"
                                    onChange={onChangeHandler}
                                    value={data.title}
                                    required
                                />
                            </div>

                            <div>
                                <p className='text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Blog Description</p>
                                <p className='text-xs text-gray-400 dark:text-gray-500 mb-2'>Use the toolbar to add subheadings, lists, and images anywhere in your content.</p>
                                <RichTextEditor
                                    value={data.description}
                                    onChange={(html) => setData(data => ({ ...data, description: html }))}
                                />
                            </div>

                            <div className='w-full sm:w-1/3'>
                                <p className='text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>Category</p>
                                <CategoryDropdown
                                    value={data.category}
                                    onChange={(value) => setData(data => ({ ...data, category: value }))}
                                />
                            </div>

                            {isAdmin && (
                                <label className='flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-black dark:hover:border-white transition-all'>
                                    <input
                                        type="checkbox"
                                        checked={!!data.isFeatured}
                                        onChange={(e) => setData(data => ({ ...data, isFeatured: e.target.checked }))}
                                        className='mt-0.5 w-4 h-4 accent-black dark:accent-white cursor-pointer'
                                    />
                                    <span>
                                        <span className='block text-sm font-bold text-gray-700 dark:text-gray-300'>Feature this post</span>
                                        <span className='block text-xs text-gray-400 dark:text-gray-500 mt-0.5'>Shown in the large spot at the top of the homepage. Only one post can be featured — selecting this will unfeature the current one.</span>
                                    </span>
                                </label>
                            )}

                            <label className='flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-black dark:hover:border-white transition-all'>
                                <input
                                    type="checkbox"
                                    checked={!!data.hasVideo}
                                    onChange={(e) => setData(data => ({ ...data, hasVideo: e.target.checked }))}
                                    className='mt-0.5 w-4 h-4 accent-black dark:accent-white cursor-pointer'
                                />
                                <span>
                                    <span className='block text-sm font-bold text-gray-700 dark:text-gray-300'>Has video</span>
                                    <span className='block text-xs text-gray-400 dark:text-gray-500 mt-0.5'>Shows a play icon on this post&apos;s card in the blog list.</span>
                                </span>
                            </label>

                            <label className='flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-black dark:hover:border-white transition-all'>
                                <input
                                    type="checkbox"
                                    checked={!!data.allowComments}
                                    onChange={(e) => setData(data => ({ ...data, allowComments: e.target.checked }))}
                                    className='mt-0.5 w-4 h-4 accent-black dark:accent-white cursor-pointer'
                                />
                                <span>
                                    <span className='block text-sm font-bold text-gray-700 dark:text-gray-300'>Allow comments</span>
                                    <span className='block text-xs text-gray-400 dark:text-gray-500 mt-0.5'>Readers can comment on this post. Pre-filled from your default in Profile settings — you can override it here per post.</span>
                                </span>
                            </label>

                            <button
                                type='submit'
                                disabled={submitting}
                                className='mt-4 w-full sm:w-40 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {submitting ? 'SAVING...' : submitLabel}
                            </button>
                        </div>
                    </form>

                    {/* Right: Live Preview */}
                    <div className={`w-full lg:w-1/2 lg:sticky lg:top-8 ${view === 'edit' ? 'hidden lg:block' : ''}`}>
                        <p className='text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3'>Live Preview</p>
                        <div className='rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-y-auto bg-white dark:bg-gray-900' style={{ maxHeight: '85vh' }}>
                            <BlogArticle
                                title={data.title}
                                category={data.category}
                                author={data.author}
                                authorImage={data.authorImage}
                                image={previewImage}
                                description={data.description}
                                showHeaderLink={false}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BlogForm
