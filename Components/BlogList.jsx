import { blog_data } from '@/Assets/assets'
import React, { useEffect, useState } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios';

const BlogList = () => {
    const [menu, setMenu] = useState("All");
    //using menu we will filter the blog data based on the category and render the BlogItem component accordingly. if menu is "All" then we will render all the blog items otherwise we will filter the blog data based on the category and render the BlogItem component accordingly.

    //Store API data
    const[blogs, setBlogs] = useState([]);

    const fetchBlogs = async () =>{
        //hit api using axios
        const response = await axios.get('/api/blog');
        setBlogs(response.data.blogs); //blogs array in "/api/blog get " will be store in blogs
        console.log(response.data.blogs);
    } 
    // fetchBlogs -> run this  function whenever this componernts loaded
    useEffect(() => {
        fetchBlogs();
    }, [])

  return (
    <div>
        <div className='flex justify-center gap-6 my-10'>
            <button onClick={()=> setMenu('All')} className={menu==="All" ? 'bg-black text-white py-1 px-4 rounded-sm cursor-pointer': 'cursor-pointer'}>All</button>
            <button onClick={()=> setMenu('Technology')} className={menu==="Technology" ? 'bg-black text-white py-1 px-4 rounded-sm cursor-pointer': 'cursor-pointer'}>Technology</button>
            <button onClick={()=> setMenu('Startup')} className={menu==="Startup" ? 'bg-black text-white py-1 px-4 rounded-sm cursor-pointer': 'cursor-pointer'}>Startup</button>
            <button onClick={()=> setMenu('Lifestyle')} className={menu==="Lifestyle" ? 'bg-black text-white py-1 px-4 rounded-sm cursor-pointer': 'cursor-pointer'}>Lifestyle</button>
        </div>
        <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
            {/* we will use map function to render multiple BlogItem components and pass the data as props */}
            {/* {blog_data.filter((item) => menu === "All"?true:item.category===menu).map((item, index) => {
                return <BlogItem key={index} id={item.id} image={item.image} title={item.title} description={item.description} category={item.category}/>
            })} */}
            {blogs.filter((item) => menu === "All"?true:item.category===menu).map((item, index) => {
                return <BlogItem key={index} id={item._id} image={item.image} title={item.title} description={item.description} category={item.category}/>
            })}
        </div>
    </div>
  )
}

export default BlogList
