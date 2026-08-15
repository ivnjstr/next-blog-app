'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BlogForm, { EMPTY_DESCRIPTION } from '@/Components/AdminComponents/BlogForm'

const Page = ({ params }) => {
    const { id } = use(params)
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState(null);
    const [data, setData] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get('/api/blog', { params: { id } });
                setData({
                    title: response.data.title || "",
                    description: response.data.description || "",
                    category: response.data.category || "Startup",
                    author: response.data.author || "Ivan Jester",
                    authorImage: response.data.authorImage || "/profile_img.jpg"
                });
                setExistingImageUrl(response.data.image || null);
            } catch (error) {
                toast.error("Failed to load blog.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!data.description || data.description === EMPTY_DESCRIPTION) {
            toast.error("Please write some blog content before saving.");
            return;
        }

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('author', data.author);
        formData.append('authorImage', data.authorImage);
        if (image) formData.append('image', image);

        setSubmitting(true);
        try {
            const response = await axios.put('/api/blog', formData, { params: { id } });
            if (response.data.success) {
                toast.success(response.data.msg);
                router.push('/admin/bloglist');
            } else {
                toast.error("Error");
            }
        } catch (error) {
            toast.error("Something went wrong while saving.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading || !data) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-[#fcfcfc]'>
                <p className='text-gray-400 font-medium'>Loading blog...</p>
            </div>
        );
    }

    return (
        <BlogForm
            data={data}
            setData={setData}
            image={image}
            setImage={setImage}
            existingImageUrl={existingImageUrl}
            onSubmit={onSubmitHandler}
            submitLabel="SAVE CHANGES"
            submitting={submitting}
            heading="Edit Blog"
            subheading="Update your story below."
        />
    )
}

export default Page
