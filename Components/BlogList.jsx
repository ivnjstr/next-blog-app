import { blog_data } from '@/Assets/assets'
import React, { useEffect, useState } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios';

const BlogList = () => {
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState("All");
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        const response = await axios.get('/api/blog');
        setBlogs(response.data.blogs);
        setLoading(false);
    }

    useEffect(() => {
        fetchBlogs();
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Category Filter */}
            <div className='flex justify-center gap-6 my-10 font-medium'>
                {["All", "Technology", "Startup", "Lifestyle"].map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setMenu(cat)} 
                        className={menu === cat ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black transition-all'}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Flexbox Container */}
            <div className='flex flex-wrap -mx-3 mb-16'>
                {loading ? (
                    <p className="text-center w-full">Loading blogs...</p>
                ) : (
                    blogs
                        .filter((item) => menu === "All" ? true : item.category === menu)
                        .map((item, index) => {
                            // Logic to mimic your image layout
                            // First item is 2/3 width, second is 1/3, others are 1/3
                            const isFeatured = index === 0 && menu === "All";
                            const isSecondary = index === 1 && menu === "All";

                            return (
                                <div 
                                    key={index} 
                                    className={`p-3 w-full 
                                        ${isFeatured ? 'lg:w-2/3' : 'md:w-1/2 lg:w-1/3'}
                                    `}
                                >
                                    <BlogItem
                                        id={item._id}
                                        image={item.image}
                                        title={item.title}
                                        category={item.category}
                                        isFeatured={isFeatured}
                                        hasVideo={isSecondary} // Just as an example for the play icon
                                    />
                                </div>
                            )
                        })
                )}
            </div>
        </div>
    )
}

export default BlogList