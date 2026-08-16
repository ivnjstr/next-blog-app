'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import BlogForm, { EMPTY_DESCRIPTION } from '@/Components/AdminComponents/BlogForm'

const INITIAL_DATA = {
    title: "",
    description: "",
    category: "Startup",
    author: "",
    authorImage: "",
    isFeatured: false,
    hasVideo: false,
    allowComments: true
}

const Page = () => {
    const { data: session } = useSession();
    const [image, setImage] = useState(false);
    const [data, setData] = useState(INITIAL_DATA)
    const [submitting, setSubmitting] = useState(false);

    // Attribute new posts to whoever is actually logged in, not a
    // hardcoded name — this form is now used by every author, not just one.
    useEffect(() => {
        if (session?.user) {
            setData(data => ({
                ...data,
                author: data.author || session.user.name || "",
                authorImage: data.authorImage || session.user.image || ""
            }));
        }
    }, [session]);

    // defaultAllowComments lives in the DB, not the session/JWT, so it
    // needs its own fetch to pre-fill new posts with the user's setting.
    useEffect(() => {
        const fetchDefault = async () => {
            try {
                const res = await axios.get('/api/profile');
                setData(data => ({ ...data, allowComments: res.data.defaultAllowComments }));
            } catch (error) {
                // Keep the INITIAL_DATA fallback (true) if this fails.
            }
        };
        fetchDefault();
    }, []);

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
        formData.append('hasVideo', data.hasVideo);
        formData.append('allowComments', data.allowComments);
        formData.append('image', image);

        setSubmitting(true);
        try {
            const response = await axios.post('/api/blog', formData);
            if (response.data.success) {
                toast.success(response.data.msg);
                setImage(false);
                setData(data => ({ ...INITIAL_DATA, author: data.author, authorImage: data.authorImage, allowComments: data.allowComments }));
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
