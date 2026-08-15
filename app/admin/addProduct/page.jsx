'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import BlogForm, { EMPTY_DESCRIPTION } from '@/Components/AdminComponents/BlogForm'

const INITIAL_DATA = {
    title: "",
    description: "",
    category: "Startup",
    author: "Ivan Jester",
    authorImage: "/profile_img.jpg",
    isFeatured: false
}

const Page = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState(INITIAL_DATA)
    const [submitting, setSubmitting] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!data.description || data.description === EMPTY_DESCRIPTION) {
            toast.error("Please write some blog content before publishing.");
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('author', data.author);
        formData.append('authorImage', data.authorImage);
        formData.append('isFeatured', data.isFeatured);
        formData.append('image', image);

        setSubmitting(true);
        try {
            const response = await axios.post('/api/blog', formData);
            if (response.data.success) {
                toast.success(response.data.msg);
                setImage(false);
                setData(INITIAL_DATA);
            } else {
                toast.error("Error");
            }
        } catch (error) {
            toast.error("Something went wrong while publishing.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <BlogForm
            data={data}
            setData={setData}
            image={image}
            setImage={setImage}
            existingImageUrl={null}
            onSubmit={onSubmitHandler}
            submitLabel="PUBLISH"
            submitting={submitting}
            heading="Add New Blog"
            subheading="Fill in the information below to publish a new story."
        />
    )
}

export default Page
