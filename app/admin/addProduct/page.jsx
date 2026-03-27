'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Page = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
        category: "Startup",
        author: "Ivan Jester",
        authorImage: "/profile_img.jpg"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('author', data.author);
        formData.append('authorImage', data.authorImage);
        formData.append('image', image);

        const response = await axios.post('/api/blog', formData);
        if (response.data.success) {
            toast.success(response.data.msg);
            setImage(false);
            setData({
                title: "",
                description: "",
                category: "Startup",
                author: "Ivan Jester",
                authorImage: "/profile_img.jpg"
            })
        } else {
            toast.error("Error");
        }
    }

    return (
        <div className='bg-[#fcfcfc] min-h-screen pb-20'>
            <form onSubmit={onSubmitHandler} className='pt-8 px-6 sm:pt-12 sm:pl-16 max-w-[900px]'>
                
                <div className='mb-10'>
                    <h1 className='text-2xl font-bold text-gray-900'>Add New Blog</h1>
                    <p className='text-gray-500 text-sm mt-1'>Fill in the information below to publish a new story.</p>
                </div>

                {/* Image Upload Area */}
                <div className='flex flex-col gap-3 mb-8'>
                    <p className='text-sm font-bold text-gray-700 uppercase tracking-wider'>Upload Thumbnail</p>
                    <label htmlFor="image" className='cursor-pointer group'>
                        <div className="relative w-40 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-white overflow-hidden group-hover:border-black transition-all">
                            {!image ? (
                                <div className='flex flex-col items-center gap-2'>
                                    <Image src={assets.upload_area} width={30} alt='' className='opacity-40' />
                                    <span className='text-[10px] font-bold text-gray-400'>CLICK TO UPLOAD</span>
                                </div>
                            ) : (
                                <Image src={URL.createObjectURL(image)} fill className='object-cover' alt='' />
                            )}
                        </div>
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>

                {/* Input Fields Container */}
                <div className='flex flex-col gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm'>
                    
                    <div>
                        <p className='text-sm font-bold text-gray-700 mb-2'>Blog Title</p>
                        <input 
                            className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all' 
                            type="text" 
                            placeholder='e.g. The Future of Web Design' 
                            name="title" 
                            onChange={onChangeHandler} 
                            value={data.title} 
                            required 
                        />
                    </div>

                    <div>
                        <p className='text-sm font-bold text-gray-700 mb-2'>Blog Description</p>
                        <textarea 
                            className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all resize-none' 
                            placeholder='Write your content here...' 
                            name="description" 
                            onChange={onChangeHandler} 
                            value={data.description} 
                            required 
                            rows={8} 
                        />
                    </div>

                    <div className='w-full sm:w-1/3'>
                        <p className='text-sm font-bold text-gray-700 mb-2'>Category</p>
                        <select 
                            name="category" 
                            onChange={onChangeHandler} 
                            value={data.category} 
                            className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none bg-white cursor-pointer'
                        >
                            <option value="Startup">Startup</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                        </select>
                    </div>

                    <button 
                        type='submit' 
                        className='mt-4 w-full sm:w-40 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-black/10'
                    >
                        PUBLISH
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Page