'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const page = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
        category: "Startup",
        author: "Alex something",
        authorImage: "/author_img.png"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
        console.log(data)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault(); //for clinking the add to make the page not reload
        // now add the logic so that we can call the api that we have created in the blog api 
        //using that api we can store data in our mongo db database
        // for that we will create one form data that will send in our backend
        // because in our api route we have accepting rthe data usiung the Formdata

        const formData = new FormData();
        formData.append('title', data.title); //data form the title field will be stored in this formData
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('author', data.author);
        formData.append('authorImage', data.authorImage);
        formData.append('image', image);
        //send this formdata in our API
        // we will use the axios
        const response = await axios.post('/api/blog', formData);
        if (response.data.success) {
            //the use the toastify notification
            toast.success(response.data.msg)
            // add logic where if success reset all the field
            setImage(false);
            setData({
                title: "",
                description: "",
                category: "Startup",
                author: "Alex something",
                authorImage: "/author_img.png"
            })
        }
        else {
            toast.error("Error");
        }

        //Note: in toastify copy the import statement here https://www.npmjs.com/package/react-toastify
    }

    //Purpose of onChangeHandler link to all input field
    return (
        <div>
            <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
                <p className='text-xl'>Upload thumbnail</p>
                <label htmlFor="image" className='cursor-pointer'>
                    <Image className='mt-4' src={!image ? assets.upload_area : URL.createObjectURL(image)} width={140} height={70} alt='' />
                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />

                <p className='text-xl mt-4'>Blog title</p>
                <input className='w-full sm:w-125 mt-4 px-4 py-3 border' type="text" placeholder='Type here' name="title" onChange={onChangeHandler} value={data.title} required />

                <p className='text-xl mt-4'>Blog Descriptions</p>
                <textarea className='w-full sm:w-125 mt-4 px-4 py-3 border' type="text" placeholder='Write content here..' name="description" onChange={onChangeHandler} value={data.description} required rows={6} />

                <p className='text-xl mt-4 '>Blog Category</p>
                <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
                    <option value="Startup">Startup</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                </select>
                <br />
                <button type='submit' className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
            </form>

        </div>

    )
}

export default page
